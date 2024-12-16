import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query, HttpCode, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Route } from './entities/route.entity';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { query } from 'express';

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
  public list(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<Route>> {
    return this.routesService.list(query)
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
    @Body(ValidationPipe) createRouteDto: CreateRouteDto
  ) {
    return this.routesService.store(createRouteDto)
    .then(response => {
      const { created_at, updated_at, user_id, ...route} = response
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

  @Get(':uuid')
  @UseGuards(AuthGuard())
  public show(@Param('uuid') uuid: string) {
    return this.routesService.show(uuid)
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
  public update(
    @Param('uuid') uuid: string, 
    @Body(ValidationPipe) updateRouteDto: UpdateRouteDto
  ) {
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

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  public destroy(@Param('uuid') uuid: string) {
    return this.routesService.destroy(uuid)
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
}
