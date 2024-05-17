import { Transform } from "class-transformer";
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { Role } from "../../common/enums/role.enum";

export class AuthRegisterDto {
  @Transform(({ value }) => value.trim()) 
  @IsString()
  @MinLength(1)
  userName: string;

  @IsString()
  @Matches(/^\+\d{1,3}\s\d{9,14}$/, { message: 'phone must be in +00 000... format' })
  phone: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsIn([Role.ADMIN, Role.MANAGER, Role.BOOKER])
  @IsOptional()
  role?: Role;
}