import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CreateTaskRepositoryDto,
  TaskRepository,
  UpdateTaskRepositoryDto,
} from '../../../domain/repositories/task.repository.interface';
import type { BoardTaskDto } from '../../../domain/repositories/board.repository.interface';
import { TaskOrmEntity } from './task.orm-entity';
import { BoardOrmEntity } from './board.orm-entity';
import { BoardStatusOrmEntity } from './board-status.orm-entity';

@Injectable()
export class TypeOrmTaskRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly taskRepository: Repository<TaskOrmEntity>,
    @InjectRepository(BoardOrmEntity)
    private readonly boardRepository: Repository<BoardOrmEntity>,
    @InjectRepository(BoardStatusOrmEntity)
    private readonly boardStatusRepository: Repository<BoardStatusOrmEntity>,
  ) {}

  async findById(taskId: number): Promise<BoardTaskDto | null> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    return task ? this.toTaskDto(task) : null;
  }

  async create(data: CreateTaskRepositoryDto): Promise<BoardTaskDto | null> {
    const boardExists = await this.boardExists(data.boardId);
    if (!boardExists) {
      return null;
    }

    const created = await this.taskRepository.save(
      this.taskRepository.create({
        boardId: data.boardId,
        title: data.title,
        description: data.description ?? null,
        status: data.status,
        assigneeId: data.assigneeId ?? null,
        labels: data.labels && data.labels.length > 0 ? data.labels : null,
      }),
    );

    return this.toTaskDto(created);
  }

  async update(
    taskId: number,
    data: UpdateTaskRepositoryDto,
  ): Promise<BoardTaskDto | null> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      return null;
    }

    const merged = this.taskRepository.merge(task, {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined
        ? { description: data.description ?? null }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.assigneeId !== undefined
        ? { assigneeId: data.assigneeId ?? null }
        : {}),
      ...(data.labels !== undefined
        ? { labels: data.labels.length > 0 ? data.labels : null }
        : {}),
    });

    const saved = await this.taskRepository.save(merged);
    return this.toTaskDto(saved);
  }

  async delete(taskId: number): Promise<boolean> {
    const result = await this.taskRepository.delete(taskId);
    return (result.affected ?? 0) > 0;
  }

  async updateStatus(
    taskId: number,
    status: string,
    position?: number,
  ): Promise<BoardTaskDto | null> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      return null;
    }

    task.status = status;

    if (position !== undefined) {
      task.order = position;
    }

    const saved = await this.taskRepository.save(task);
    return this.toTaskDto(saved);
  }

  async boardExists(boardId: number): Promise<boolean> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    return !!board;
  }

  async boardHasStatus(boardId: number, status: string): Promise<boolean> {
    const existing = await this.boardStatusRepository.findOne({
      where: {
        boardId,
        label: status,
      },
    });

    return !!existing;
  }

  private toTaskDto(task: TaskOrmEntity): BoardTaskDto {
    return {
      id: task.id,
      boardId: task.boardId,
      title: task.title,
      description: task.description ?? undefined,
      status: task.status,
      assigneeId: task.assigneeId ?? undefined,
      labels: task.labels ?? undefined,
      order: task.order ?? undefined,
    };
  }
}
