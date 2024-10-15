export class TaskDto {
  id: number;
  description: string;
  completed: boolean;
  created_at: Date;
  owners: {
    id: number;
    email: string;
    fullname: string;
  }[];
}
