import { Transform } from "class-transformer";
import { IsDate, IsString, IsUUID, MinDate } from "class-validator";

export class CreateBookingDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  bookTime: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  cancelDeadline: Date;

  @IsString()
  @IsUUID()
  idField: string;
}
