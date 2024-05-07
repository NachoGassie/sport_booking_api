import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { AuthService } from '../../auth/auth.service';
import { UpdateClubDto } from '../dto/update-club.dto';

@Injectable()
export class NewmanagerPipe implements PipeTransform {

  constructor(
    private readonly authService: AuthService
  ){}

  async transform(value: UpdateClubDto, metadata: ArgumentMetadata) {
    const { managerAccount } = value;

    if(!managerAccount) return value;

    const newUser = await this.authService.findUserByid(managerAccount);

    if (newUser.role !== Role.ADMIN && newUser.role !== Role.MANAGER) {
      throw new BadRequestException('user not allowed to manage a club');
    }

    return value;
  }
}
