import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { LanesService } from './lanes.service';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { AuthGuard } from '@nestjs/passport';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Lane } from './entities/lane.entity';


@Controller('api/v1/lanes')
export class LanesController {
  constructor(
    private readonly lanesService: LanesService,
    private readonly _handlerService: HandlerService
  ) {}

  @Get()
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  public store(@Body(ValidationPipe) createLaneDto: CreateLaneDto) {
    return this.lanesService.store(createLaneDto)
    .then(response => {
      const { created_at, updated_at, user_id, ...lane} = response
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
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
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
