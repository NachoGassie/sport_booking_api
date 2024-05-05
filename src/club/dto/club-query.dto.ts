import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { QueryDto } from "../../common/dto/pagination.dto";
import { ClubSortBy } from "../types/club.types";

export class ClubQueryDto extends QueryDto{
  @IsEnum(ClubSortBy)
  @IsOptional()
  @ApiPropertyOptional()
  sort: ClubSortBy = ClubSortBy.name;
}