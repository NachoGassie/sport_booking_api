import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "../../common/enums/role.enum";
import { JwtAuthGuard } from "../guard/jwt.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "./roles.decorator";

export function Auth(role: Role){
  return applyDecorators(
    Roles(role),
    UseGuards(JwtAuthGuard, RolesGuard)
  );
}