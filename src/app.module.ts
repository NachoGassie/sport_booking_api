import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { THROTTLER_STRATEGY } from './auth/strategies/throttler.strategy';
import { BookingModule } from './booking/booking.module';
import { ClubModule } from './club/club.module';
import { FieldModule } from './field/field.module';
import { SportModule } from './sport/sport.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([THROTTLER_STRATEGY]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.POSTGRES_SSL === "true",
      extra: {
        ssl:
          process.env.POSTGRES_SSL === "true"
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
    }), 
    AuthModule, 
    BookingModule, 
    ClubModule, 
    FieldModule,
    SportModule, 
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ],
})
export class AppModule {}
