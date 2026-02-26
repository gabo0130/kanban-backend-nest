import { NotFoundException } from '@nestjs/common';
import { GetBoardByIdUseCase } from './get-board-by-id.use-case';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';

describe('GetBoardByIdUseCase', () => {
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

  const useCase = new GetBoardByIdUseCase(boardRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns board, statuses and tasks', async () => {
    boardRepository.getById.mockResolvedValue({
      id: 2,
      name: 'Board',
      statuses: [{ id: 1, label: 'Todo', order: 0 }],
      labels: [],
    });
    boardRepository.getTasksByBoardId.mockResolvedValue([
      { id: 1, boardId: 2, title: 'Task', status: 'Todo' },
    ]);

    await expect(useCase.execute(2)).resolves.toEqual({
      board: {
        id: 2,
        name: 'Board',
        statuses: [{ id: 1, label: 'Todo', order: 0 }],
        labels: [],
      },
      statuses: [{ id: 1, label: 'Todo', order: 0 }],
      tasks: [{ id: 1, boardId: 2, title: 'Task', status: 'Todo' }],
    });
  });

  it('throws NotFoundException when board does not exist', async () => {
    boardRepository.getById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
