import { Role } from "../enums/role.enum";

export interface AuthSwagger {
  roles: Role[];
}

export interface BadReqNotFoundSwagger{
  badRequest: string;
  notFound: string;
}

export type entityName = 'field' | 'sport' | 'club' | 'user' | 'booking';
