import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Sport } from './entities/sport.entity';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sport]), AuthModule],
  controllers: [SportController],
  providers: [SportService],
})
export class SportModule {}
