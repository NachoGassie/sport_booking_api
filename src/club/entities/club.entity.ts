import { User } from "../../auth/entities/user.entity";
import { Field } from "../../field/entities/field.entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Club {

  @PrimaryGeneratedColumn('uuid')
  idClub: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Field, field => field.club, 
    { cascade: ['insert'] }
  )
  fields: Field[];

  // Manager account
  @ManyToOne(() => User)
  @JoinColumn({ name: 'managerAccount', referencedColumnName: 'idUser' })
  user: User;

  @Column()
  managerAccount: string;
}
