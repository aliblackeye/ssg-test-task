import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DBModule } from '../db/db.module';

@Module({
  imports: [DBModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
