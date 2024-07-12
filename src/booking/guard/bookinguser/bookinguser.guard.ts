import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { BookingService } from '../../../booking/booking.service';
import { Role } from '../../../common/enums/role.enum';

@Injectable()
export class BookinguserGuard implements CanActivate {

  constructor(
    private readonly bookingService: BookingService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { role, userName } = req.user;

    if (role === Role.ADMIN || role == Role.MANAGER) return true;

    const { idBooking, booker: reqBooker } = req.params;

    if (idBooking) {
      const { booker } = await this.bookingService.findById(idBooking);

      if(userName !== booker){
        throw new ForbiddenException('not allowed to acces this booking');
      }
    }else if (reqBooker) {
      if (reqBooker !== userName) {
        throw new ForbiddenException('not allowed to acces this booking');
      }
    }


    return true;
  }
}
