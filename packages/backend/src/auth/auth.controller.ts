import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
  ConflictException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express'; // Express Response import edildi

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { fullname: string; email: string; password: string },
  ) {
    try {
      const existingUser = await this.usersService.findByEmail(body.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const user = await this.usersService.createUser(
        body.fullname,
        body.email,
        body.password,
      );

      // Kullanıcı kaydı başarılı olduğunda access_token döndür
      return this.authService.login(user);
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token } = await this.authService.login(user);

    // Token'ı cookie'ye yaz
    res.cookie('access_token', access_token, {
      httpOnly: true, // Sadece HTTP istekleri için erişilebilir
      secure: process.env.NODE_ENV === 'production', // Sadece HTTPS üzerinden erişilebilir
      maxAge: 60 * 60 * 1000, // 1 saat geçerlilik süresi
      sameSite: 'lax', // Cookie'nin aynı site politikası
    });

    return res.send({ message: 'Login successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    console.log('Authenticated user:', req.user); // Hata ayıklama için log ekledik
    if (!req.user) {
      console.error('User not authenticated'); // Hata logu
      throw new UnauthorizedException('User not authenticated'); // Kullanıcı doğrulanmadıysa hata fırlat
    }

    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) {
      console.error('User not found:', req.user.email); // Hata logu
      throw new InternalServerErrorException('User not found'); // Kullanıcı bulunamazsa hata fırlat
    }

    const { password, ...rest } = user;
    return rest;
  }
}
