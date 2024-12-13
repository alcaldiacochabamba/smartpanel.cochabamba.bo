import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import axios from 'axios';
import { Route } from './entities/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Panel } from '../panels/entities/panel.entity';
import { RouteDetail } from './entities/route-detail.entity';
import { Lane } from 'src/lanes/entities/lane.entity';
import { CreateLaneDto } from 'src/lanes/dto/create-lane.dto';
import { Cron,CronExpression  } from '@nestjs/schedule';
import * as cron from 'node-cron';


@Injectable()
export class RoutesService {

  private readonly logger = new Logger('PanelsService');

  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(Panel)
    private panelRepository: Repository<Panel>,
    @InjectRepository(RouteDetail) 
    private routeDetailRepository: Repository<RouteDetail>,
  ) { }

 

  findAll() {
    const routes = this.routeRepository.find();
    return routes;
  }

  async create(createRouteDto: CreateRouteDto) {
    const route = this.routeRepository.create(createRouteDto);
    route.departure_time = "now";
    route.traffic_model = "best_guess";
    await this.routeRepository.save(route);
    // let routeList = [];
    // routeList.push(await this.getRouteMapsGoogle(route.id));
    // route.details = routeList;
    // await this.routeRepository.save(route);
    return route;
  }

  async remove(uuid: string) {
    const route = await this.routeRepository.findOneBy({ id: uuid });
    if (!route) throw new HttpException(`No se ha logrado encontrar la ruta con el id ${uuid}`, HttpStatus.NOT_FOUND);
    await this.routeRepository.remove(route);
    return "La ruta se ha eliminado correctamente";
  }


  async getRouteMapsGoogle(route_id: string) {
    const apiKey = 'AIzaSyBlnKdEioRJV1_Vnc2iXhVnOP5H_lxRVWM'; // Reemplaza con tu propia clave de API de Google Maps
    const rutaLane = await this.routeRepository.findOne({ where: { id: route_id }, relations: ['lane', 'lane.panel'] });
    const { destination, mode, departure_time, traffic_model, lane } = rutaLane;
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(lane.panel.origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}&mode=${mode}&departure_time=${departure_time}&traffic_model=${traffic_model}`; 
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

  @Cron('0 */15 * * * *') 
  async actualizarRoutes() {
    try {
      const apiKey = 'AIzaSyBlnKdEioRJV1_Vnc2iXhVnOP5H_lxRVWM';
      // Obtener todos los paneles activos
      const panelesActivos = await this.panelRepository.find({ where: { active: true }, relations: ['lanes', 'lanes.routes', 'lanes.routes.lane', 'lanes.routes.lane.panel'] });
      // Iterar sobre cada panel activo y actualizar las rutas asociadas
      for (const panel of panelesActivos) {
        for (const lane of panel.lanes) {
          if (!lane || !lane.routes) continue;
          const rutas = lane.routes;
          //console.log(rutas);
          // Iterar sobre cada ruta y actualizar sus detalles utilizando la API de Google Maps
          for (const ruta of rutas) {
            if (!ruta.lane || !ruta.lane.panel) continue;
            const { destination, mode, departure_time, traffic_model, lane } = ruta;
            const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(lane.panel.origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}&mode=${mode}&departure_time=${departure_time}&traffic_model=${traffic_model}`;
            try {
              const response = await axios.get(apiUrl);
              const routeDetail = new RouteDetail();
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
              routeDetail.route = ruta;
              await this.routeDetailRepository.save(routeDetail); // Guardar los detalles de la ruta
              //console.log("guardar");
            } catch (error) {
              console.error('Error al obtener datos de tráfico:', error);
              throw new InternalServerErrorException('Error al obtener datos de tráfico. Consulta los registros del servidor para más detalles.');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en actualizarRoutes:', error);
      throw new InternalServerErrorException('Error al actualizar las rutas.');
    }
  }

  async findOne(uuid: string) {
    const route = await this.routeRepository.findOneBy({id: uuid});
    if (!route) throw new HttpException(`No se ha logrado encontrar la ruta con el id ${uuid}`, HttpStatus.NOT_FOUND);
    return route;
  }

  async update(uuid: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.routeRepository.findOneBy({id: uuid});
    if (!route) throw new HttpException(`No se ha logrado encontrar la ruta con el id ${uuid}`, HttpStatus.NOT_FOUND);
    return this.routeRepository.update(uuid, updateRouteDto);
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');
  }  
}
