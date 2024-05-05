import { OmitType } from "@nestjs/mapped-types";
import { AuthRegisterDto } from "./auth-register.dto";

export class AuthLoginDto extends OmitType(AuthRegisterDto, ['phone', 'role']){
}