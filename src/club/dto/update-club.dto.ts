import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateClubDto } from './create-club.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateClubDto extends OmitType(PartialType(CreateClubDto), ['fields']) {
  @IsUUID()
  @IsOptional()
  managerAccount?: string;
}
