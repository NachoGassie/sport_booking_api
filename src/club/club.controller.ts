import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { AuthSwagger, BadReqNotFoundSwagger, NotFoundByIdSwagger, NotFoundByIdUpdateSwagger } from '../common/decorators/common-swagger.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { CreateFieldDto } from '../field/dto/create-field.dto';
import { UpdateFieldDto } from '../field/dto/update-field.dto';
import { ClubService } from './club.service';
import { ClubQueryDto } from './dto/club-query.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { NewmanagerPipe } from './pipes/newmanager/newmanager.pipe';
import { GetAllBookingsDTO } from '../booking/dto/booking-query.dto';
import { BookingQuerySearchDto } from '../booking/dto/booking-search-query.dto';
import { BookingService } from '../booking/booking.service';
import { ClubUserPipe } from './pipes/club-user/clubuser.pipe';

@ApiTags('clubs')
@Controller('club')
export class ClubController {
  constructor(
    private readonly clubService: ClubService,
    private readonly bookingService: BookingService
  ) {}

  @ApiOperation({ summary: 'get all clubs' })
  @Get()
  findAll(@Query() options: ClubQueryDto) {
    return this.clubService.findAll(options);
  }

  @ApiOperation({ summary: 'get all clubs by sport' })
  @NotFoundByIdSwagger('club')
  @Get('sport/:idClub')
  findAllBySport(
    @Query() options: ClubQueryDto,
    @Param('idClub', ParseUUIDPipe) idClub: string
  ){
    return this.clubService.findAllBySport(options, idClub);
  }

  @ApiOperation({ summary: 'get all clubs by manager' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @NotFoundByIdSwagger('club')
  @Get('user/:idUser')
  @Auth(Role.MANAGER)
  findAllByUser(
    @Query() options: ClubQueryDto,
    @Param('idUser', ParseUUIDPipe, ClubUserPipe) idUser: string
  ){
    return this.clubService.findAllByUser(options, idUser);
  }

  @ApiOperation({ summary: 'get club by id' })
  @NotFoundByIdSwagger('club')
  @Get(':idClub')
  findOne(@Param('idClub', ParseUUIDPipe) idClub: string) {
    return this.clubService.findClubById(idClub);
  }

  @ApiOperation({ summary: 'create one club' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @ApiBadRequestResponse({ description: 'create body in wrong format' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth(Role.MANAGER)
  create(
    @ActiveUser() { idUser }: ActiveUserInterface, 
    @Body() createClubDto: CreateClubDto
  ){
    return this.clubService.create(idUser, createClubDto);
  }

  @ApiOperation({ summary: 'update one club' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @NotFoundByIdUpdateSwagger('club')
  @Patch(':idClub')
  @Auth(Role.MANAGER)
  update(
    @Param('idClub', ParseUUIDPipe, ClubUserPipe) idClub: string, 
    @Body(NewmanagerPipe) updateClubDto: UpdateClubDto,
  ) {
    return this.clubService.updateClub(idClub, updateClubDto);

  }

  @ApiOperation({ summary: 'delete one club' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @NotFoundByIdSwagger('club')
  @Delete(':idClub')
  @Auth(Role.MANAGER)
  remove(
    @Param('idClub', ParseUUIDPipe, ClubUserPipe) idClub: string, 
  ) {
    return this.clubService.deleteClub(idClub);
  }

  // Field
  @ApiOperation({ summary: 'create fields by club' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @BadReqNotFoundSwagger({
    badRequest: 'id in wrong uuid format / create body in wrong format',
    notFound: 'club not found'
  })
  @Post(':idClub/field')
  @Auth(Role.MANAGER)
  async createFieldsByClub(
    @Param('idClub', ParseUUIDPipe, ClubUserPipe) idClub: string, 
    @Body() fields: CreateFieldDto[],
  ){
    return this.clubService.createFieldsByClub(idClub, fields);
  }

  @ApiOperation({ summary: 'update one field by club' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @NotFoundByIdUpdateSwagger(['club', 'field'])
  @Patch(':idClub/field/:idField')
  @Auth(Role.MANAGER)
  updateField(
    @Param('idField', ParseUUIDPipe) idField: string, 
    @Param('idClub', ParseUUIDPipe, ClubUserPipe) _: string,  
    @Body() field: UpdateFieldDto
  ){
    return this.clubService.updateField(idField, field);
  }

  @ApiOperation({ summary: 'delete one field by club' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @NotFoundByIdSwagger(['club', 'field'])
  @Delete(':idClub/field/:idField')
  @Auth(Role.MANAGER)
  removeField(
    @Param('idField', ParseUUIDPipe) idField: string, 
    @Param('idClub', ParseUUIDPipe, ClubUserPipe) _: string, 
  ){
    return this.clubService.removeField(idField);
  }

  // Booking
  @ApiOperation({ summary: 'get all bookings' })
  @AuthSwagger({ roles: [Role.ADMIN, Role.MANAGER] })
  @BadReqNotFoundSwagger({
    badRequest: 'id in wrong uuid format / search query in wrong format',
    notFound: 'club not found'
  })
  @Get(':idClub/booking')
  @Auth(Role.MANAGER)
  async findAllByClub(
    @Param('idClub', ParseUUIDPipe, ClubUserPipe) idClub: string,
    @Query() options: GetAllBookingsDTO,
    @Query() querySearch: BookingQuerySearchDto,
  ) {
    return this.bookingService.findAllByClub(idClub, options, querySearch);
  }

}
