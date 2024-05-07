import { UseGuards, applyDecorators } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../../auth/guard/jwt.guard";
import { RolesGuard } from "../../auth/guard/roles.guard";
import { Role } from "../../common/enums/role.enum";
import { BookinguserGuard } from "../guard/bookinguser/bookinguser.guard";

export function BookingAuth(role: Role){
  return applyDecorators(
    Roles(role),
    UseGuards(JwtAuthGuard, RolesGuard, BookinguserGuard)
  );
}