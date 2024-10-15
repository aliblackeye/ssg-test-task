import {
  Controller,
  Post,
  Delete,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskDto } from './dto/task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('create')
  async createTask(
    @Body() body: { description: string; ownerIds: number[] },
  ): Promise<TaskDto> {
    return this.tasksService.createTask(body.description, body.ownerIds);
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: number): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }

  @Get()
  async getTasks(): Promise<TaskDto[]> {
    return this.tasksService.getTasks();
  }

  @Get('my')
  async getTasksByUser(@Request() req): Promise<TaskDto[]> {
    return this.tasksService.getTasksForUser(req.user.userId);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') taskId: number,
    @Body() body: { completed: boolean },
  ): Promise<TaskDto> {
    return this.tasksService.updateTaskStatus(taskId, body.completed);
  }
}
