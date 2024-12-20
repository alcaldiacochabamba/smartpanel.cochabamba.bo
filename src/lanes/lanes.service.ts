import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateLaneDto } from './dto/create-lane.dto';
import { UpdateLaneDto } from './dto/update-lane.dto';
import { DataSource, Repository } from 'typeorm';
import { Lane } from './entities/lane.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class LanesService {
  private readonly logger = new Logger('PanelsService');

  constructor(
    @InjectRepository(Lane)
    private laneRepository: Repository<Lane>,
    private dataSource: DataSource

  ){}

  public async list(query: PaginateQuery): Promise<Paginated<Lane>> {
    return await paginate(query, this.laneRepository, {
      sortableColumns: ['id', 'name', 'lane_number', 'orientation'],
      nullSort: 'last',
      defaultSortBy: [['name', 'ASC']],
      searchableColumns: ['id', 'name', 'lane_number', 'orientation'],
      select: ['id', 'name', 'lane_number', 'orientation']
    })
  }

  public async store(createLaneDto: CreateLaneDto) {
    return await this.laneRepository.save(
      this.laneRepository.create(createLaneDto)
    );
  }

  public async show(uuid: string) {
    if (!await this.laneRepository.existsBy({id: uuid})) throw new BadRequestException(`No existe el lane con el id ${uuid}`);
    return await this.laneRepository.findOneBy({id: uuid});
  }

  public async update(uuid: string, updateLaneDto: UpdateLaneDto) {
    if (!await this.laneRepository.existsBy({id: uuid})) throw new BadRequestException(`No existe el lane con el id ${uuid}`);
    await this.laneRepository.update(uuid, updateLaneDto);
    return await this.laneRepository.findOneBy({id: uuid});
  }

  public async destroy(uuid: string) {
    const lane = await this.laneRepository.findOneBy({id: uuid});
    if (!lane) throw new BadRequestException(`No existe el lane con el id ${uuid}`);
    this.laneRepository.delete(uuid);
    return "Se ha eliminado el lane correctamente";
  }

  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');

  }
}
