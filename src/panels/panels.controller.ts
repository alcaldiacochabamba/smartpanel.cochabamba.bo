import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ValidationPipe, HttpException } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Panel } from './entities/panel.entity';
import { Public, Resource, Scopes} from 'nest-keycloak-connect';

@Controller('api/v1/panels')
@Resource(Panel.name)
export class PanelsController {
  constructor(
    private readonly panelsService: PanelsService,
    private readonly _handlerService: HandlerService
  ) {}

  @Get()
  @Scopes('View')
  public list(
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<Panel>>{
    return this.panelsService.list(query)
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
    @Body(ValidationPipe) createPanelDto: CreatePanelDto
  ) {
    return this.panelsService.store(createPanelDto)
    .then(response => {
      const { created_at, updated_at, ...panel} = response
      return this._handlerService.sendResponse(
        "Se ha registrado el panel correctamente",
        panel
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
    })
  }

  @Get(':uuid')
  @Scopes('View')
  public show(@Param('uuid') uuid: string) {
    return this.panelsService.show(uuid)
    .then(panel => {
      return this._handlerService.sendResponse(
        "Se ha obtenido el panel correctamente",
        panel
      );
    })
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "An error occurred",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    })
  }

  @Patch(':uuid')
  @Scopes('Edit')
  public update(
    @Param('uuid') uuid: string, 
    @Body(ValidationPipe) updatePanelDto: UpdatePanelDto
  ) {
    return this.panelsService.update(uuid, updatePanelDto)
    .then(panel => {
      return this._handlerService.sendResponse(
        "Se ha actualizado el panel correctamente",
        panel
      );
    })
    .catch((error) => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "An error occurred",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  @Delete(':uuid')
  @Scopes('Delete')
  public destroy(@Param('uuid') uuid: string) {
    return this.panelsService.destroy(uuid)
    .then((panel) => {
      return this._handlerService.sendResponse(
        "Se ha actualizado el panel correctamente",
        panel
      );
    })
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

  @Get('/complete/:uuid')
  @Public(true)
  public getPanelCompleteById(
    @Param('uuid') uuid: string
  ) {
    return this.panelsService.getPanelCompleteById(uuid)
    .then((panel) => {
      return this._handlerService.sendResponse(
        "Se ha obtenido el panel correctamente",
        panel
      );
    })
    .catch(error => {
      throw new HttpException(
        {
          success: false,
          message: error.response || "An error occurred",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    })
  }
}
