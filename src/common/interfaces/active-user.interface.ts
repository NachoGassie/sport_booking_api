import { Request } from "express";
import { Role } from "../enums/role.enum";

export interface ActiveUserInterface {
  idUser: string;
  userName: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: ActiveUserInterface;
} 