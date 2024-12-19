import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Message } from './entities/message.entity';
import { Resource, Scopes } from 'nest-keycloak-connect';

@Controller('api/v1/messages')
@Resource(Message.name)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly _handlerService: HandlerService
  ) {}


  @Get()
  @Scopes('View')
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
  @Scopes('Create')
  public store(
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.store(createMessageDto)    
    .then(response => {
      const { created_at, updated_at, ...message} = response
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
  @Scopes('View')
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
  @Scopes('Edit')
  public update(
    @Param('uuid') uuid: string, 
    @Body() updateMessageDto: UpdateMessageDto
  ) {
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
  @Scopes('Delete')
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
