import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(AuthGuard())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(@Body() createMessageDto: CreateMessageDto,@Req() req: Request) {
    const user_id = req['user'].id; // Assuming your user object has an 'id' property
    createMessageDto.user_id = user_id;
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.messagesService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard())
  update(@Param('uuid') uuid: string, @Body() updateMessageDto: UpdateMessageDto, @Req() req: Request) {
    const user_id = req['user'].id;
    updateMessageDto.user_id = user_id;
    return this.messagesService.update(uuid, updateMessageDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  remove(@Param('uuid') uuid: string) {
    return this.messagesService.remove(uuid);
  }
}
