import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

type fieldSearch = { idField: string }

export class BookingQuerySearchDto{
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  price: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  bookTime: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  booker: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  field: fieldSearch;
}