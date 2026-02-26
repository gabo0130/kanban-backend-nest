import { Inject, Injectable } from '@nestjs/common';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class ListBoardsUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute() {
    const boards = await this.boardRepository.list();
    return { boards };
  }
}
