import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTaskStatusUseCase } from './update-task-status.use-case';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

describe('UpdateTaskStatusUseCase', () => {
  const taskRepository: jest.Mocked<TaskRepository> = {
    findById: jest.fn(),
    boardExists: jest.fn(),
    boardHasStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStatus: jest.fn(),
  };

  const useCase = new UpdateTaskStatusUseCase(taskRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates status for admin', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 1,
      boardId: 2,
      title: 'Task',
      status: 'Todo',
      assigneeId: 10,
    });
    taskRepository.boardHasStatus.mockResolvedValue(true);
    taskRepository.updateStatus.mockResolvedValue({
      id: 1,
      boardId: 2,
      title: 'Task',
      status: 'Doing',
      assigneeId: 10,
      order: 3,
    });

    const result = await useCase.execute(
      1,
      { status: '  Doing ', position: 3 },
      { userId: 999, role: 'Admin' },
    );

    expect(taskRepository.boardHasStatus).toHaveBeenCalledWith(2, 'Doing');
    expect(taskRepository.updateStatus).toHaveBeenCalledWith(1, 'Doing', 3);
    expect(result.task.status).toBe('Doing');
  });

  it('throws NotFoundException when task does not exist', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(1, { status: 'Todo' }, { userId: 1, role: 'Admin' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws ForbiddenException when member is not assignee', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 1,
      boardId: 2,
      title: 'Task',
      status: 'Todo',
      assigneeId: 10,
    });

    await expect(
      useCase.execute(1, { status: 'Doing' }, { userId: 9, role: 'Member' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws ConflictException when status is invalid', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 1,
      boardId: 2,
      title: 'Task',
      status: 'Todo',
      assigneeId: 10,
    });
    taskRepository.boardHasStatus.mockResolvedValue(false);

    await expect(
      useCase.execute(1, { status: 'Nope' }, { userId: 10, role: 'Member' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when updateStatus returns null', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 1,
      boardId: 2,
      title: 'Task',
      status: 'Todo',
      assigneeId: 10,
    });
    taskRepository.boardHasStatus.mockResolvedValue(true);
    taskRepository.updateStatus.mockResolvedValue(null);

    await expect(
      useCase.execute(1, { status: 'Doing' }, { userId: 10, role: 'Member' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
