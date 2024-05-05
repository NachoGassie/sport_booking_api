import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInMilliseconds } from 'date-fns';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';
import { GetAllPagination } from '../common/interfaces/common.interface';
import { Field } from '../field/entities/field.entity';
import { FieldService } from '../field/field.service';
import { DEF_UUID } from './constants/booking.constants';
import { GetAllBookingsDTO } from './dto/booking-query.dto';
import { BookingQuerySearchDto } from './dto/booking-search-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { OrderByFactory } from './types/order-query-class';

@Injectable()
export class BookingService {

  constructor(
    @InjectRepository(Booking) 
    private readonly bookingRepository: Repository<Booking>,
    private readonly fieldService: FieldService,
  ){}

  findAllByClub(
    idClub: string, options: GetAllBookingsDTO, searchQuery: BookingQuerySearchDto
  ): GetAllPagination<Booking>{
    const {sort, order, ...pagination } = options;

    const orderQuery = OrderByFactory.getOrder(sort, order);
    const whereQuery = this.getWhereQueryWithClub(Object.entries(searchQuery), idClub);
    
    return paginate(this.bookingRepository, pagination, {
      order: orderQuery,
      where: whereQuery,
      relations: ['field', 'user'],
    });
  }
  
  findAll(options: GetAllBookingsDTO, searchQuery: BookingQuerySearchDto){
    const {sort, order, ...pagination } = options;

    const orderQuery = OrderByFactory.getOrder(sort, order);
    const whereQuery = this.getWhereQuery(Object.entries(searchQuery));

    return paginate(this.bookingRepository, pagination, {
      order: orderQuery,
      where: whereQuery,
      relations: ['field', 'user'],
    });
  }


  async findById(idBooking: string): Promise<Booking>{
    const booking = await this.bookingRepository.findOne({
      where: { idBooking },
      relations: ['field']
    });

    if (!booking) throw new NotFoundException('booking not found');

    return booking;
  }
  
  async create(booker: string, booking: CreateBookingDto): Promise<Booking>{
    const field = await this.verifyCreateBooking(booking);
    
    const newBooking = this.bookingRepository.create({
      ...booking,
      field,
      booker,
      price: field.price,
    });

    return this.bookingRepository.save(newBooking);
  }

  async update(idBooking: string, booking: UpdateBookingDto):Promise<string>{
    const { field: defField, bookTime: defBookTime } = await this.findById(idBooking);

    const field = await this.verifyUpdateBooking(booking, idBooking, defField, defBookTime);
    const { bookTime, cancelDeadline, idField } = booking;

    await this.bookingRepository.update(idBooking, {
      bookTime, 
      cancelDeadline,
      field: idField && field
    });

    return idBooking;
  }

  async remove(idBooking: string): Promise<string> {
    const{ affected } = await this.bookingRepository.delete(idBooking);
    if (affected === 0) throw new NotFoundException();
    return idBooking;
  }

  // Private
  private getWhereQuery(arr: [string, any][]){
    const whereQuery: Partial<BookingQuerySearchDto> = {}
    let idField: null | string = null;

    arr.forEach(query => {
      switch(query[0]){
        case 'field':
          idField = query[1];
          break;
        default: 
          whereQuery[query[0]] = query[1];
      }
    });

    return { ...whereQuery, idField };
  }

  private getWhereQueryWithClub(arr: [string, any][], idClub?: string){
    const { idField, ...whereQuery } = this.getWhereQuery(arr);

    const whereClub = idField ? { club: { idClub }, idField } : { club: { idClub } } 
    const whereField = { field: whereClub }

    return { ...whereQuery, ...whereField };
  }

  private async verifyCreateBooking(booking: CreateBookingDto): Promise<Field>{
    const { idField, bookTime, cancelDeadline } = booking;
    
    this.verifyCancelDeadline(bookTime, cancelDeadline);

    const field = await this.fieldService.findOneNoRelations(idField);
    await this.verifyExistingBooking(field, bookTime);

    return field;
  }

  private async verifyUpdateBooking(
    booking: UpdateBookingDto, idBooking: string, field: Field, bookTime: Date
  ): Promise<Field>{

    if (!Object.keys(booking).length){
      throw new BadRequestException('at least one field was expected');
    }

    const { idField, bookTime: newBookTime, cancelDeadline } = booking;

    if (newBookTime) bookTime = newBookTime;

    if (cancelDeadline) {
      this.verifyCancelDeadline(bookTime, cancelDeadline);
    }

    if (idField) field = await this.fieldService.findOneNoRelations(idField);

    if (idField || newBookTime){
      await this.verifyExistingBooking(field, bookTime, idBooking);
    }
  
    return field;
  }

  private verifyCancelDeadline(bookTime: Date, cancelDeadline: Date){
    if(bookTime < cancelDeadline){
      throw new ConflictException('booktime outdates cancel deadline');
    }
  }

  private async verifyExistingBooking(field: Field, bookTime: Date, idBooking: string = DEF_UUID){
    const isBooked = await this.bookingRepository.find({
      where: { field }
    });

    isBooked.forEach(book => {
      if (book.idBooking !== idBooking) {
        const bookedTime = book?.bookTime;

        const diffMilliseconds = differenceInMilliseconds(bookTime, bookedTime);
        const diffHours = diffMilliseconds / (1000 * 60 * 60);
  
        if (Math.abs(diffHours) <= +field.bookingHourDuration) {
          throw new ConflictException('field booked at date');
        } 
      }
    });
  }
}