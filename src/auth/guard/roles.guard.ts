import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(), context.getClass()
    ]);
    
    const { user } = context.switchToHttp().getRequest();
    const userRole = user.role;

    if (userRole === Role.ADMIN) return true;

    if (role === Role.BOOKER && userRole === Role.MANAGER) return true;
    
    return role === userRole;
  }
}
