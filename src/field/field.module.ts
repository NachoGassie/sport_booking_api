import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Sport } from '../sport/entities/sport.entity';
import { SportModule } from '../sport/sport.module';
import { Field } from './entities/field.entity';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';

@Module({
  imports: [TypeOrmModule.forFeature([Field, Sport]), SportModule, AuthModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService]
})
export class FieldModule {}
