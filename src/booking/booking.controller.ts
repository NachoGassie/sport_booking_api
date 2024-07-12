import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { AuthSwagger, NotFoundByIdSwagger, NotFoundByIdUpdateSwagger } from '../common/decorators/common-swagger.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { BookingService } from './booking.service';
import { BookingAuth } from './decorators/booking-auth.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetAllBookingsDTO } from './dto/booking-query.dto';

@ApiTags('bookings')
@Controller('booking')
export class BookingController {
  
  constructor(
    private readonly bookingService: BookingService
  ) {}

  @ApiOperation({ summary: 'get all by booker' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @Get('booker/:booker')
  @BookingAuth(Role.BOOKER)
  findByBooker(
    @Query() options: GetAllBookingsDTO,
    @Param('booker') booker: string
  ){
    return this.bookingService.findByBooker(options, booker);
  }

  @ApiOperation({ summary: 'get one booking' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdSwagger('booking')
  @Get(':idBooking')
  @BookingAuth(Role.BOOKER)
  findOneById(@Param('idBooking', ParseUUIDPipe) idBooking: string){
    return this.bookingService.findById(idBooking);
  }


  @ApiOperation({ summary: 'create one booking' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @ApiNotFoundResponse({ description: 'create body in wrong format' })
  @Post()
  @Auth(Role.BOOKER)
  @HttpCode(HttpStatus.CREATED)
  create(
    @ActiveUser() { userName }: ActiveUserInterface,
    @Body() createBookingDto: CreateBookingDto
  ) {
    return this.bookingService.create(userName, createBookingDto);
  }

  @ApiOperation({ summary: 'update one booking' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdUpdateSwagger('booking')
  @Patch(':idBooking')
  @BookingAuth(Role.BOOKER)
  async update(
    @Param('idBooking', ParseUUIDPipe) idBooking: string,
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    return this.bookingService.update(idBooking, updateBookingDto);
  }

  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdSwagger('booking')
  @Delete(':idBooking')
  @BookingAuth(Role.BOOKER)
  async remove(
    @Param('idBooking', ParseUUIDPipe) idBooking: string
  ) {
    await this.bookingService.remove(idBooking);
    return { idBooking };
  }
}
