import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Task, User],
  synchronize: true, // Bu satırı ekleyin veya true olarak değiştirin
  logging: true,
});

export default AppDataSource;
