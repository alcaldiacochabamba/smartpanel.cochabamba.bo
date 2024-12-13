import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger('MessagesService');
  constructor(
    @InjectRepository(Message) 
    private messageRepository: Repository<Message>) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    await this.messageRepository.save(message);    
    return message;
  }

  findAll() {
    const messages = this.messageRepository.find();
    return messages;  
  }

  async findOne(uuid: string) {
    const message = await this.messageRepository.findOneBy({ id: uuid });
    if (!message) throw new BadRequestException(`No se encontro el mensaje con el id ${uuid}`);
    return message;
  }

  async update(uuid: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOneBy({id: uuid});
    if (!message) throw new BadRequestException(`No se encontro el mensaje con el id ${uuid}`);
    return this.messageRepository.update(uuid, updateMessageDto);

  }

  async remove(uuid: string) {
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
