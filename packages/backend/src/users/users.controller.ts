import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll(); // Tüm kullanıcıları döndürür
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Could not fetch users');
    }
  }
}
