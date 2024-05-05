import { ArrayNotEmpty, IsIn, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";
import { AcceptedBookindDurations } from "../constants/field.constants";

export class CreateFieldDto {
  @IsString()
  @MinLength(1)
  fieldName: string;

  @IsNumber()
  @IsPositive()
  price: number;
  
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  sportsId: string[];

  @IsOptional()
  @IsNumber()
  @IsIn(AcceptedBookindDurations)
  bookingHourDuration?: number;
}
