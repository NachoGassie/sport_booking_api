import { OmitType, PartialType } from "@nestjs/mapped-types";
import { AuthRegisterDto } from "./auth-register.dto";

export class UpdateUserDto extends OmitType(PartialType(AuthRegisterDto), ['role']) {}
