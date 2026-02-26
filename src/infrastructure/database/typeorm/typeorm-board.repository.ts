import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  type BoardDto,
  type BoardLabelDto,
  type BoardTaskDto,
  BoardRepository,
  type BoardStatusDto,
  type CreateBoardLabelRepositoryDto,
  type CreateBoardRepositoryDto,
  type UpdateBoardLabelRepositoryDto,
  type UpdateBoardRepositoryDto,
} from '../../../domain/repositories/board.repository.interface';
import { BoardOrmEntity } from './board.orm-entity';
import { BoardStatusOrmEntity } from './board-status.orm-entity';
import { BoardLabelOrmEntity } from './board-label.orm-entity';
import { TaskOrmEntity } from './task.orm-entity';

@Injectable()
export class TypeOrmBoardRepository implements BoardRepository {
  constructor(
    @InjectRepository(BoardOrmEntity)
    private readonly boardRepository: Repository<BoardOrmEntity>,
    @InjectRepository(BoardStatusOrmEntity)
    private readonly statusRepository: Repository<BoardStatusOrmEntity>,
    @InjectRepository(BoardLabelOrmEntity)
    private readonly labelRepository: Repository<BoardLabelOrmEntity>,
    @InjectRepository(TaskOrmEntity)
    private readonly taskRepository: Repository<TaskOrmEntity>,
  ) {}

  async list(): Promise<BoardDto[]> {
    const boards = await this.boardRepository.find({
      order: { id: 'ASC' },
    });

    return Promise.all(boards.map((board) => this.toBoardDto(board)));
  }

  async getById(boardId: number): Promise<BoardDto | null> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    return board ? this.toBoardDto(board) : null;
  }

  async getTasksByBoardId(boardId: number): Promise<BoardTaskDto[]> {
    const tasks = await this.taskRepository.find({
      where: { boardId },
      order: { order: 'ASC', id: 'ASC' },
    });

    return Promise.all(
      tasks.map(async (task) => {
        const assignee = task.assigneeId !== null ? await task.assignee : null;

        return {
          id: task.id,
          boardId: task.boardId,
          title: task.title,
          description: task.description ?? undefined,
          status: task.status,
          assigneeId: task.assigneeId ?? undefined,
          assigneeName:
            assignee?.name ??
            assignee?.username ??
            assignee?.email ??
            undefined,
          labels: task.labels ?? undefined,
          order: task.order ?? undefined,
        };
      }),
    );
  }

  async create(data: CreateBoardRepositoryDto): Promise<BoardDto> {
    const board = await this.boardRepository.save(
      this.boardRepository.create({
        name: data.name,
        description: data.description ?? null,
      }),
    );

    await this.replaceStatuses(board.id, data.statuses);

    if (data.labels && data.labels.length > 0) {
      const labels = data.labels.map((label) =>
        this.labelRepository.create({
          boardId: board.id,
          name: label.name,
          color: label.color ?? null,
        }),
      );
      await this.labelRepository.save(labels);
    }

    return this.toBoardDto(board);
  }

  async update(
    boardId: number,
    data: UpdateBoardRepositoryDto,
  ): Promise<BoardDto | null> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!board) {
      return null;
    }

    const merged = this.boardRepository.merge(board, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
    });

    await this.boardRepository.save(merged);

    if (data.statuses) {
      await this.replaceStatuses(boardId, data.statuses);
    }

    return this.toBoardDto(merged);
  }

  async delete(boardId: number): Promise<boolean> {
    await this.taskRepository.delete({ boardId });
    await this.labelRepository.delete({ boardId });
    await this.statusRepository.delete({ boardId });

    const result = await this.boardRepository.delete(boardId);
    return (result.affected ?? 0) > 0;
  }

  async createLabel(
    data: CreateBoardLabelRepositoryDto,
  ): Promise<BoardLabelDto | null> {
    const board = await this.boardRepository.findOne({
      where: { id: data.boardId },
    });

    if (!board) {
      return null;
    }

    const created = await this.labelRepository.save(
      this.labelRepository.create({
        boardId: data.boardId,
        name: data.name,
        color: data.color ?? null,
      }),
    );

    return {
      id: created.id,
      name: created.name,
      color: created.color ?? undefined,
    };
  }

  async updateLabel(
    boardId: number,
    labelId: number,
    data: UpdateBoardLabelRepositoryDto,
  ): Promise<BoardLabelDto | null> {
    const label = await this.labelRepository.findOne({
      where: { id: labelId, boardId },
    });

    if (!label) {
      return null;
    }

    const merged = this.labelRepository.merge(label, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.color !== undefined ? { color: data.color ?? null } : {}),
    });

    const saved = await this.labelRepository.save(merged);

    return {
      id: saved.id,
      name: saved.name,
      color: saved.color ?? undefined,
    };
  }

  async deleteLabel(boardId: number, labelId: number): Promise<boolean> {
    const result = await this.labelRepository.delete({ id: labelId, boardId });
    return (result.affected ?? 0) > 0;
  }

  private async toBoardDto(board: BoardOrmEntity): Promise<BoardDto> {
    const statuses = await this.statusRepository.find({
      where: { boardId: board.id },
      order: { order: 'ASC', id: 'ASC' },
    });
    const labels = await this.labelRepository.find({
      where: { boardId: board.id },
      order: { id: 'ASC' },
    });

    return {
      id: board.id,
      name: board.name,
      description: board.description ?? undefined,
      statuses: statuses.map((status) => this.toBoardStatusDto(status)),
      labels: labels.map((label) => this.toBoardLabelDto(label)),
    };
  }

  private toBoardStatusDto(status: BoardStatusOrmEntity): BoardStatusDto {
    return {
      id: status.id,
      label: status.label,
      order: status.order,
    };
  }

  private toBoardLabelDto(label: BoardLabelOrmEntity): BoardLabelDto {
    return {
      id: label.id,
      name: label.name,
      color: label.color ?? undefined,
    };
  }

  private async replaceStatuses(
    boardId: number,
    statuses: string[],
  ): Promise<void> {
    await this.statusRepository.delete({ boardId });

    const normalizedStatuses = statuses
      .map((status) => status.trim())
      .filter(Boolean);

    if (normalizedStatuses.length === 0) {
      return;
    }

    const rows = normalizedStatuses.map((status, index) =>
      this.statusRepository.create({
        boardId,
        label: status,
        order: index,
      }),
    );

    await this.statusRepository.save(rows);
  }
}
