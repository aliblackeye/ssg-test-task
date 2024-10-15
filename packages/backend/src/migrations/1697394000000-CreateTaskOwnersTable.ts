import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskOwnersTable1697394000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS task_owners (
        task_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY (task_id, user_id),
        FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS task_owners`);
  }
}
