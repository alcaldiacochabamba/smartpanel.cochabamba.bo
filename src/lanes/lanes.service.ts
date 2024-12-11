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
    try {

      const lane = this.laneRepository.create(createLaneDto);
      await this.laneRepository.save(lane);
      return lane;

    } catch (error) {
      this.manageDBExeptions(error);
    }
  }

  findAll() {
    const lanes = this.laneRepository.find();
    return lanes;  
  }

  async findOne(uuid: string) {
    try {
      const lane = await this.laneRepository.findOneBy({id: uuid});
      if (!lane) throw new BadRequestException(`Lane with id ${uuid} not found`);
      return lane;
    } catch(error) {
      this.manageDBExeptions(error);
    }
  }

  async update(uuid: string, updateLaneDto: UpdateLaneDto) {
    try {
      const lane = await this.laneRepository.findOneBy({id: uuid});
      if (!lane) throw new BadRequestException(`Lane with id ${uuid} not found`);
      return this.laneRepository.update(uuid, updateLaneDto);
    } catch(error) {
      this.manageDBExeptions(error);
    }
  }

  async remove(uuid: string) {
    try {
      const lane = await this.laneRepository.findOneBy({id: uuid});
      if (!lane) throw new BadRequestException(`Lane with id ${uuid} not found`);
      this.laneRepository.delete(uuid);
      return "The lane has been delete";
    } catch(error) {
      this.manageDBExeptions(error);
    }
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');

  }
}
