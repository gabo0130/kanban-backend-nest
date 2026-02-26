import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(data: CreateTaskDto) {
    const normalizedStatus = data.status.trim();
    const boardExists = await this.taskRepository.boardExists(data.boardId);

    if (!boardExists) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    const validStatus = await this.taskRepository.boardHasStatus(
      data.boardId,
      normalizedStatus,
    );

    if (!validStatus) {
      throw new ConflictException({
        message: 'Estado inválido para el tablero',
      });
    }

    const created = await this.taskRepository.create({
      boardId: data.boardId,
      title: data.title.trim(),
      description: data.description?.trim(),
      status: normalizedStatus,
      assigneeId: data.assigneeId,
      labels: this.normalizeLabels(data.labels),
    });

    if (!created) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    return created;
  }

  private normalizeLabels(labels?: string[]): string[] | undefined {
    if (!labels) {
      return undefined;
    }

    const normalized = [
      ...new Set(labels.map((label) => label.trim()).filter(Boolean)),
    ];

    return normalized.length > 0 ? normalized : undefined;
  }
}
