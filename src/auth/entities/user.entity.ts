import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../common/enums/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column({ unique: true })
  userName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', default: Role.BOOKER, enum: Role })
  role: Role;
}
