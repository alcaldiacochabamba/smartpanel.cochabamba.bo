import { Injectable, BadRequestException, Logger, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from './entities/panel.entity';
import { Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class PanelsService {

  private readonly logger = new Logger('PanelsService');
  constructor(
    @InjectRepository(Panel) 
    private panelRepository: Repository<Panel>
  ) {}
  
  public async list(query: PaginateQuery): Promise<Paginated<Panel>> {
    return await paginate(query, this.panelRepository, {
      sortableColumns: ['id','code', 'location', 'origin', 'active'],
      nullSort: 'last',
      defaultSortBy: [['code', 'ASC']],
      searchableColumns: ['code', 'location', 'origin'],
      select: ['id', 'code', 'location', 'origin', 'active']
    })
  }

  public async store(createPanelDto: CreatePanelDto): Promise<Panel> {
    return await this.panelRepository.save(
      this.panelRepository.create(createPanelDto)
    );    
  }
  
  public async show(uuid: string) {
    if (!await this.panelRepository.existsBy({id: uuid})) throw new HttpException(`No se ha logrado encontrar el panel con el id ${uuid}`, HttpStatus.NOT_FOUND);
    return await this.panelRepository.findOneBy({id: uuid});
  }

  public async update(uuid: string, updatePanelDto: UpdatePanelDto): Promise<Panel> {
    if(!await this.panelRepository.existsBy({id: uuid})) throw new HttpException(`No se ha logrado encontrar el panel con el id ${uuid}`,HttpStatus.NOT_FOUND); 
    await this.panelRepository.update(uuid, updatePanelDto);
    return await this.panelRepository.findOneBy({id: uuid})
  }

  public async destroy(uuid: string): Promise<string> {
    const panel = await this.panelRepository.findOneBy({id: uuid});
    if (!panel) throw new HttpException(`No se ha logrado encontrar el panel con el id ${uuid}`, HttpStatus.NOT_FOUND);
    this.panelRepository.remove(panel);
    return `El panel con el id ${uuid}} se ha eliminado correctamente`;
  }

  private getLatestDetail(details: any[]): any[] {
    if (details.length === 0) return [];
    details.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    return [details[0]];
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');
  }
}
