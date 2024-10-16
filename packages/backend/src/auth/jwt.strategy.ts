import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config(); // .env dosyasını yükle

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.headers.cookie.split('access_token=')[1];
          console.log('Extracted token:', token); // Hata ayıklama için log ekledik
          return token; // Token'ı döndür
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // .env dosyasından alıyoruz
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload); // Hata ayıklama için log ekledik
    return { userId: payload.sub, email: payload.email }; // Bu veriler token'dan çıkarılacak
  }
}
