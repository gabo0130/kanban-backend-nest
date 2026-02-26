import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.use-case';
import { UserEntity } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';

describe('UpdateUserUseCase', () => {
  const userRepository: jest.Mocked<
    Pick<UserRepository, 'findById' | 'findByEmail' | 'update'>
  > = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  const useCase = new UpdateUserUseCase(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws NotFoundException when target user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, { name: 'X' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws ConflictException when normalized email belongs to another user', async () => {
    userRepository.findById.mockResolvedValue(
      new UserEntity(1, 'A', 'a@example.com', 'x', 'Member'),
    );
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity(2, 'B', 'b@example.com', 'x', 'Member'),
    );

    await expect(
      useCase.execute(1, { email: ' B@EXAMPLE.COM ' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when update returns null', async () => {
    userRepository.findById.mockResolvedValue(
      new UserEntity(1, 'A', 'a@example.com', 'x', 'Member'),
    );
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.update.mockResolvedValue(null);

    await expect(
      useCase.execute(1, { name: ' Nuevo ' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates user and normalizes values', async () => {
    userRepository.findById.mockResolvedValue(
      new UserEntity(1, 'A', 'a@example.com', 'x', 'Member'),
    );
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.update.mockResolvedValue(
      new UserEntity(1, 'Nuevo', 'new@example.com', 'x', 'Admin'),
    );

    const result = await useCase.execute(1, {
      name: ' Nuevo ',
      email: ' NEW@EXAMPLE.COM ',
      role: 'Admin',
    });

    expect(userRepository.update).toHaveBeenCalledWith(1, {
      name: 'Nuevo',
      email: 'new@example.com',
      role: 'Admin',
    });
    expect(result).toEqual({
      id: 1,
      name: 'Nuevo',
      email: 'new@example.com',
      role: 'Admin',
    });
  });
});
