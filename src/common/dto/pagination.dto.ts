import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsPositive } from "class-validator";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { FindOptionsOrderValue } from "typeorm";
import { DEF_LIMIT, DEF_ORDER, DEF_PAG } from "../constants/global.constants";

export class QueryDto implements IPaginationOptions{
  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional()
  limit: number = DEF_LIMIT;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional()
  page: number = DEF_PAG;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  order: FindOptionsOrderValue = DEF_ORDER;
}