import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from './entities/panel.entity';
import { Repository } from 'typeorm';

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

  findAll() {
    const panels = this.panelRepository.find();
    return panels;
  }

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
