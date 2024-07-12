import { Booking } from "../entities/booking.entity";

export type NoRelationsBooking = Omit<Booking, 'field'| 'user' | 'booker'>;