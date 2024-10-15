import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log('Kullanıcı bulunamadı.');
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password); // Hashlenmiş şifre ile karşılaştırma yap

    if (isMatch) {
      console.log('Şifre doğru.');
      const { password, ...result } = user;
      return result;
    }

    console.log('Şifre hatalı.');
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
