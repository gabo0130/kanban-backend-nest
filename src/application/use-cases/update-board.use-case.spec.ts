import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateBoardUseCase } from './update-board.use-case';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';

describe('UpdateBoardUseCase', () => {
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

  const useCase = new UpdateBoardUseCase(boardRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates board with normalized statuses and trimmed fields', async () => {
    boardRepository.update.mockResolvedValue({
      id: 7,
      name: 'Board Updated',
      description: 'Desc',
      statuses: [{ id: 1, label: 'Todo', order: 0 }],
      labels: [],
    });

    const result = await useCase.execute(7, {
      name: '  Board Updated  ',
      description: '  Desc  ',
      statuses: [' Todo ', 'Doing', 'Todo', ''],
    });

    expect(boardRepository.update).toHaveBeenCalledWith(7, {
      name: 'Board Updated',
      description: 'Desc',
      statuses: ['Todo', 'Doing'],
    });
    expect(result.id).toBe(7);
  });

  it('throws ConflictException when statuses array becomes empty', async () => {
    await expect(
      useCase.execute(7, {
        statuses: [' ', ''],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when board is not found', async () => {
    boardRepository.update.mockResolvedValue(null);

    await expect(useCase.execute(99, { name: 'X' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
