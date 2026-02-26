import type { BoardTaskDto } from './board.repository.interface';

export interface CreateTaskRepositoryDto {
  boardId: number;
  title: string;
  description?: string;
  status: string;
  assigneeId?: number;
  labels?: string[];
}

export interface UpdateTaskRepositoryDto {
  title?: string;
  description?: string;
  status?: string;
  assigneeId?: number;
  labels?: string[];
}

export interface TaskRepository {
  findById(taskId: number): Promise<BoardTaskDto | null>;
  create(data: CreateTaskRepositoryDto): Promise<BoardTaskDto | null>;
  update(
    taskId: number,
    data: UpdateTaskRepositoryDto,
  ): Promise<BoardTaskDto | null>;
  delete(taskId: number): Promise<boolean>;
  updateStatus(
    taskId: number,
    status: string,
    position?: number,
  ): Promise<BoardTaskDto | null>;
  boardExists(boardId: number): Promise<boolean>;
  boardHasStatus(boardId: number, status: string): Promise<boolean>;
}
