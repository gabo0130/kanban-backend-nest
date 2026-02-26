import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateLabelUseCase } from './create-label.use-case';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';

describe('CreateLabelUseCase', () => {
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

  const useCase = new CreateLabelUseCase(boardRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates label with trimmed values', async () => {
    boardRepository.createLabel.mockResolvedValue({
      id: 10,
      name: 'feature',
      color: '#fff',
    });

    const result = await useCase.execute(1, {
      name: '  feature  ',
      color: '  #fff  ',
    });

    expect(boardRepository.createLabel).toHaveBeenCalledWith({
      boardId: 1,
      name: 'feature',
      color: '#fff',
    });
    expect(result.id).toBe(10);
  });

  it('throws NotFoundException when board does not exist', async () => {
    boardRepository.createLabel.mockResolvedValue(null);

    await expect(useCase.execute(99, { name: 'x' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws ConflictException when created label has empty name', async () => {
    boardRepository.createLabel.mockResolvedValue({ id: 2, name: '' });

    await expect(useCase.execute(1, { name: 'x' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
