import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateFieldDto } from "../../field/dto/create-field.dto";
import { Type } from "class-transformer";

export class CreateClubDto{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}
