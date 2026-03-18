import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.xclient.student.findMany({
            include: { user: true },
        });
    }

    async create(data: any) {
        return this.prisma.xclient.student.create({
            data,
        });
    }

    async findOne(id: string) {
        return this.prisma.xclient.student.findUnique({
            where: { id },
            include: { user: true, enrollments: true, feeRecords: true },
        });
    }
}
