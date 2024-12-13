import { Module } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { PanelsController } from './panels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Panel } from './entities/panel.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HandlerService } from 'src/handler/handler.service';


@Module({
  controllers: [PanelsController],
  providers: [
    PanelsService,
    HandlerService
  ],
  imports: [TypeOrmModule.forFeature([Panel]), AuthModule],
  exports: [PanelsService,TypeOrmModule],

})
export class PanelsModule {}
