import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class ResultsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly events: EventsGateway,
    ) { }

    async upsertResult(data: { examId: string; studentId: string; marks: number; grade?: string }) {
        const tenantId = getTenantId();
        if (!tenantId) throw new Error('Tenant context missing');

        const result = await this.prisma.xclient.result.upsert({
            where: {
                id: `${data.examId}-${data.studentId}`, // Assuming a compound ID logic or checking existence
            },
            update: {
                marks: data.marks,
                grade: data.grade,
            },
            create: {
                exam_id: data.examId,
                student_id: data.studentId,
                marks: data.marks,
                grade: data.grade,
            },
        });

        // Real-time update for the student
        this.events.emitToUser(tenantId, data.studentId, 'result.published', result);

        return result;
    }

    async getResultsByExam(examId: string) {
        return this.prisma.xclient.result.findMany({
            where: { exam_id: examId },
            include: { student: { include: { user: true } } },
        });
    }
}
