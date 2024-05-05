import { IsString, MinLength } from "class-validator";

export class CreateSportDto {
  @IsString()
  @MinLength(1)
  name: string;
}
