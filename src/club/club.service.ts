import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { GetAllPagination } from '../common/interfaces/common.interface';
import { DeleteResult, EntityManager, Repository, UpdateResult } from 'typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { CreateFieldDto } from '../field/dto/create-field.dto';
import { UpdateFieldDto } from '../field/dto/update-field.dto';
import { Field } from '../field/entities/field.entity';
import { FieldService } from '../field/field.service';
import { Sport } from '../sport/entities/sport.entity';
import { ClubQueryDto } from './dto/club-query.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club) 
    private readonly clubRepository: Repository<Club>,
    private readonly fieldService: FieldService,
    private readonly entityManager: EntityManager,
  ){}

  // CLUB
  findAll(options: ClubQueryDto): GetAllPagination<Club>{
    const { sort, order, ...pagination } = options;
    return paginate(this.clubRepository, pagination, {
      order: { [sort]: order },
      select: ['idClub', 'name', 'address']
    });
  }

  findAllBySport(options: ClubQueryDto, idSport: string): GetAllPagination<Club>{
    const { sort, order, ...pagination } = options;
    return paginate(this.clubRepository, pagination,{
      order: { [sort]: order },
      where: { fields: { sports: { idSport } } },
      select: ['idClub', 'name', 'address']
    });
  }

  findAllByUser(options: ClubQueryDto, idUser: string): GetAllPagination<Club>{
    const { sort, order, ...pagination } = options;
    return paginate(this.clubRepository, pagination,{
      order: { [sort]: order },
      where: { managerAccount: idUser}
    });
  }

  async findClubById(idClub: string): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { idClub },
      relations: ['fields'],
    });

    if (!club) throw new NotFoundException();

    return club;
  }

  async create(idUser: string, club: CreateClubDto): Promise<Club>{
    return this.entityManager.transaction(async (manager) => {
      const createdFields: Field[] = await this.fieldService.createFields(club.fields);
      
      const newClub = manager.create(Club, {
        ...club,
        fields: createdFields,
        managerAccount: idUser
      });

      return manager.save<Club>(newClub);
    });
  }

  async updateClub(idClub: string, club: UpdateClubDto): Promise<string>{
    await this.clubRepository.update(idClub, club);
    return idClub;
  }

  async deleteClub(idClub: string): Promise<string>{
    return this.entityManager.transaction(async (manager) => {
      const fields = await this.fieldService.getFieldBookingsByClub(idClub);
      const bookings = fields.flatMap(field => field.bookings ?? []);

      if (bookings.length > 0) await manager.delete(Booking, bookings);
      await manager.delete(Field, fields);

      await manager.delete(Club, idClub);

      return idClub;
    });
  }

  // FIELD
  async createFieldsByClub(idClub: string, fields: CreateFieldDto[]): Promise<Field[]>{
    return this.entityManager.transaction(async (manager) => {
      const club = await this.findClubById(idClub);

      const createdFields = await this.fieldService.createFields(fields);
      club.fields.push(...createdFields);

      await manager.save(club);
      return createdFields;
    });
  }

  async updateField(idField: string, field: UpdateFieldDto): Promise<string>{
    return this.entityManager.transaction(async (manager) => {
      const fieldToUpdate = await this.fieldService.findOne(idField);

      if (!Object.keys(field).length){
        throw new BadRequestException('at least one field was expected');
      }
  
      const { sportsId, sportsIdToDelete, ...rest } = field;

      const sports = await this.setSportsToUpdate(fieldToUpdate.sports, sportsId, sportsIdToDelete);

      const fieldToSave = Object.assign(fieldToUpdate, {
        ...rest, 
        sports
      });

      await manager.save(fieldToSave);

      return idField;
    });
  }

  async removeField(idField: string){
    return this.entityManager.transaction(async (manager) => {
      const field = await this.fieldService.findOne(idField);

      const bookings = field.bookings;
      if (bookings.length > 0) await manager.delete(Booking, bookings);
      
      return manager.remove(Field, field);
    });
  }

  // PRIVATE
  private async setSportsToUpdate(
    originalArr: Sport[], idsToAdd: string[], idsToDelete: string[]
  ): Promise<Sport[]>{
  
    if (idsToDelete) {
      originalArr = originalArr.filter(sport => !idsToDelete.includes(sport.idSport));
    }

    if (idsToAdd) {
      const sportsFound = await this.fieldService.verifySportsId(idsToAdd);
      const sportsSet = new Set([...originalArr, ...sportsFound]);
      return [...sportsSet];
    }

    return originalArr;
  }
}
