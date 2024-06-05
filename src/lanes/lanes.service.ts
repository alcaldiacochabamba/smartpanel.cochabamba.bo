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

  findOne(id: number) {
    return `This action returns a #${id} lane`;
  }

  update(id: number, updateLaneDto: UpdateLaneDto) {
    return `This action updates a #${id} lane`;
  }

  remove(id: number) {
    return `This action removes a #${id} lane`;
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');

  }
}
