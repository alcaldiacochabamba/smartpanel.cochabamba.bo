import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { LanesService } from './lanes.service';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { AuthGuard } from '@nestjs/passport';
import { HandlerService } from 'src/handler/handler.service';


@Controller('api/v1/lanes')
export class LanesController {
  constructor(
    private readonly lanesService: LanesService,
    private readonly _handlerService: HandlerService
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createLaneDto: CreateLaneDto) {
    return this.lanesService.create(createLaneDto)
    .then(lane => {
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

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.lanesService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.lanesService.findOne(uuid)
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
  update(@Param('uuid') uuid: string, @Body() updateLaneDto: UpdateLaneDto) {
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
  remove(@Param('uuid') uuid: string) {
    return this.lanesService.remove(uuid)
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
