import { IsEnum, IsOptional } from "class-validator";
import { QueryDto } from "../../common/dto/pagination.dto";
import { DEF_FIELD_SORTBY } from "../constants/field.constants";
import { FieldSortBy } from "../types/field.types";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetAllFieldsDTO extends QueryDto{
  @IsEnum(FieldSortBy)
  @IsOptional()
  @ApiPropertyOptional()
  sort: FieldSortBy = DEF_FIELD_SORTBY;
}