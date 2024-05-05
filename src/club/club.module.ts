import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from '../field/entities/field.entity';
import { FieldModule } from '../field/field.module';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Club } from './entities/club.entity';
import { AuthModule } from '../auth/auth.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, Field]), FieldModule, AuthModule, BookingModule
  ],
  controllers: [ClubController],
  providers: [ClubService],
  exports: [ClubService]
})
export class ClubModule {}
