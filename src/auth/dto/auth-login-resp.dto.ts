import { Role } from "../../common/enums/role.enum";

export class AuthLoginResponseDto{
  userName: string;
  phone: string;
  role?: Role;
}