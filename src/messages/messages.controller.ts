import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { HandlerService } from 'src/handler/handler.service';

@Controller('api/v1/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly _handlerService: HandlerService
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(@Body() createMessageDto: CreateMessageDto,@Req() req: Request) {
    const user_id = req['user'].id; // Assuming your user object has an 'id' property
    createMessageDto.user_id = user_id;
    return this.messagesService.create(createMessageDto)    
    .then(message => {
      return this._handlerService.sendResponse(
        "Se ha registrado correctamente el mensaje",
        message
      );
    })
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "Ha ocurrido un problema",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    });

  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.messagesService.findOne(uuid)
    .then(message => {
      return this._handlerService.sendResponse(
        "Se ha obtenido el mensaje correctamente",
        message
      );
    })
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "Ha ocurrido un problema",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard())
  update(@Param('uuid') uuid: string, @Body() updateMessageDto: UpdateMessageDto, @Req() req: Request) {
    const user_id = req['user'].id;
    updateMessageDto.user_id = user_id;
    return this.messagesService.update(uuid, updateMessageDto)
    .then(message => {
      return this._handlerService.sendResponse(
        "Se ha actualizado el mensaje correctamente",
        message
      )
    })
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "Ha ocurrido un problema",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  remove(@Param('uuid') uuid: string) {
    return this.messagesService.remove(uuid)
    .then(() => {
      return this._handlerService.sendResponse(
        "Se ha eliminado el mensaje correctamente"
      );
    })
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "Ha ocurrido un problema",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
