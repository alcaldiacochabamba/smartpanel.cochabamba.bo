import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Route } from './entities/route.entity';

@ApiTags('Routes')
@ApiSecurity('basic')
@Controller('api/v1/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) { }


  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.routesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }


  /*-------------------------------------*/


  @Get('panels')
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 200, description: 'Returns all panels', type: Route })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Forbidden, token reloaded' })

  @Get(':uuid/traffic')
  @UseGuards(AuthGuard())
  getTrafficInfo(@Param('uuid') uuid: string) {
    return this.routesService.getTrafficInfo(uuid);
  }




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(+id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }
}
