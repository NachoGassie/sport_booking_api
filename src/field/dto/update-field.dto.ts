import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDto } from './create-field.dto';
import { ArrayNotEmpty, IsOptional } from 'class-validator';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @ArrayNotEmpty()
  @IsOptional()
  sportsIdToDelete?: string[];
}
