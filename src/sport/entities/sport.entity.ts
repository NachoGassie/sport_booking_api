import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sport {
  @PrimaryGeneratedColumn('uuid')
  idSport: string;

  @Column({ unique: true })
  name: string;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
