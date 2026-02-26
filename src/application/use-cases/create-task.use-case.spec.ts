import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTaskUseCase } from './create-task.use-case';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface';

describe('CreateTaskUseCase', () => {
  const taskRepository: jest.Mocked<TaskRepository> = {
    findById: jest.fn(),
    boardExists: jest.fn(),
    boardHasStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStatus: jest.fn(),
  };

  const useCase = new CreateTaskUseCase(taskRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates task with normalized values', async () => {
    taskRepository.boardExists.mockResolvedValue(true);
    taskRepository.boardHasStatus.mockResolvedValue(true);
    taskRepository.create.mockResolvedValue({
      id: 10,
      boardId: 1,
      title: 'Task',
      status: 'Todo',
      labels: ['bug', 'feature'],
    });

    const result = await useCase.execute({
      boardId: 1,
      title: '  Task  ',
      description: '  Desc  ',
      status: '  Todo  ',
      labels: [' bug ', 'feature', 'bug', ''],
    });

    expect(taskRepository.boardHasStatus).toHaveBeenCalledWith(1, 'Todo');
    expect(taskRepository.create).toHaveBeenCalledWith({
      boardId: 1,
      title: 'Task',
      description: 'Desc',
      status: 'Todo',
      assigneeId: undefined,
      labels: ['bug', 'feature'],
    });
    expect(result.id).toBe(10);
  });

  it('throws NotFoundException when board does not exist', async () => {
    taskRepository.boardExists.mockResolvedValue(false);

    await expect(
      useCase.execute({
        boardId: 7,
        title: 'Task',
        status: 'Todo',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws ConflictException when status is invalid', async () => {
    taskRepository.boardExists.mockResolvedValue(true);
    taskRepository.boardHasStatus.mockResolvedValue(false);

    await expect(
      useCase.execute({
        boardId: 1,
        title: 'Task',
        status: 'Unknown',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when repository create returns null', async () => {
    taskRepository.boardExists.mockResolvedValue(true);
    taskRepository.boardHasStatus.mockResolvedValue(true);
    taskRepository.create.mockResolvedValue(null);

    await expect(
      useCase.execute({
        boardId: 1,
        title: 'Task',
        status: 'Todo',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
