import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { BookingService } from '../../../booking/booking.service';
import { Role } from '../../../common/enums/role.enum';

@Injectable()
export class BookinguserGuard implements CanActivate {

  constructor(
    private readonly bookingService: BookingService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { role, userName } = req.user;
    const { idBooking} = req.params;
    const { booker } = await this.bookingService.findById(idBooking);

    const notAllowed = role === Role.BOOKER && userName !== booker;

    if(notAllowed){
      throw new ForbiddenException('not allowed to deeply acces this club');
    }


    return true;
  }
}
