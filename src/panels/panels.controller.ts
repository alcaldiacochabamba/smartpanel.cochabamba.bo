import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpStatus, ValidationPipe, HttpException } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { AuthGuard } from '@nestjs/passport';
import { HandlerService } from 'src/handler/handler.service';

@Controller('api/v1/panels')
export class PanelsController {
  constructor(
    private readonly panelsService: PanelsService,
    private readonly _handlerService: HandlerService
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body(ValidationPipe) createPanelDto: CreatePanelDto ,@Req() req: Request) {
    createPanelDto.user_id = req['user'].id;
    return this.panelsService.create(createPanelDto)
    .then(panel => {
      return this._handlerService.sendResponse(
        "Se ha registrado correctamente el panel",
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

  @Get()
  @UseGuards(AuthGuard())
  async findAll() {
    return await this.panelsService.findAll();
    //return this.panelsService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.panelsService.findOne(uuid)
    .then(panel => {
      return this._handlerService.sendResponse(
        "Se ha obtenido el panel correctamente",
        panel
      );
    })
    .catch(error => {
      console.log(error)
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
  update(@Param('uuid') uuid: string, @Body(ValidationPipe) updatePanelDto: UpdatePanelDto, @Req() req: Request) {
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
  remove(@Param('uuid') uuid: string) {
    return this.panelsService.remove(uuid)
    .then(() => {
      return this._handlerService.sendResponse(
        "Se ha eliminado el panel correctamente"
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
}
