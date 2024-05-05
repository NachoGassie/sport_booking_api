import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository, UpdateResult } from 'typeorm';
import { QueryDto } from '../common/dto/pagination.dto';
import { GetAllPagination } from '../common/interfaces/common.interface';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';

@Injectable()
export class SportService {

  constructor(
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>
  ){}

  findAll(query: QueryDto): GetAllPagination<Sport>{
    const { order, ...pagination } = query;

    return paginate(this.sportRepository, pagination, {
      order: { 'name': order }
    })
  }

  async findOne(idSport: string): Promise<Sport> {
    const sport = await this.sportRepository.findOne({
      where: { idSport }
    });

    if (!sport) throw new NotFoundException();
    
    return sport;
  }

  async create(sport: CreateSportDto){
    await this.errorIfExists(sport.name)
    const newSport = this.sportRepository.create(sport);
    const { deletedAt, ...savedSport } = await this.sportRepository.save(newSport);
    return savedSport;
  }

  async update(idSport: string, sport: UpdateSportDto): Promise<string> {
    if (!Object.keys(sport).length){
      throw new BadRequestException('at least one field was expected');
    }
    await this.findOne(idSport);
    await this.errorIfExists(sport.name);
    await this.sportRepository.update(idSport, sport);
    return idSport;
  }

  async remove(idSport: string): Promise<string> {
    const { affected } = await this.sportRepository.softDelete(idSport);
    if (affected === 0) throw new NotFoundException();
    return idSport;
  }

  private async errorIfExists(name: string){
    const exists = await this.sportRepository.exists({ where: { name } });
    if (exists) throw new BadRequestException('sport name already registered');    
  }
}
