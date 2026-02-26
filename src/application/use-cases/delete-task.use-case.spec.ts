import { NotFoundException } from '@nestjs/common';
import { DeleteTaskUseCase } from './delete-task.use-case';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

describe('DeleteTaskUseCase', () => {
  const taskRepository: jest.Mocked<TaskRepository> = {
    findById: jest.fn(),
    boardExists: jest.fn(),
    boardHasStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStatus: jest.fn(),
  };

  const useCase = new DeleteTaskUseCase(taskRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes when repository confirms deletion', async () => {
    taskRepository.delete.mockResolvedValue(true);

    await expect(useCase.execute(1)).resolves.toBeUndefined();
    expect(taskRepository.delete).toHaveBeenCalledWith(1);
  });

  it('throws NotFoundException when task is missing', async () => {
    taskRepository.delete.mockResolvedValue(false);

    await expect(useCase.execute(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
