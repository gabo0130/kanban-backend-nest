import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBoardDto } from '../dto/update-board.dto';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class UpdateBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(boardId: number, data: UpdateBoardDto) {
    const statuses = data.statuses
      ? this.normalizeStatuses(data.statuses)
      : undefined;

    if (data.statuses && statuses?.length === 0) {
      throw new ConflictException({
        message: 'Debe incluir al menos un estado válido',
      });
    }

    const updated = await this.boardRepository.update(boardId, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description.trim() }
        : {}),
      ...(statuses ? { statuses } : {}),
    });

    if (!updated) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    return updated;
  }

  private normalizeStatuses(statuses: string[]): string[] {
    const normalized = statuses.map((status) => status.trim()).filter(Boolean);
    return [...new Set(normalized)];
  }
}
