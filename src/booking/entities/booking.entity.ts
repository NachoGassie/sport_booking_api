import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field } from "../../field/entities/field.entity";
import { User } from "../../auth/entities/user.entity";


@Entity()
export class Booking {

  @PrimaryGeneratedColumn('uuid')
  idBooking: string;
  
  @Column({ type: 'timestamp', precision: 0 })
  bookTime: Date;

  @Column({ type: 'timestamp', precision: 0 })
  cancelDeadline: Date;

  @Column()
  price: number;
  
  @ManyToOne(() => Field , field => field.bookings)
  field: Field;

  // booker
  @ManyToOne(() => User)
  @JoinColumn({ name: 'booker', referencedColumnName: 'userName' })
  user: User;

  @Column()
  booker: string;
}
