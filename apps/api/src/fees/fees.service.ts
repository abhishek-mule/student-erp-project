import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FeeStatus } from '@college-erp/prisma';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class FeesService {
    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue('pdf-receipts') private readonly receiptQueue: Queue,
    ) { }

    async createFeeRecord(data: {
        studentId: string;
        feeStructureId: string;
        amountPaid: number;
        status: FeeStatus;
    }) {
        const tenantId = getTenantId();
        if (!tenantId) throw new Error('No tenant context');

        const record = await this.prisma.xclient.feeRecord.create({
            data: {
                student_id: data.studentId,
                feeStructure_id: data.feeStructureId,
                amountPaid: data.amountPaid,
                status: data.status,
            },
        });

        // Queue receipt generation if paid
        if (data.status === FeeStatus.PAID || data.status === FeeStatus.PARTIAL) {
            await this.receiptQueue.add('generate-receipt', {
                feeId: record.id,
                tenantId,
            });
        }

        return record;
    }

    async getFeesByStudent(studentId: string) {
        return this.prisma.xclient.feeRecord.findMany({
            where: { student_id: studentId },
            include: { feeStructure: true },
        });
    }
}
