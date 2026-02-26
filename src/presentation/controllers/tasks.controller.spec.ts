import { TasksController } from './tasks.controller';
import type { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import type { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import type { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import type { UpdateTaskStatusUseCase } from '../../application/use-cases/update-task-status.use-case';
import type { CreateTaskDto } from '../../application/dto/create-task.dto';
import type { UpdateTaskDto } from '../../application/dto/update-task.dto';
import type { UpdateTaskStatusDto } from '../../application/dto/update-task-status.dto';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import type { BoardTaskDto } from '../../domain/repositories/board.repository.interface';

describe('TasksController', () => {
  const createTaskUseCase: jest.Mocked<Pick<CreateTaskUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const updateTaskUseCase: jest.Mocked<Pick<UpdateTaskUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const deleteTaskUseCase: jest.Mocked<Pick<DeleteTaskUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const updateTaskStatusUseCase: jest.Mocked<
    Pick<UpdateTaskStatusUseCase, 'execute'>
  > = {
    execute: jest.fn(),
  };

  const controller = new TasksController(
    createTaskUseCase as unknown as CreateTaskUseCase,
    updateTaskUseCase as unknown as UpdateTaskUseCase,
    deleteTaskUseCase as unknown as DeleteTaskUseCase,
    updateTaskStatusUseCase as unknown as UpdateTaskStatusUseCase,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create delegates to use case', async () => {
    const dto: CreateTaskDto = { boardId: 1, title: 'Task', status: 'Todo' };
    const task: BoardTaskDto = {
      id: 5,
      boardId: 1,
      title: 'Task',
      status: 'Todo',
    };
    createTaskUseCase.execute.mockResolvedValue(task);

    await expect(controller.create(dto)).resolves.toEqual(task);
    expect(createTaskUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('update delegates to use case', async () => {
    const dto: UpdateTaskDto = { title: 'Updated' };
    const task: BoardTaskDto = {
      id: 6,
      boardId: 1,
      title: 'Updated',
      status: 'Todo',
    };
    updateTaskUseCase.execute.mockResolvedValue(task);

    await expect(controller.update(6, dto)).resolves.toEqual(task);
    expect(updateTaskUseCase.execute).toHaveBeenCalledWith(6, dto);
  });

  it('delete delegates to use case', async () => {
    deleteTaskUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.delete(4)).resolves.toBeUndefined();
    expect(deleteTaskUseCase.execute).toHaveBeenCalledWith(4);
  });

  it('updateStatus passes actor from request user', async () => {
    const dto: UpdateTaskStatusDto = { status: 'Doing', position: 2 };
    const req = {
      user: { userId: 99, role: 'Manager' },
    } as AuthenticatedRequest;

    const task: BoardTaskDto = {
      id: 1,
      boardId: 1,
      title: 'Task',
      status: 'Doing',
    };
    updateTaskStatusUseCase.execute.mockResolvedValue({ task });

    await expect(controller.updateStatus(1, dto, req)).resolves.toEqual({ task });
    expect(updateTaskStatusUseCase.execute).toHaveBeenCalledWith(1, dto, {
      userId: 99,
      role: 'Manager',
    });
  });
});
