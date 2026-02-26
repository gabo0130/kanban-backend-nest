import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(taskId: number): Promise<void> {
    const deleted = await this.taskRepository.delete(taskId);

    if (!deleted) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }
  }
}
