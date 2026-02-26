import { BoardsController } from './boards.controller';
import type { ListBoardsUseCase } from '../../application/use-cases/list-boards.use-case';
import type { GetBoardByIdUseCase } from '../../application/use-cases/get-board-by-id.use-case';
import type { CreateBoardUseCase } from '../../application/use-cases/create-board.use-case';
import type { UpdateBoardUseCase } from '../../application/use-cases/update-board.use-case';
import type { DeleteBoardUseCase } from '../../application/use-cases/delete-board.use-case';
import type { CreateLabelUseCase } from '../../application/use-cases/create-label.use-case';
import type { UpdateLabelUseCase } from '../../application/use-cases/update-label.use-case';
import type { DeleteLabelUseCase } from '../../application/use-cases/delete-label.use-case';
import type { CreateBoardDto } from '../../application/dto/create-board.dto';
import type { UpdateBoardDto } from '../../application/dto/update-board.dto';
import type { CreateLabelDto } from '../../application/dto/create-label.dto';
import type { UpdateLabelDto } from '../../application/dto/update-label.dto';
import type { BoardDto } from '../../domain/repositories/board.repository.interface';

describe('BoardsController', () => {
  const listBoardsUseCase: jest.Mocked<Pick<ListBoardsUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const getBoardByIdUseCase: jest.Mocked<Pick<GetBoardByIdUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const createBoardUseCase: jest.Mocked<Pick<CreateBoardUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const updateBoardUseCase: jest.Mocked<Pick<UpdateBoardUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const deleteBoardUseCase: jest.Mocked<Pick<DeleteBoardUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const createLabelUseCase: jest.Mocked<Pick<CreateLabelUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const updateLabelUseCase: jest.Mocked<Pick<UpdateLabelUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const deleteLabelUseCase: jest.Mocked<Pick<DeleteLabelUseCase, 'execute'>> = {
    execute: jest.fn(),
  };

  const controller = new BoardsController(
    listBoardsUseCase as unknown as ListBoardsUseCase,
    getBoardByIdUseCase as unknown as GetBoardByIdUseCase,
    createBoardUseCase as unknown as CreateBoardUseCase,
    updateBoardUseCase as unknown as UpdateBoardUseCase,
    deleteBoardUseCase as unknown as DeleteBoardUseCase,
    createLabelUseCase as unknown as CreateLabelUseCase,
    updateLabelUseCase as unknown as UpdateLabelUseCase,
    deleteLabelUseCase as unknown as DeleteLabelUseCase,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAll delegates to list use case', async () => {
    listBoardsUseCase.execute.mockResolvedValue({ boards: [] });

    await expect(controller.findAll()).resolves.toEqual({ boards: [] });
  });

  it('create delegates to create use case', async () => {
    const dto: CreateBoardDto = {
      name: 'Board',
      statuses: ['Todo'],
      labels: ['bug'],
    };
    const board: BoardDto = {
      id: 1,
      name: 'Board',
      statuses: [],
      labels: [],
    };
    createBoardUseCase.execute.mockResolvedValue(board);

    await expect(controller.create(dto)).resolves.toEqual(board);
    expect(createBoardUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('findById delegates to get use case', async () => {
    const board: BoardDto = { id: 3, name: 'Board', statuses: [], labels: [] };
    getBoardByIdUseCase.execute.mockResolvedValue({
      board,
      statuses: [],
      tasks: [],
    });

    await expect(controller.findById(3)).resolves.toEqual({
      board,
      statuses: [],
      tasks: [],
    });
  });

  it('update delegates to update use case', async () => {
    const dto: UpdateBoardDto = { name: 'New Name' };
    const board: BoardDto = {
      id: 3,
      name: 'New Name',
      statuses: [],
      labels: [],
    };
    updateBoardUseCase.execute.mockResolvedValue(board);

    await expect(controller.update(3, dto)).resolves.toEqual(board);
    expect(updateBoardUseCase.execute).toHaveBeenCalledWith(3, dto);
  });

  it('remove delegates to delete use case', async () => {
    deleteBoardUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.remove(3)).resolves.toBeUndefined();
    expect(deleteBoardUseCase.execute).toHaveBeenCalledWith(3);
  });

  it('createLabel delegates to create label use case', async () => {
    const dto: CreateLabelDto = { name: 'feature' };
    createLabelUseCase.execute.mockResolvedValue({ id: 1, name: 'feature' });

    await expect(controller.createLabel(3, dto)).resolves.toEqual({
      id: 1,
      name: 'feature',
    });
    expect(createLabelUseCase.execute).toHaveBeenCalledWith(3, dto);
  });

  it('updateLabel delegates to update label use case', async () => {
    const dto: UpdateLabelDto = { color: '#fff' };
    updateLabelUseCase.execute.mockResolvedValue({ id: 1, name: 'bug' });

    await expect(controller.updateLabel(3, 1, dto)).resolves.toEqual({
      id: 1,
      name: 'bug',
    });
    expect(updateLabelUseCase.execute).toHaveBeenCalledWith(3, 1, dto);
  });

  it('deleteLabel delegates to delete label use case', async () => {
    deleteLabelUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.deleteLabel(3, 1)).resolves.toBeUndefined();
    expect(deleteLabelUseCase.execute).toHaveBeenCalledWith(3, 1);
  });
});
