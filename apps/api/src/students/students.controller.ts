import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@college-erp/prisma';

@Controller('students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(Role.COLLEGE_ADMIN, Role.TEACHER)
  findAll() {
    return this.studentsService.findAll();
  }

  @Post()
  @Roles(Role.COLLEGE_ADMIN)
  create(@Body() data: any) {
    return this.studentsService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }
}
