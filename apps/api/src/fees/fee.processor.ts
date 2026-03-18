import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import * as PDFDocument from 'pdfkit';

@Processor('pdf-receipts')
export class FeeProcessor extends WorkerHost {
    constructor(
        private readonly prisma: PrismaService,
        private readonly s3: S3Service,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { feeId, tenantId } = job.data;
        const feeRecord = await this.prisma.originalClient.feeRecord.findUnique({
            where: { id: feeId },
            include: {
                student: { include: { user: true } },
                feeStructure: true,
            },
        });

        if (!feeRecord) return;

        // Generate PDF receipt
        const pdfBuffer = await this.generatePdf(feeRecord);

        // Upload to S3
        const key = `receipts/${tenantId}/${feeId}.pdf`;
        const receiptUrl = await this.s3.uploadFile(key, pdfBuffer, 'application/pdf');

        // Update fee record with receipt URL
        await this.prisma.originalClient.feeRecord.update({
            where: { id: feeId },
            data: { receiptUrl },
        });

        return { receiptUrl };
    }

    private async generatePdf(fee: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Simple PDF content
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
}
