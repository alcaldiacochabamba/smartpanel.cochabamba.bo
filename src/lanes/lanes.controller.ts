import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { LanesService } from './lanes.service';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Lane } from './entities/lane.entity';
import { Resource, Scopes } from 'nest-keycloak-connect';

@Controller('api/v1/lanes')
@Resource(Lane.name)
export class LanesController {
  constructor(
    private readonly lanesService: LanesService,
    private readonly _handlerService: HandlerService
  ) {}

  @Get()
  @Scopes('View')
  public list(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<Lane>> {
    return this.lanesService.list(query)
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
  public store(@Body(ValidationPipe) createLaneDto: CreateLaneDto) {
    return this.lanesService.store(createLaneDto)
    .then(response => {
      const { created_at, updated_at, ...lane} = response
      return this._handlerService.sendResponse(
        "Se ha registrado correctamente el lane",
        lane
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
    return this.lanesService.show(uuid)
    .then(lane => {
      return this._handlerService.sendResponse(
        "Se ha obtenido el lane correctamente",
        lane
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
    @Body(ValidationPipe) updateLaneDto: UpdateLaneDto
  ) {
    return this.lanesService.update(uuid, updateLaneDto)
    .then(lane => {
      return this._handlerService.sendResponse(
        "Se ha actualizado el lane correctamente",
        lane
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
    return this.lanesService.destroy(uuid)
    .then(() => {
      return this._handlerService.sendResponse(
        "Se ha eliminado el lane correctamente"
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
