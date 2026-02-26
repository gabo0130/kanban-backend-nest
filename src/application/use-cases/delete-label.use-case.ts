import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class DeleteLabelUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(boardId: number, labelId: number): Promise<void> {
    const deleted = await this.boardRepository.deleteLabel(boardId, labelId);

    if (!deleted) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }
  }
}
