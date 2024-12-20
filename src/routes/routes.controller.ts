import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Resource, Scopes } from 'nest-keycloak-connect';

@Controller('api/v1/routes')
@Resource(Route.name)
export class RoutesController {
  
  constructor(
    private readonly routesService: RoutesService,
    private readonly _handlerService: HandlerService
  ) { }


  @Get()
  @Scopes('View')
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
  @Scopes('Create')
  public store(
    @Body(ValidationPipe) createRouteDto: CreateRouteDto
  ) {
    return this.routesService.store(createRouteDto)
    .then(response => {
      const { created_at, updated_at, ...route} = response
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
  @Scopes('View')
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
  @Scopes('Edit')
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
  @Scopes('Delete')
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

  @Get('by-lane/:uuid')
  @Scopes('View')
  public getByLaneId(@Param('uuid') uuid: string) {
    return this.routesService.getByLaneId(uuid)
    .then(route => {
      return this._handlerService.sendResponse(
        "Se han obtenido las rutas correctamente",
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
