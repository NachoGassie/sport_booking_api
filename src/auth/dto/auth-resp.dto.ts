import { Role } from "../../common/enums/role.enum";

class AuthResp{
  idUser: string;
  userName: string;
  role: Role;
}

export class AuthRegisterResponseDto extends AuthResp{
  phone: string;
}

export class AuthLoginResponseDto extends AuthResp{
  token: string;
  refreshToken: string;
}