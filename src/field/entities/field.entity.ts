import { Booking } from "../../booking/entities/booking.entity";
import { Club } from "../../club/entities/club.entity";
import { Sport } from "../../sport/entities/sport.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Field {

  @PrimaryGeneratedColumn('uuid')
  idField: string;

  @Column()
  fieldName: string;

  @Column()
  price: number;

  @Column({ type: 'numeric', default: 1 })
  bookingHourDuration: number;
  
  @ManyToOne(() => Club, club => club.fields)
  club: Club;

  @OneToMany(() => Booking, booking => booking.field)
  bookings: Booking[];

  @ManyToMany(() => Sport)
  @JoinTable()
  sports: Sport[];
}
