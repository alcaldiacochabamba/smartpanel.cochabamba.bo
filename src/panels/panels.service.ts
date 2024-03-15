import { Injectable } from '@nestjs/common';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';

@Injectable()
export class PanelsService {
  create(createPanelDto: CreatePanelDto) {
    return 'This action adds a new panel';
  }

  findAll() {
    return `This action returns all panels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} panel`;
  }

  update(id: number, updatePanelDto: UpdatePanelDto) {
    return `This action updates a #${id} panel`;
  }

  remove(id: number) {
    return `This action removes a #${id} panel`;
  }
}
