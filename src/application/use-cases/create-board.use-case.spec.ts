import { ConflictException } from '@nestjs/common';
import { CreateBoardUseCase } from './create-board.use-case';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';

describe('CreateBoardUseCase', () => {
  const boardRepository: jest.Mocked<BoardRepository> = {
    list: jest.fn(),
    getById: jest.fn(),
    getTasksByBoardId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createLabel: jest.fn(),
    updateLabel: jest.fn(),
    deleteLabel: jest.fn(),
  };

  const useCase = new CreateBoardUseCase(boardRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates board with normalized statuses and labels', async () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    boardRepository.create.mockResolvedValue({
      id: 1,
      name: 'Board',
      description: 'Desc',
      statuses: [{ id: 1, label: 'Todo', order: 0 }],
      labels: [{ id: 1, name: 'bug', color: '#EF4444' }],
    });

    const result = await useCase.execute({
      name: '  Board  ',
      description: '  Desc  ',
      statuses: [' Todo ', 'Doing', 'Todo', ''],
      labels: [' bug ', 'feature', 'bug', ''],
    });

    expect(boardRepository.create).toHaveBeenCalledWith({
      name: 'Board',
      description: 'Desc',
      statuses: ['Todo', 'Doing'],
      labels: [
        { name: 'bug', color: '#EF4444' },
        { name: 'feature', color: '#EF4444' },
      ],
    });
    expect(result.id).toBe(1);

    randomSpy.mockRestore();
  });

  it('throws ConflictException when statuses are invalid', async () => {
    await expect(
      useCase.execute({
        name: 'Board',
        statuses: ['   ', ''],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates board without labels when labels are missing', async () => {
    boardRepository.create.mockResolvedValue({
      id: 2,
      name: 'Board',
      statuses: [{ id: 1, label: 'Todo', order: 0 }],
      labels: [],
    });

    await useCase.execute({
      name: 'Board',
      statuses: ['Todo'],
    });

    expect(boardRepository.create).toHaveBeenCalledWith({
      name: 'Board',
      description: undefined,
      statuses: ['Todo'],
      labels: undefined,
    });
  });
});
