import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, AttendanceStatus } from '@college-erp/prisma';

@Controller('attendance')
@UseGuards(AuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('mark')
    @Roles(Role.TEACHER, Role.COLLEGE_ADMIN)
    async mark(
        @Body('courseId') courseId: string,
        @Body('studentId') studentId: string,
        @Body('date') date: string,
        @Body('status') status: AttendanceStatus,
    ) {
        return this.attendanceService.markAttendance(courseId, studentId, new Date(date), status);
    }

    @Get('course')
    @Roles(Role.TEACHER, Role.COLLEGE_ADMIN)
    async getByCourse(@Query('courseId') courseId: string, @Query('date') date: string) {
        return this.attendanceService.getAttendanceByCourse(courseId, new Date(date));
    }
}
