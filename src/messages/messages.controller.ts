import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Message } from './entities/message.entity';

@Controller('api/v1/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly _handlerService: HandlerService
  ) {}


  @Get()
  @UseGuards(AuthGuard())
  public list(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<Message>> {
    return this.messagesService.list(query)
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "An error occurred",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }


  @Post()
  @UseGuards(AuthGuard())
  public store(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request
  ) {
    createMessageDto.user_id = req['user'].id;
    return this.messagesService.store(createMessageDto)    
    .then(response => {
      const { created_at, updated_at, user_id, ...message} = response
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


  @Get(':uuid')
  @UseGuards(AuthGuard())
  public show(@Param('uuid') uuid: string) {
    return this.messagesService.show(uuid)
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
  public update(
    @Param('uuid') uuid: string, 
    @Body() updateMessageDto: UpdateMessageDto, 
    @Req() req: Request
  ) {
    updateMessageDto.user_id = req['user'].id;
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
  public destroy(@Param('uuid') uuid: string) {
    return this.messagesService.destroy(uuid)
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
