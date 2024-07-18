import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from './entities/panel.entity';
import { Repository } from 'typeorm';
import { Lane } from 'src/lanes/entities/lane.entity';
import { Route } from 'src/routes/entities/route.entity';

@Injectable()
export class PanelsService {

  private readonly logger = new Logger('PanelsService');
  constructor(
    @InjectRepository(Panel) 
    private panelRepository: Repository<Panel>) {}
  
  async create(createPanelDto: CreatePanelDto) {
    try{
      
      const panel = this.panelRepository.create(createPanelDto);
      await this.panelRepository.save(panel);    
      return panel;

    }catch(error){
      this.manageDBExeptions(error);
    }
  }

  /*async findAll() {
    const panels = await this.panelRepository.find(); // Espera a que la promesa se resuelva
    //return this.categorizePanelsByStatus(panels); //retorno de un tipo de paneles con objetos dentro de un array
    //return this.categorizePanelsByCarril(panels);
    return panels;
  }*/

  
  async findAll() {
    const panels = await this.panelRepository.find({ relations: ['lanes', 'lanes.routes', 'lanes.routes.details'] });
    // Procesar cada panel
    const panelsWithLatestDetails = panels.map(panel => {
      const panelCopy = { ...panel };
      //console.log(panelCopy)
      // Procesar cada carril del panel
      panelCopy.lanes = panel.lanes.map(lane => {
        const laneCopy = { ...lane };
        //console.log(laneCopy);
        // Procesar cada ruta del carril
        laneCopy.routes = lane.routes.map(route => {
          const routeCopy = { ...route };
          //console.log(routeCopy);
          // Obtener el último detalle de la ruta
          const latestDetail = route.details.reduce((latest, detail) => {
            return detail.created_at > latest.created_at ? detail : latest;
          }, route.details[0]);
          // Crear un nuevo objeto sin el campo 'id' en el detalle
          const cleanDetail = { ...latestDetail };
          delete cleanDetail.id; // Eliminar el campo 'id'
          // Asignar el detalle limpio a la ruta
          routeCopy.details = [cleanDetail];
          //console.log(routeCopy);
          return routeCopy;
        });
        //console.log(laneCopy);
        return laneCopy;
      });
      //console.log(panelCopy);
      return panelCopy;
    });
    return panelsWithLatestDetails;
  }
    


  private categorizePanelsByStatus(panels) {
    //funcion para separar en arrays
    /*const categorized = {ruta1: [],ruta2:[],ruta3:[]};
      panels.forEach(panel => {
        categorized.ruta1.push(panel);
      });
      return categorized;
    */
    // Crea un objeto para almacenar los paneles categorizados
    const categorizedPanels = {};

    // Itera sobre cada panel en la lista
    panels.forEach(panel => {
      // Si la categoría del panel aún no existe en el objeto, créala
      if (!categorizedPanels[panel.code]) {
        categorizedPanels[panel.code] = [];
      }

      // Añade el panel a la categoría correspondiente
      categorizedPanels[panel.code].push(panel);
    });

    // Convierte el objeto a un array de objetos con la estructura requerida
    const result = Object.keys(categorizedPanels).map(key => {
      return { [`panel_${key}`]: categorizedPanels[key] };
    });

    return result;
  }

  categorizePanelsByArray(panels){
    // Crea un objeto para almacenar los paneles categorizados
    const categorizedPanels = {};
    // Itera sobre cada panel en la lista
    panels.forEach(panel => {
      const panelCode = `panel_${panel.code}`;

      // Si la categoría del panel aún no existe en el objeto, créala
      if (!categorizedPanels[panelCode]) {
        categorizedPanels[panelCode] = [];
      }

      // Añade el panel a la categoría correspondiente
      categorizedPanels[panelCode].push(panel);
    });
    return categorizedPanels;
  }


  /*categorizePanelsByCarril(panels) {
    // Crea un objeto para almacenar los paneles categorizados
    const categorizedPanels = {};
    // Itera sobre cada panel en la lista
    panels.forEach(panel => {
      const panelCode = `panel_${panel.code}`;
      // Si la categoría del panel aún no existe en el objeto, créala
      if (!categorizedPanels[panelCode]) {
        categorizedPanels[panelCode] = [];
      }
      // Crea una copia del panel para evitar referencias circulares
      const panelCopy = { ...panel };
      // Agrupa las rutas por carril
      const routesByCarril = {};
      // Si hay rutas presentes en el panel, agrúpalas por carril
      if (panelCopy.routes) {
        // Ordena las rutas por carril de forma ascendente
        const sortedRoutes = panelCopy.routes.sort((a, b) => a.carril.localeCompare(b.carril));
        for (const route of sortedRoutes) {
          const carrilKey = `carril_${route.carril}`;
          if (!routesByCarril[carrilKey]) {
            routesByCarril[carrilKey] = [];
          }
          routesByCarril[carrilKey].push(route);
        }
      }
      // Asigna las rutas agrupadas por carril al panel
      panelCopy.routes = routesByCarril;
      // Añade el panel a la categoría correspondiente
      categorizedPanels[panelCode].push(panelCopy);
    });
    return categorizedPanels;
  }*/

  async findOne(uuid: string) {
    const panel = await this.panelRepository.findOneBy({ id: uuid });
    if (!panel) throw new BadRequestException(`Panel with id ${uuid} not found`);
    return panel;
  }

  async update(uuid: string, updatePanelDto: UpdatePanelDto) {
    try {
      const panel = await this.panelRepository.findOneBy({id: uuid});
      if (!panel) throw new BadRequestException(`Panel with id ${uuid} not found`);
      this.panelRepository.update(uuid, updatePanelDto);
      return panel;
    } catch(error) {
      this.manageDBExeptions(error)
    }
  }

  async remove(uuid: string) {
    try {
      const panel = await this.panelRepository.findOneBy({id: uuid});
      if (!panel) throw new BadRequestException(`Panel with id ${uuid} not found`);
      this.panelRepository.remove(panel);
      return `Panel with id ${uuid} has been delete`;
    }catch(error) {
      this.manageDBExeptions(error);
    }
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');
    
  }
}
