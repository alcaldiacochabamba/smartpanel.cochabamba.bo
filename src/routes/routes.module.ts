import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Panel } from '../panels/entities/panel.entity';
import { Route } from './entities/route.entity';
import { RouteDetail } from './entities/route-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HandlerService } from 'src/handler/handler.service';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, HandlerService],
  imports: [TypeOrmModule.forFeature([Panel,Route, RouteDetail])],
  exports: [RoutesService, TypeOrmModule]
})
export class RoutesModule {

}
