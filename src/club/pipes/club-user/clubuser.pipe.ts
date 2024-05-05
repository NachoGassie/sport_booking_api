import { ArgumentMetadata, ForbiddenException, Inject, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClubService } from '../../../club/club.service';
import { Role } from '../../../common/enums/role.enum';
import { RequestWithUser } from '../../../common/interfaces/active-user.interface';

@Injectable()
export class ClubUserPipe implements PipeTransform {

  constructor(
    @Inject(REQUEST) 
    protected readonly req: RequestWithUser,
    private readonly clubService: ClubService
  ){}

  async transform(value: string, _metadata: ArgumentMetadata) {
    const { idClub, idField } = this.req.params;
    const { idUser, role } = this.req.user;

    const { managerAccount, fields } = await this.clubService.findClubById(idClub);

    const notAllowed = role === Role.MANAGER && idUser !== managerAccount;

    if(notAllowed){
      throw new ForbiddenException('not allowed to deeply acces this club');
    }

    if (idField) {
      const exists = fields.find(field => field.idField === idField);
      if (!exists) {
        throw new NotFoundException('field not found');
      }
    }

    return value;
  }
}
