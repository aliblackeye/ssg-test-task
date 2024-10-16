// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // bcrypt'i import ediyoruz

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.error('User not found:', email); // Hata logu
      return null; // Kullanıcı bulunamazsa null döndür
    }
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    console.error('Kullanıcı doğrulama hatası:', email); // Hata ayıklama için log ekledik
    return null; // Kullanıcı bulunamazsa null döndür
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    // Token'ı döndürmeden önce burada bir işlem yapabilirsiniz (örneğin, veritabanına kaydetme)
    return {
      access_token,
    };
  }
}
