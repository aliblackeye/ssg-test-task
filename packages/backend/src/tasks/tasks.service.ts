import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private dbService: DBService) {}

  async createTask(description: string, ownerIds: number[]): Promise<TaskDto> {
    const sql = this.dbService.sql;

    // Task oluştur
    const [newTask] = await sql`
      INSERT INTO
        task (description, completed)
      VALUES
        (${description}, FALSE)
      RETURNING
        id,
        description,
        completed,
        created_at
    `;

    // Sadece body'den gelen ownerIds kullanılarak sahipleri ekle
    if (ownerIds.length > 0) {
      await sql`
        INSERT INTO
          task_owners (task_id, user_id)
        SELECT
          ${newTask.id},
          unnest(${ownerIds}::INT[])
      `;
    }

    // Sahipleri getir
    const owners = await sql`
      SELECT
        u.id,
        u.email,
        u.fullname
      FROM
        "user" u
        JOIN task_owners task_own ON u.id = task_own.user_id
      WHERE
        task_own.task_id = ${newTask.id}
    `;

    return {
      id: newTask.id,
      description: newTask.description,
      completed: newTask.completed,
      created_at: newTask.created_at,
      owners: owners as unknown as {
        id: number;
        email: string;
        fullname: string;
      }[],
    };
  }

  async deleteTask(taskId: number): Promise<void> {
    const sql = this.dbService.sql;
    await sql`
      DELETE FROM task
      WHERE
        id = ${taskId}
    `;
  }

  async getTasks(): Promise<TaskDto[]> {
    const sql = this.dbService.sql;
    try {
      const tasks = await sql`
        SELECT
          t.id,
          t.description,
          t.completed,
          t.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id',
                u.id,
                'email',
                u.email,
                'fullname',
                u.fullname
              )
            ) FILTER (
              WHERE
                u.id IS NOT NULL
            ),
            '[]'
          ) AS owners
        FROM
          task t
          LEFT JOIN task_owners task_own ON t.id = task_own.task_id
          LEFT JOIN "user" u ON task_own.user_id = u.id
        GROUP BY
          t.id
      `;
      return tasks.map(this.mapToTaskDto);
    } catch (error) {
      console.error('Görevleri getirirken hata:', error);
      throw new Error('Görevleri getirirken bir hata oluştu.');
    }
  }

  async getTasksForUser(userId: number): Promise<TaskDto[]> {
    const sql = this.dbService.sql;
    const tasks = await sql`
      SELECT
        t.id,
        t.description,
        t.completed,
        t.created_at,
        json_agg(
          json_build_object(
            'id',
            u.id,
            'email',
            u.email,
            'fullname',
            u.fullname
          )
        ) AS owners
      FROM
        task t
        JOIN task_owners task_own ON t.id = task_own.task_id
        JOIN "user" u ON task_own.user_id = u.id
      WHERE
        task_own.user_id = ${userId}
      GROUP BY
        t.id
    `;
    return tasks.map(this.mapToTaskDto);
  }

  async updateTaskStatus(taskId: number, completed: boolean): Promise<TaskDto> {
    const sql = this.dbService.sql;
    const [updatedTask] = await sql`
      UPDATE task
      SET
        completed = ${completed}
      WHERE
        id = ${taskId}
      RETURNING
        id,
        description,
        completed,
        created_at
    `;

    const owners = await sql`
      SELECT
        u.id,
        u.email,
        u.fullname
      FROM
        "user" u
        JOIN task_owners task_own ON u.id = task_own.user_id
      WHERE
        task_own.task_id = ${taskId}
    `;

    return this.mapToTaskDto({ ...updatedTask, owners });
  }

  private mapToTaskDto(row: any): TaskDto {
    return {
      id: row.id,
      description: row.description,
      completed: row.completed,
      created_at: row.created_at,
      owners: Array.isArray(row.owners) ? row.owners : JSON.parse(row.owners),
    };
  }
}
