import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import type { BoardRepository } from '../../domain/repositories/board.repository.interface';
import { BOARD_REPOSITORY } from '../../shared/interfaces/tokens';

const LABEL_COLOR_PALETTE = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#10B981',
  '#06B6D4',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
];

@Injectable()
export class CreateBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async execute(data: CreateBoardDto) {
    const statuses = this.normalizeStatuses(data.statuses);
    const labels = this.normalizeLabels(data.labels);

    if (statuses.length === 0) {
      throw new ConflictException({
        message: 'Debe incluir al menos un estado válido',
      });
    }

    return this.boardRepository.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      statuses,
      labels,
    });
  }

  private normalizeStatuses(statuses: string[]): string[] {
    const normalized = statuses.map((status) => status.trim()).filter(Boolean);
    return [...new Set(normalized)];
  }

  private normalizeLabels(labels?: string[]) {
    if (!labels || labels.length === 0) {
      return undefined;
    }

    const normalized = [
      ...new Set(labels.map((label) => label.trim()).filter(Boolean)),
    ];

    if (normalized.length === 0) {
      return undefined;
    }

    return normalized.map((labelName) => ({
      name: labelName,
      color: this.getRandomLabelColor(),
    }));
  }

  private getRandomLabelColor(): string {
    const randomIndex = Math.floor(Math.random() * LABEL_COLOR_PALETTE.length);
    return LABEL_COLOR_PALETTE[randomIndex];
  }
}
