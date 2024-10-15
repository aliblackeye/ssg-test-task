import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity'; // Kullanıcı entity'sini import et

@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

  async createUser(
    fullname: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash'leme işlemi

    const result = await this.dbService.sql`
      INSERT INTO "user" (fullname, email, password, created_at) 
      VALUES (${fullname}, ${email}, ${hashedPassword}, NOW())
      RETURNING *; -- Kullanıcıyı döndür
    `;
    return result[0] as User; // İlk kullanıcıyı döndür
  }

  async findAll(): Promise<User[]> {
    const sql = this.dbService.sql;
    const users = await sql`
      SELECT
        id,
        email,
        password,
        fullname,
        created_at
      FROM
        "user"
    `;
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      password: user.password,
      fullname: user.fullname,
      created_at: user.created_at,
    })) as User[]; // Kullanıcıları User tipine dönüştür
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = this.dbService.sql;
    const user = await sql`
      SELECT
        *
      FROM
        "user"
      WHERE
        email = ${email}
    `;
    return user[0] ? (user[0] as User) : null; // Kullanıcıyı döndür
  }
}
