import { Injectable, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import axios from 'axios';
import { Route } from './entities/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Panel } from '../panels/entities/panel.entity';

@Injectable()
export class RoutesService {

  constructor(

    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(Panel)
    private panelRepository: Repository<Panel>,
    private dataSource: DataSource

  ) { }

  async getTrafficInfo(uuid: string) {
    const panel = await this.panelRepository.findOneBy({ uuid: uuid });
    let routeList = [];
    if(!panel){
      return { error: 'Error al obtener datos de tráfico. Consulta los registros del servidor para más detalles.' };

    }
    for (const route of panel.routes) {
      routeList.push(await this.getRouteMapsGoogle(route));
    }
    return routeList;
  }

  async getRouteMapsGoogle(route: Route) {
    const apiKey = 'AIzaSyBMDPC4tM2JYgU8gq2tUouiwyK3cHdWmKo'; // Reemplaza con tu propia clave de API de Google Maps

    const { origin, destination, mode, departure_time, traffic_model, title } = route;

    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}&mode=${mode}&departure_time=${departure_time}&traffic_model=${traffic_model}`;
    try {
      const response = await axios.get(apiUrl);
      const trafficInfo = (response.data.routes[0].legs[0].duration_in_traffic.value / 60).toFixed(0);
      const trafficInfoSegundos = response.data.routes[0].legs[0].duration_in_traffic.value;
      const distance = response.data.routes[0].legs[0].distance.text;
      return {
        ok:true, 
        msg:`Destino: ${title}, Distancia: ${distance}, Duración: ${trafficInfoSegundos} segundos` ,
        msg2:`Para llegar a la ${title} tardaras aprox. ${trafficInfo} minutos` 
      };
    } catch (error) {
      console.error('Error al obtener datos de tráfico:', error);
      return {ok:false, error: 'Error al obtener datos de tráfico. Consulta los registros del servidor para más detalles.' };
    }
  }

  findAllPanels() {
    return 'This action view all panels';
  }
  create(createRouteDto: CreateRouteDto) {
    return 'This action adds a new route';
  }

  findAll() {
    return `This action returns all routes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
