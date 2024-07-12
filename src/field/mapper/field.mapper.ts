
import { NoRelationsBooking } from "src/booking/dto/response-booking.dto";
import { NoRelationsClub } from "src/club/dto/response-club.dto";
import { FieldResponse } from "../dto/response-field.dto";
import { Field } from "../entities/field.entity";


export function fieldsMapper(fields: Field[]): FieldResponse[]{
  return fields.map(field => mapFieldToResponseDto(field));
}

export function mapFieldToResponseDto(field: Field): FieldResponse {
  const { club, bookings, ...rest} = field;

  const { idClub, address, name } = club;
  
  const noRelationsClub: NoRelationsClub = { idClub, name, address }
  const noRelationsBooking: NoRelationsBooking[] = bookings.map(
    ({ idBooking, price, bookTime, cancelDeadline }) => 
      ({ idBooking, price, bookTime, cancelDeadline })
  ); 

  return {
    bookings: noRelationsBooking,
    club: noRelationsClub,
    ...rest
  }
}