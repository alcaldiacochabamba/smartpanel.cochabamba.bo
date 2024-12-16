import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpStatus, ValidationPipe, HttpException } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { AuthGuard } from '@nestjs/passport';
import { HandlerService } from 'src/handler/handler.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Panel } from './entities/panel.entity';

@Controller('api/v1/panels')
export class PanelsController {
  constructor(
    private readonly panelsService: PanelsService,
    private readonly _handlerService: HandlerService
  ) {}

  @Get()
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  public store(
    @Body(ValidationPipe) createPanelDto: CreatePanelDto ,
    @Req() req: Request
  ) {
    createPanelDto.user_id = req['user'].id;
    return this.panelsService.store(createPanelDto)
    .then(response => {
      const { created_at, updated_at, user_id, ...panel} = response
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
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  public update(
    @Param('uuid') uuid: string, 
    @Body(ValidationPipe) updatePanelDto: UpdatePanelDto, 
    @Req() req: Request
  ) {
    updatePanelDto.user_id = req['user'].id;
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
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
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
