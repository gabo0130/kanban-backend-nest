import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(taskId: number, data: UpdateTaskDto) {
    const existing = await this.taskRepository.findById(taskId);

    if (!existing) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    const normalizedStatus = data.status?.trim();

    if (normalizedStatus !== undefined) {
      const validStatus = await this.taskRepository.boardHasStatus(
        existing.boardId,
        normalizedStatus,
      );

      if (!validStatus) {
        throw new ConflictException({
          message: 'Estado inválido para el tablero',
        });
      }
    }

    const updated = await this.taskRepository.update(taskId, {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description.trim() }
        : {}),
      ...(normalizedStatus !== undefined ? { status: normalizedStatus } : {}),
      ...(data.assigneeId !== undefined ? { assigneeId: data.assigneeId } : {}),
      ...(data.labels !== undefined
        ? { labels: this.normalizeLabels(data.labels) }
        : {}),
    });

    if (!updated) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    return updated;
  }

  private normalizeLabels(labels: string[]): string[] | undefined {
    const normalized = [
      ...new Set(labels.map((label) => label.trim()).filter(Boolean)),
    ];
    return normalized.length > 0 ? normalized : undefined;
  }
}
