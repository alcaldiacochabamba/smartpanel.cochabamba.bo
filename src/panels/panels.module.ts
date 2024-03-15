import { Module } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { PanelsController } from './panels.controller';

@Module({
  controllers: [PanelsController],
  providers: [PanelsService],
})
export class PanelsModule {}
