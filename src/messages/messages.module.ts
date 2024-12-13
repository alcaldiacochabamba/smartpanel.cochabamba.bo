import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HandlerService } from 'src/handler/handler.service';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    HandlerService
  ],
  imports: [TypeOrmModule.forFeature([Message]), AuthModule],
  exports: [MessagesService,TypeOrmModule],
})
export class MessagesModule {}
