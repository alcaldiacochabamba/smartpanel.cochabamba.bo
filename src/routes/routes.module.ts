import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Panel } from './entities/panels.entity';
import { Route } from './entities/route.entity';
import { RouteDetail } from './entities/route-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService],
  //se lo agregar para que el typeorm lo cargue en la BD
  imports: [
      TypeOrmModule.forFeature([Panel,Route, RouteDetail]),
      AuthModule],
  exports: [RoutesService, TypeOrmModule]
})
export class RoutesModule {

}
