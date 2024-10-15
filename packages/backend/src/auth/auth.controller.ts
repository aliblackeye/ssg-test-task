import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // JwtAuthGuard'ı import ediyoruz

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
    // Kullanıcıyı kaydet
    await this.usersService.createUser(
      body.fullname,
      body.email,
      body.password,
    );
    return { message: 'Kayıt başarılı!' };
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Hatalı girişlerde 401 döndür
    }

    return this.authService.login(user); // Doğruysa token döndür
  }

  @UseGuards(JwtAuthGuard) // JWT koruması ekliyoruz
  @Get('me')
  async getMe(@Request() req) {
    // req.user JWT tarafından doğrulanan kullanıcıyı içerir
    const user = await this.usersService.findByEmail(req.user.email);

    const { password, ...rest } = user;
    return rest;
  }
}
