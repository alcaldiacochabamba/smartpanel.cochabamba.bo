import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LanesService } from './lanes.service';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('api/v1/lanes')
export class LanesController {
  constructor(private readonly lanesService: LanesService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createLaneDto: CreateLaneDto) {
    return this.lanesService.create(createLaneDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.lanesService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.lanesService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard())
  update(@Param('uuid') uuid: string, @Body() updateLaneDto: UpdateLaneDto) {
    return this.lanesService.update(uuid, updateLaneDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  remove(@Param('uuid') uuid: string) {
    return this.lanesService.remove(uuid);
  }
}
