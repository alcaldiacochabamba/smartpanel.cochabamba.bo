import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger('MessagesService');
  constructor(
    @InjectRepository(Message) 
    private messageRepository: Repository<Message>) {}


  public async list(query: PaginateQuery): Promise<Paginated<Message>> {
    return await paginate(query, this.messageRepository, {
      sortableColumns: ['id','title','priority', 'icon', 'type'],
      nullSort: 'last',
      defaultSortBy: [['title', 'ASC']],
      searchableColumns: ['title', 'description'],
      select: ['id','title', 'description', 'priority', 'icon', 'type', 'active']
    });
  }

  public async listByPanelId(query: PaginateQuery, panel_id: string): Promise<Paginated<Message>> {
    return await paginate(query, this.messageRepository, {
      sortableColumns: ['id','title','priority', 'icon', 'type'],
      nullSort: 'last',
      defaultSortBy: [['title', 'ASC']],
      searchableColumns: ['title', 'description'],
      select: ['id','title', 'description', 'priority', 'icon', 'type', 'active'],
      where: {panel_id: panel_id}
    });
  }

  public async store(createMessageDto: CreateMessageDto) {
    return await this.messageRepository.save(
      this.messageRepository.create(createMessageDto)
    );
  }

  public async show(uuid: string) {
    if (!await this.messageRepository.existsBy({id: uuid})) throw new BadRequestException(`No se encontro el mensaje con el id ${uuid}`);
    return await this.messageRepository.findOneBy({ id: uuid });
  }

  public async update(uuid: string, updateMessageDto: UpdateMessageDto) {
    if (!await this.messageRepository.existsBy({id: uuid})) throw new BadRequestException(`No se encontro el mensaje con el id ${uuid}`);
    await this.messageRepository.update(uuid, updateMessageDto);
    return await this.messageRepository.findOneBy({id: uuid});
  }

  public async destroy(uuid: string) {
    const message = await this.messageRepository.findOneBy({id: uuid});
    if (!message) throw new BadRequestException(`No se encontro el mensaje con el id ${uuid}`);
    this.messageRepository.remove(message);
    return "El mensaje ha sido eliminado";
  }
  
  private manageDBExeptions(error: any) {
    this.logger.error(error.message, error.stack);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Internal Server Error');
    
  }
}
