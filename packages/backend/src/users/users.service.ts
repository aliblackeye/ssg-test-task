import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

  async createUser(
    fullname: string,
    email: string,
    password: string,
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash'leme işlemi

    await this.dbService.sql`
      INSERT INTO "user" (fullname, email, password, created_at) 
      VALUES (${fullname}, ${email}, ${hashedPassword}, NOW());
    `;
  }

  async findAll(): Promise<any[]> {
    const sql = this.dbService.sql;
    const users = await sql`
      SELECT
        id,
        email
      FROM
        "user"
    `;
    return users;
  }

  async findByEmail(email: string): Promise<any> {
    const sql = this.dbService.sql;
    const user = await sql`
      SELECT
        *
      FROM
        "user"
      WHERE
        email = ${email}
    `;
    return user[0];
  }
}
