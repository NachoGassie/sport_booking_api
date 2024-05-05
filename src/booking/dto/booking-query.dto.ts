import { IsEnum, IsOptional } from "class-validator";
import { QueryDto } from "../../common/dto/pagination.dto";
import { BookingSortBy } from "../types/booking.types";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetAllBookingsDTO extends QueryDto{
  @IsEnum(BookingSortBy)
  @IsOptional()
  @ApiPropertyOptional()
  sort: BookingSortBy = BookingSortBy.bookTime;
}