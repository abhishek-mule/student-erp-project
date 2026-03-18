import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FeesModule } from './fees/fees.module';
import { ExamsModule } from './exams/exams.module';
import { ResultsModule } from './results/results.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    PrismaModule,
    EventsModule,
    StudentsModule,
    UsersModule,
    AttendanceModule,
    FeesModule,
    ExamsModule,
    ResultsModule,
    AnnouncementsModule,
    S3Module,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
