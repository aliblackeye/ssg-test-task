import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  owners: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
