import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Users servisini dahil ediyoruz
import * as dotenv from 'dotenv'; // dotenv'i import ediyoruz

dotenv.config(); // .env dosyasını yükle

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', // .env dosyasından alıyoruz
      signOptions: { expiresIn: '60m' }, // Token geçerlilik süresi
    }),
  ],
  providers: [AuthService, JwtStrategy], // JwtStrategy burada kullanıma hazır
  controllers: [AuthController],
})
export class AuthModule {}
