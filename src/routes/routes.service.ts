import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import axios from 'axios';
import { Route } from './entities/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Panel } from '../panels/entities/panel.entity';
import { RouteDetail } from './entities/route-detail.entity';

@Injectable()
export class RoutesService {

  private readonly logger = new Logger('PanelsService');

  constructor(

    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(Panel)
    private panelRepository: Repository<Panel>,
    private dataSource: DataSource

  ) { }


  findAll() {
    const routes = this.routeRepository.find();
    return routes;
  }

  async create(createRouteDto: CreateRouteDto) {

    try {

      const route = this.routeRepository.create(createRouteDto);
      route.departure_time = "now";
      route.traffic_model = "best_guess";
      await this.routeRepository.save(route);
      let routeList = [];
      routeList.push(await this.getRouteMapsGoogle(route.id));
      route.details = routeList;
      await this.routeRepository.save(route);
      return route;

    } catch (error) {
      this.manageDBExeptions(error);
    }
  }

  async remove(uuid: string): Promise<{ message: string; }> {
    const route = await this.routeRepository.findOneBy({ id: uuid });

    if (!route) {
      throw new BadRequestException(`Route with uuid ${uuid} not found`);
    }

    await this.routeRepository.remove(route);
    return { message: 'Route successfully removed' };
  }


 async getRouteMapsGoogle(route_id: string) {
  const apiKey = 'AIzaSyBMDPC4tM2JYgU8gq2tUouiwyK3cHdWmKo'; // Reemplaza con tu propia clave de API de Google Maps
  const rutaPanel = await this.routeRepository.findOne({ where: { id: route_id }, relations: ['panel'] });
  const { destination, mode, departure_time, traffic_model, title, panel  } = rutaPanel;
  console.log('----------------------')
  console.log('Datos de la ruta:', rutaPanel);

  const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(panel.origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}&mode=${mode}&departure_time=${departure_time}&traffic_model=${traffic_model}`;
  try {
    const response = await axios.get(apiUrl);
    const trafficInfo = (response.data.routes[0].legs[0].duration_in_traffic.value / 60).toFixed(0);
    const trafficInfoSegundos = response.data.routes[0].legs[0].duration_in_traffic.value;
    const distance = response.data.routes[0].legs[0].distance.text;

    let routeDetail = new RouteDetail();
    routeDetail.title = response.data.routes[0].summary;
    routeDetail.distance = response.data.routes[0].legs[0].distance.value;
    routeDetail.duration = response.data.routes[0].legs[0].duration.value;
    routeDetail.duration_in_traffic = response.data.routes[0].legs[0].duration_in_traffic.value;
    routeDetail.end_address = response.data.routes[0].legs[0].end_address;
    routeDetail.end_address_lat = response.data.routes[0].legs[0].end_location.lat;
    routeDetail.end_address_lng = response.data.routes[0].legs[0].end_location.lng;
    routeDetail.start_address = response.data.routes[0].legs[0].start_address;
    routeDetail.start_address_lat = response.data.routes[0].legs[0].start_location.lat;
    routeDetail.start_address_lng = response.data.routes[0].legs[0].start_location.lng;
    routeDetail.route_id = route_id;

    return routeDetail;
  } catch (error) {
    console.error('Error al obtener datos de tráfico:', error);
    throw new Error('Error al obtener datos de tráfico. Consulta los registros del servidor para más detalles.');
  }
}


  /*--------------------------------------------------------------*/

  async getTrafficInfo(uuid: string) {
    const panel = await this.panelRepository.findOneBy({ id: uuid });
    let routeList = [];
    if (!panel) {
      return { error: 'Error al obtener datos de tráfico. Consulta los registros del servidor para más detalles.' };

    }
    for (const route of panel.routes) {
      //routeList.push(await this.getRouteMapsGoogle(route));
    }
    return routeList;
  }





  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }


  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');

  }
}
