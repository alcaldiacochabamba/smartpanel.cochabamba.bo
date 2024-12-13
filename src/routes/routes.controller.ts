import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Route } from './entities/route.entity';
import { HandlerService } from 'src/handler/handler.service';

@ApiTags('Routes')
@ApiSecurity('basic')
@Controller('api/v1/routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
    private readonly _handlerService: HandlerService
  ) { }


  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.routesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto)
    .then(route => {
      return this._handlerService.sendResponse(
        "Se ha registrado correctamente la ruta",
        route
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

  @Delete(':uuid')
  @HttpCode(200)
  remove(@Param('uuid') uuid: string) {
    return this.routesService.remove(uuid)
    .then(() => {
      return this._handlerService.sendResponse(
        "Se ha eliminado la ruta correctamente"
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


  // @Get('panels')
  // @UseGuards(AuthGuard())
  // @ApiResponse({ status: 200, description: 'Returns all panels', type: Route })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // @ApiResponse({ status: 401, description: 'Forbidden, token reloaded' })

  // @Get(':uuid/traffic')
  // @UseGuards(AuthGuard())

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.routesService.findOne(uuid)
    .then(route => {
      return this._handlerService.sendResponse(
        "Se ha obtenido la ruta correctamente",
        route
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

  @Patch(':uuid')
  @UseGuards(AuthGuard())
  update(@Param('uuid') uuid: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(uuid, updateRouteDto)
    .then(route => {
      return this._handlerService.sendResponse(
        "Se ha actualizado la ruta correctamente",
        route
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

}
