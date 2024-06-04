import { PartialType } from '@nestjs/swagger';
import { CreateLaneDto } from './create-lane.dto';

export class UpdateLaneDto extends PartialType(CreateLaneDto) {}
