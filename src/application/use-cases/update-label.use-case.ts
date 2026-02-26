import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLabelDto } from '../dto/update-label.dto';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class UpdateLabelUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(boardId: number, labelId: number, data: UpdateLabelDto) {
    const updated = await this.boardRepository.updateLabel(boardId, labelId, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.color !== undefined ? { color: data.color.trim() } : {}),
    });

    if (!updated) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    return updated;
  }
}
