import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLabelDto } from '../dto/create-label.dto';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class CreateLabelUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(boardId: number, data: CreateLabelDto) {
    const created = await this.boardRepository.createLabel({
      boardId,
      name: data.name.trim(),
      color: data.color?.trim(),
    });

    if (!created) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    if (!created.name) {
      throw new ConflictException({ message: 'No se pudo crear la etiqueta' });
    }

    return created;
  }
}
