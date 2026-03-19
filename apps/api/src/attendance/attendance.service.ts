import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { AttendanceStatus } from '@college-erp/prisma';
import { getTenantId } from '../tenant/tenant.context';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
  ) {}

  async markAttendance(
    courseId: string,
    studentId: string,
    date: Date,
    status: AttendanceStatus,
  ) {
    const tenantId = getTenantId();
    if (!tenantId) throw new Error('Tenant ID not found in context');

    const attendance = await this.prisma.xclient.attendance.create({
      data: {
        course_id: courseId,
        student_id: studentId,
        date,
        status,
      } as any,
    });

    // Realtime update to tenant room and student specific room
    this.events.emitToTenant(tenantId, 'attendance.marked', attendance);
    this.events.emitToUser(tenantId, studentId, 'dashboard.metric', {
      type: 'attendance',
      value: status,
    });

    return attendance;
  }

  async getAttendanceByCourse(courseId: string, date: Date) {
    return this.prisma.xclient.attendance.findMany({
      where: {
        course_id: courseId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    } as any);
  }
}
