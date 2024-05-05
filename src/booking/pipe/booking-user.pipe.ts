import { ArgumentMetadata, Inject, Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { RequestWithUser } from '../../common/interfaces/active-user.interface';
import { BookingService } from '../booking.service';

@Injectable()
export class BookingUserPipe implements PipeTransform {

  constructor(
    @Inject(REQUEST) 
    protected readonly req: RequestWithUser,
    private readonly bookingService: BookingService
  ){}

  async transform(idBooking: string, _metadata: ArgumentMetadata) {
    const { role, userName } = this.req.user;
    const { booker } = await this.bookingService.findById(idBooking);

    const notAllowed = role === Role.BOOKER && userName !== booker;

    if(notAllowed){
      throw new UnauthorizedException('not allowed to deeply acces this club');
    }

    return idBooking;
  }
}
