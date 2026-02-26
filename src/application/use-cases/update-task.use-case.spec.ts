import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateTaskUseCase } from './update-task.use-case';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

describe('UpdateTaskUseCase', () => {
  const taskRepository: jest.Mocked<TaskRepository> = {
    findById: jest.fn(),
    boardExists: jest.fn(),
    boardHasStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStatus: jest.fn(),
  };

  const useCase = new UpdateTaskUseCase(taskRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates task with normalized values', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 3,
      boardId: 8,
      title: 'Current',
      status: 'Todo',
    });
    taskRepository.boardHasStatus.mockResolvedValue(true);
    taskRepository.update.mockResolvedValue({
      id: 3,
      boardId: 8,
      title: 'Updated',
      status: 'Doing',
      labels: ['bug'],
    });

    const result = await useCase.execute(3, {
      title: '  Updated  ',
      description: '  Desc  ',
      status: '  Doing ',
      labels: [' bug ', 'bug', ''],
    });

    expect(taskRepository.boardHasStatus).toHaveBeenCalledWith(8, 'Doing');
    expect(taskRepository.update).toHaveBeenCalledWith(3, {
      title: 'Updated',
      description: 'Desc',
      status: 'Doing',
      labels: ['bug'],
    });
    expect(result.status).toBe('Doing');
  });

  it('throws NotFoundException when task does not exist', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(999, { title: 'X' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws ConflictException when status is invalid', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 3,
      boardId: 8,
      title: 'Current',
      status: 'Todo',
    });
    taskRepository.boardHasStatus.mockResolvedValue(false);

    await expect(useCase.execute(3, { status: 'Nope' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('throws NotFoundException when update returns null', async () => {
    taskRepository.findById.mockResolvedValue({
      id: 3,
      boardId: 8,
      title: 'Current',
      status: 'Todo',
    });
    taskRepository.update.mockResolvedValue(null);

    await expect(useCase.execute(3, { title: 'X' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
