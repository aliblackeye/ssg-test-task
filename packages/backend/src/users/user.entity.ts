import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullname: string; // Kullanıcı adı

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date; // Kullanıcı oluşturulma tarihi

  @ManyToMany(() => Task, (task) => task.owners)
  tasks: Task[]; // Kullanıcıya atanan task'lar
}
