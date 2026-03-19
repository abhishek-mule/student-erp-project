import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeeStatus } from '@college-erp/prisma';
import { getTenantId } from '../tenant/tenant.context';
import { S3Service } from '../s3/s3.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class FeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async createFeeRecord(data: {
    studentId: string;
    feeStructureId: string;
    amountPaid: number;
    status: FeeStatus;
  }) {
    const tenantId = getTenantId();
    if (!tenantId) throw new Error('No tenant context');

    const record = await this.prisma.originalClient.feeRecord.create({
      data: {
        student_id: data.studentId,
        feeStructure_id: data.feeStructureId,
        amountPaid: data.amountPaid,
        status: data.status,
        tenant_id: tenantId,
      },
    });

    // Trigger receipt generation if paid (Asynchronous for now without BullMQ)
    if (data.status === FeeStatus.PAID || data.status === FeeStatus.PARTIAL) {
      this.generateAndUploadReceipt(record.id, tenantId).catch(async (err) => {
        console.error(`[PDF Service] Silent background failure on FeeID ${record.id}:`, err);
        
        try {
          await (this.prisma.originalClient as any).auditLog.create({
            data: {
              tenant_id: tenantId,
              action: 'PDF_UPLOAD_FAILED',
              entity: 'FeeRecord',
              entity_id: record.id,
              changes: { error: err.message, timestamp: new Date().toISOString() },
            },
          });
        } catch (auditErr) {
          console.error('[CRITICAL] Could not write audit log for failed receipt:', auditErr);
        }
      });
    }

    return record;
  }

  private async generateAndUploadReceipt(feeId: string, tenantId: string) {
    const feeRecord = await this.prisma.originalClient.feeRecord.findUnique({
      where: { id: feeId },
      include: {
        student: { include: { user: true } },
        feeStructure: true,
      },
    });

    if (!feeRecord) return;

    const pdfBuffer = await this.generatePdf(feeRecord);
    const key = `receipts/${tenantId}/${feeId}.pdf`;
    const receiptUrl = await this.s3.uploadFile(
      key,
      pdfBuffer,
      'application/pdf',
    );

    await this.prisma.originalClient.feeRecord.update({
      where: { id: feeId },
      data: { receiptUrl },
    });
  }

  private async generatePdf(fee: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      doc.fontSize(20).text('FEE RECEIPT', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Receipt ID: ${fee.id}`);
      doc.text(`Student: ${fee.student.user.name}`);
      doc.text(`Structure: ${fee.feeStructure.name}`);
      doc.text(`Amount Paid: ₹${fee.amountPaid}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.end();
    });
  }

  async getFeesByStudent(studentId: string) {
    return this.prisma.originalClient.feeRecord.findMany({
      where: { student_id: studentId },
      include: { feeStructure: true },
    });
  }
}
