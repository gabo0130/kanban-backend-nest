import { ListBoardsUseCase } from './list-boards.use-case';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';

describe('ListBoardsUseCase', () => {
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

  const useCase = new ListBoardsUseCase(boardRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns boards from repository', async () => {
    boardRepository.list.mockResolvedValue([{ id: 1, name: 'Board', statuses: [], labels: [] }]);

    await expect(useCase.execute()).resolves.toEqual({
      boards: [{ id: 1, name: 'Board', statuses: [], labels: [] }],
    });
    expect(boardRepository.list).toHaveBeenCalledTimes(1);
  });
});
