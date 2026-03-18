import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { FeeProcessor } from './fee.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pdf-receipts',
    }),
  ],
  providers: [FeesService, FeesController, FeeProcessor],
  controllers: [FeesController],
})
export class FeesModule { }
