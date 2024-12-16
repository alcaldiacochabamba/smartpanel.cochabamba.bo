import { Module } from '@nestjs/common';
import { PanelGateway } from './panel.gateway';
import { PanelsModule } from 'src/panels/panels.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [
    PanelGateway
  ],
  imports: [
    PanelsModule,
    ScheduleModule.forRoot()
  ]
})
export class WebsocketsModule {}
