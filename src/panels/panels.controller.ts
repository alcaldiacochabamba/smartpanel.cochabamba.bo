import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/panels')
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePanelDto: UpdatePanelDto) {
    return this.panelsService.update(+id, updatePanelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelsService.remove(+id);
  }
}
