import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { GetAllPagination } from '../common/interfaces/common.interface';
import { In, Repository } from 'typeorm';
import { Sport } from '../sport/entities/sport.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { GetAllFieldsDTO } from './dto/field-query.dto';
import { Field } from './entities/field.entity';
import { OrderByFactory } from './types/order-query-class';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>
  ){}

  findAll(options: GetAllFieldsDTO): GetAllPagination<Field>{
    const {sort, order, ...pagination } = options;
    const orderQuery = OrderByFactory.getOrder(sort, order);
    return paginate(this.fieldRepository, pagination,{
      order: orderQuery, 
      relations: ['club', 'sports'],
    });
  }

  findAllByClub(options: GetAllFieldsDTO, idClub: string): GetAllPagination<Field>{
    const {order, sort, ...pagination } = options;
    const orderQuery = OrderByFactory.getOrder(sort, order);
    return paginate(this.fieldRepository, pagination,{
      where: { club: { idClub } },
      order: orderQuery, 
      relations: ['club', 'sports']
    });
  }

  getFieldBookingsByClub(idClub: string){
    return this.fieldRepository.find({
      where: { club: { idClub } },
      relations: ['bookings'],
      select: ['idField', 'bookings']
    });
  }

  async findOne(idField: string){
    const field = await this.fieldRepository.findOne({
      where: { idField },  
      relations: ['club', 'sports', 'bookings']
    });

    if (!field) throw new NotFoundException();

    return field;
  }

  async findOneNoRelations(idField: string){
    const field = await this.fieldRepository.findOne({
      where: { idField },  
    });

    if (!field) throw new NotFoundException('field not found');

    return field;
  }

  async createFields(fields: CreateFieldDto[]): Promise<Field[]>{    
    if (!Array.isArray(fields)) throw new BadRequestException('fields array was expected');

    const sportsIdsSet = new Set(fields.flatMap(field => field.sportsId));
    const sportsFound = await this.verifySportsId([...sportsIdsSet]);

    return fields.map(field => {
      const sports = this.getSportsForField(field.sportsId, sportsFound);
      const newField = this.fieldRepository.create({...field, sports});
      return newField;
    });
  }
  
  async verifySportsId(sportsIds: string[]): Promise<Sport[]>{
    if (!Array.isArray(sportsIds)) throw new BadRequestException('sportId is not an array');
    const sportsFound = await this.sportRepository.find({ where: { idSport: In(sportsIds) } });

    if (sportsFound.length !== sportsIds.length) {
      const missingIds = sportsIds.filter(id => !sportsFound.some(sport => sport.idSport === id));
      throw new NotFoundException(`Sports not found with IDs: ${missingIds.join(', ')}`);
    }

    return sportsFound;
  }

  // PRIVATE
  private getSportsForField(idReq: string[], sportsFound: Sport[]){
    const sports = sportsFound.filter(
      sport => idReq.includes(sport.idSport)
    );

    if (sports.length === 0) {
      throw new BadRequestException('fields must have at least one sport');
    }

    return sports;
  }
}
