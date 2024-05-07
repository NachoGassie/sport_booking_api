import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import { ClubService } from '../../../club/club.service';

@Injectable()
export class ClubuserGuard implements CanActivate {

  constructor(
    private readonly clubService: ClubService
  ){}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { idClub, idField } = req.params;
    const { idUser, role } = req.user;

    const { managerAccount, fields } = await this.clubService.findClubById(idClub);

    const notAllowed = role === Role.MANAGER && idUser !== managerAccount;

    if(notAllowed){
      throw new ForbiddenException('not allowed to deeply acces this club');
    }

    if (idField) {
      const exists = fields.find(field => field.idField === idField);
      if (!exists) {
        throw new NotFoundException('field not found in given club');
      }
    }

    return true;
  }
}
