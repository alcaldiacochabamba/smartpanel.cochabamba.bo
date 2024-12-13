import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { DataSource, Repository } from 'typeorm';
import { Lane } from './entities/lane.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class LanesService {
  private readonly logger = new Logger('PanelsService');

  constructor(
    @InjectRepository(Lane)
    private laneRepository: Repository<Lane>,
    private dataSource: DataSource

  ){}

  async create(createLaneDto: CreateLaneDto) {
    const lane = this.laneRepository.create(createLaneDto);
    await this.laneRepository.save(lane);
    return lane;
  }

  findAll() {
    const lanes = this.laneRepository.find();
    return lanes;  
  }

  async findOne(uuid: string) {
    const lane = await this.laneRepository.findOneBy({id: uuid});
    if (!lane) throw new BadRequestException(`No existe la lane con el id ${uuid}`);
    return lane;
  }

  async update(uuid: string, updateLaneDto: UpdateLaneDto) {
    const lane = await this.laneRepository.findOneBy({id: uuid});
    if (!lane) throw new BadRequestException(`No existe la lane con el id ${uuid}`);
    return this.laneRepository.update(uuid, updateLaneDto);
  }

  async remove(uuid: string) {
    const lane = await this.laneRepository.findOneBy({id: uuid});
    if (!lane) throw new BadRequestException(`No existe la lane con el id ${uuid}`);
    this.laneRepository.delete(uuid);
    return "Se ha eliminado el lane correctamente";
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');

  }
}
