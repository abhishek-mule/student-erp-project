import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, FeeStatus } from '@college-erp/prisma';

@Controller('fees')
@UseGuards(AuthGuard)
export class FeesController {
    constructor(private readonly feesService: FeesService) { }

    @Post('record-payment')
    @Roles(Role.ACCOUNTS, Role.COLLEGE_ADMIN)
    async recordPayment(
        @Body('studentId') studentId: string,
        @Body('feeStructureId') feeStructureId: string,
        @Body('amount') amount: number,
        @Body('status') status: FeeStatus,
    ) {
        return this.feesService.createFeeRecord({
            studentId,
            feeStructureId,
            amountPaid: amount,
            status,
        });
    }

    @Get('student/:id')
    async getByStudent(@Param('id') id: string) {
        return this.feesService.getFeesByStudent(id);
    }
}
