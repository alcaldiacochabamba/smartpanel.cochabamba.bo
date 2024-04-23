import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/panels')
export class PanelsController {
  constructor(private readonly panelsService: PanelsService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @UseGuards(AuthGuard())
  create(@Body() createPanelDto: CreatePanelDto ,@Req() req: Request) {
    const user_id = req['user'].id; // Assuming your user object has an 'id' property
    createPanelDto.user_id = user_id;
    return this.panelsService.create(createPanelDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.panelsService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.panelsService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard())
  update(@Param('uuid') uuid: string, @Body() updatePanelDto: UpdatePanelDto, @Req() req: Request) {
    const user_id = req['user'].id;
    updatePanelDto.user_id = user_id;
    return this.panelsService.update(uuid, updatePanelDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  remove(@Param('uuid') uuid: string) {
    return this.panelsService.remove(uuid);
  }
}
