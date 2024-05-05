import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { AuthSwagger, BadReqNotFoundSwagger, NotFoundByIdSwagger, NotFoundByIdUpdateSwagger } from '../common/decorators/common-swagger.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingUserPipe } from './pipe/booking-user.pipe';
import { GetAllBookingsDTO } from './dto/booking-query.dto';
import { BookingQuerySearchDto } from './dto/booking-search-query.dto';

@ApiTags('bookings')
@Controller('booking')
export class BookingController {
  
  constructor(
    private readonly bookingService: BookingService
  ) {}

  @ApiOperation({ summary: 'get all bookings' })
  @AuthSwagger({ roles: [Role.ADMIN] })
  @BadReqNotFoundSwagger({
    badRequest: 'id in wrong uuid format / search query in wrong format',
    notFound: 'club not found'
  })
  @Get()
  @Auth(Role.ADMIN)
  async findAllByClub(
    @Query() options: GetAllBookingsDTO,
    @Query() querySearch: BookingQuerySearchDto,
  ) {
    return this.bookingService.findAll(options, querySearch);
  }

  @ApiOperation({ summary: 'get one booking' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdSwagger('booking')
  @Get(':idBooking')
  @Auth(Role.BOOKER)
  findOneById(@Param('idBooking', ParseUUIDPipe, BookingUserPipe) idBooking: string){
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
  @Auth(Role.BOOKER)
  async update(
    @Param('idBooking', ParseUUIDPipe, BookingUserPipe) idBooking: string,
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    return this.bookingService.update(idBooking, updateBookingDto);
  }

  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER, Role.BOOKER] })
  @NotFoundByIdSwagger('booking')
  @Delete(':idBooking')
  @Auth(Role.BOOKER)
  async remove(
    @Param('idBooking', ParseUUIDPipe, BookingUserPipe) idBooking: string
  ) {
    await this.bookingService.remove(idBooking);
    return { idBooking };
  }
}
