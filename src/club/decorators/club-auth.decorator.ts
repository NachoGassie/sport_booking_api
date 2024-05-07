import { UseGuards, applyDecorators } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../../auth/guard/jwt.guard";
import { RolesGuard } from "../../auth/guard/roles.guard";
import { Role } from "../../common/enums/role.enum";
import { ClubuserGuard } from "../guard/clubuser/clubuser.guard";

export function ClubAuth(role: Role){
  return applyDecorators(
    Roles(role),
    UseGuards(JwtAuthGuard, RolesGuard, ClubuserGuard)
  );
}