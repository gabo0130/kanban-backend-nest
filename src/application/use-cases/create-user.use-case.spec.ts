import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { UserEntity } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import type { PasswordHasher } from '../../domain/repositories/password-hasher.interface';

describe('CreateUserUseCase', () => {
  const userRepository: jest.Mocked<
    Pick<UserRepository, 'findByEmail' | 'create'>
  > = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const passwordHasher: jest.Mocked<Pick<PasswordHasher, 'hash'>> = {
    hash: jest.fn(),
  };

  const useCase = new CreateUserUseCase(userRepository, passwordHasher);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates user when email is available', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed');
    userRepository.create.mockResolvedValue(
      new UserEntity(2, 'Ana', 'ana@example.com', 'hashed', 'Manager'),
    );

    const result = await useCase.execute({
      name: '  Ana  ',
      email: ' ANA@EXAMPLE.COM ',
      password: 'Secret123*',
      role: 'Manager',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('ana@example.com');
    expect(passwordHasher.hash).toHaveBeenCalledWith('Secret123*');
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'hashed',
      role: 'Manager',
    });
    expect(result.role).toBe('Manager');
  });

  it('throws ConflictException when email is already used', async () => {
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity(10, 'Existing', 'existing@example.com', 'x', 'Member'),
    );

    await expect(
      useCase.execute({
        name: 'Ana',
        email: 'existing@example.com',
        password: 'Secret123*',
        role: 'Member',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
