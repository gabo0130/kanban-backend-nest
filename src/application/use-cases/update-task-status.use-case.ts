import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import type { UserRole } from '../../domain/entities/user-role.type';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

interface UpdateTaskStatusActor {
  userId: number;
  role: UserRole;
}

@Injectable()
export class UpdateTaskStatusUseCase {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    taskId: number,
    data: UpdateTaskStatusDto,
    actor: UpdateTaskStatusActor,
  ) {
    const existing = await this.taskRepository.findById(taskId);

    if (!existing) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    if (actor.role === 'Member' && existing.assigneeId !== actor.userId) {
      throw new ForbiddenException({ message: 'Prohibido' });
    }

    const normalizedStatus = data.status.trim();
    const validStatus = await this.taskRepository.boardHasStatus(
      existing.boardId,
      normalizedStatus,
    );

    if (!validStatus) {
      throw new ConflictException({
        message: 'Estado inválido para el tablero',
      });
    }

    const updated = await this.taskRepository.updateStatus(
      taskId,
      normalizedStatus,
      data.position,
    );

    if (!updated) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    return { task: updated };
  }
}
