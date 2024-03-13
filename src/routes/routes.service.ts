import { Injectable, Logger } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import axios from 'axios';
import { Route } from './entities/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoutesService {

  constructor(

    @InjectRepository(Route)
    private routeRepository: Repository<Route>,

    private dataSource: DataSource

  ) { }

  async getTrafficInfo(uuid: string) {
    const apiKey = 'AIzaSyBMDPC4tM2JYgU8gq2tUouiwyK3cHdWmKo'; // Reemplaza con tu propia clave de API de Google Maps
  
    const route = await this.routeRepository.findOneBy({ uuid: uuid });
    const { origin, destination, mode, departure_time, traffic_model } = route;


    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}&mode=${mode}&departure_time=${departureTime}&traffic_model=${trafficModel}`;
    try {
      const response = await axios.get(apiUrl);
      const trafficInfo = response.data.routes[0].legs[0].duration_in_traffic.text;
      return { trafficInfo };
    } catch (error) {
      console.error('Error al obtener datos de tráfico:', error);
      return { error: 'Error al obtener datos de tráfico. Consulta los registros del servidor para más detalles.' };
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
