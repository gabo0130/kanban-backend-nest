import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class GetBoardByIdUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(boardId: number) {
    const board = await this.boardRepository.getById(boardId);

    if (!board) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    const tasks = await this.boardRepository.getTasksByBoardId(boardId);

    return {
      board,
      statuses: board.statuses,
      tasks,
    };
  }
}
