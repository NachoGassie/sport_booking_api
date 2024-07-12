import { NoRelationsBooking } from "src/booking/dto/response-booking.dto";
import { Sport } from "src/sport/entities/sport.entity";
import { NoRelationsClub } from "../../club/dto/response-club.dto";
import { Field } from "../entities/field.entity";

export class NoRelationsField {
  idField: string;
  fieldName: string;
  price: number;
  bookingHourDuration: number;
}

export class FieldResponse extends NoRelationsField{
  club: NoRelationsClub;
  bookings: NoRelationsBooking[];
  sports: Sport[];
}

export class NoBookingsField extends NoRelationsField{
  club: NoRelationsClub;
  sports: Sport[];
}

export type FieldNoBookings = Omit<Field, 'bookings'>;
export type FieldWithClub = Omit<Field, 'bookings' | 'sports'>;