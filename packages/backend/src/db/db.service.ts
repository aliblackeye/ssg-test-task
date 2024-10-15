import { Injectable } from '@nestjs/common';
import postgres from 'postgres';

@Injectable()
export class DBService {
  private postgresClient: ReturnType<typeof postgres>;

  onModuleInit() {
    // Eğer .env'de DATABASE_URL yoksa, aşağıdaki bağlantıyı elle ekleyelim
    const connectionString =
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/ssg';
    this.postgresClient = postgres(connectionString);
  }

  get sql() {
    return this.postgresClient;
  }
}
