import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query, HttpCode } from '@nestjs/common';
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

  @Delete(':uuid')
  @HttpCode(200)
  remove(@Param('uuid') uuid: string) {
    return this.routesService.remove(uuid);
  }


  @Get('panels')
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 200, description: 'Returns all panels', type: Route })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Forbidden, token reloaded' })

  @Get(':uuid/traffic')
  @UseGuards(AuthGuard())

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: number) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: number, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

}
