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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);

    const { password, ...rest } = user;
    return rest;
  }
}
