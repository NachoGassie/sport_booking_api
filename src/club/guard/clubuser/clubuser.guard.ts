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

    const { idUser, role } = req.user;

    if (role === Role.ADMIN) return true;

    const { idClub, idField } = req.params;

    const { managerAccount, fields } = await this.clubService.findClubById(idClub);

    if(idUser !== managerAccount){
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
