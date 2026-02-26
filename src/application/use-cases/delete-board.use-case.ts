import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class DeleteBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(boardId: number): Promise<void> {
    const deleted = await this.boardRepository.delete(boardId);

    if (!deleted) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }
  }
}
