import { UsersController } from './users.controller';
import type { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import type { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import type { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import type { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import type { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import type { CreateUserDto } from '../../application/dto/create-user.dto';
import type { UpdateUserDto } from '../../application/dto/update-user.dto';

describe('UsersController', () => {
  const listUsersUseCase: jest.Mocked<Pick<ListUsersUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const createUserUseCase: jest.Mocked<Pick<CreateUserUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const getUserByIdUseCase: jest.Mocked<Pick<GetUserByIdUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const updateUserUseCase: jest.Mocked<Pick<UpdateUserUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const deleteUserUseCase: jest.Mocked<Pick<DeleteUserUseCase, 'execute'>> = {
    execute: jest.fn(),
  };

  const controller = new UsersController(
    listUsersUseCase,
    createUserUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAll delegates to list use case', async () => {
    listUsersUseCase.execute.mockResolvedValue({ users: [] });
    await expect(controller.findAll()).resolves.toEqual({ users: [] });
  });

  it('create delegates to create use case', async () => {
    const dto: CreateUserDto = {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'Secret123*',
      role: 'Member',
    };
    createUserUseCase.execute.mockResolvedValue({ id: 1 });

    await expect(controller.create(dto)).resolves.toEqual({ id: 1 });
    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('findById delegates to getUserById use case', async () => {
    getUserByIdUseCase.execute.mockResolvedValue({ id: 1 });

    await expect(controller.findById(1)).resolves.toEqual({ id: 1 });
  });

  it('update delegates to update use case', async () => {
    updateUserUseCase.execute.mockResolvedValue({ id: 1 });
    const dto: UpdateUserDto = { name: 'X' };

    await expect(controller.update(1, dto)).resolves.toEqual({
      id: 1,
    });
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(1, dto);
  });

  it('remove delegates to delete use case', async () => {
    deleteUserUseCase.execute.mockResolvedValue(undefined);

    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(1);
  });
});
