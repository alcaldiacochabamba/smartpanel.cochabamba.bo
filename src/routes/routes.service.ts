import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import axios from 'axios';
import { Route } from './entities/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Panel } from '../panels/entities/panel.entity';

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
    
    try{
      
      const route = this.routeRepository.create(createRouteDto);
      await this.routeRepository.save(route);    
      return route;

    }catch(error){
      this.manageDBExeptions(error);
    }
  }
  
  /*--------------------------------------------------------------*/

  async getTrafficInfo(uuid: string) {
    const panel = await this.panelRepository.findOneBy({ id: uuid });
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

    const {  destination, mode, departure_time, traffic_model, title } = route;

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
 



  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }


  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');
    
  }
}
