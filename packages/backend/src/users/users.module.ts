import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DBModule } from '../db/db.module'; // DB servisini kullanacağız

@Module({
  imports: [DBModule],
  controllers: [UsersController], // UsersController'ı buraya ekliyoruz
  providers: [UsersService],
  exports: [UsersService], // AuthService'de de kullanmak için export ediyoruz
})
export class UsersModule {}
