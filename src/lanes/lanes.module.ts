import { Module } from '@nestjs/common';
import { LanesService } from './lanes.service';
import { LanesController } from './lanes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lane } from './entities/lane.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LanesController],
  providers: [LanesService],
  imports: [TypeOrmModule.forFeature([Lane]), AuthModule],
  exports: [LanesService,TypeOrmModule],

})
export class LanesModule {}
