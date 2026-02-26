import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from './login.use-case';
import { UserEntity } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import type { PasswordHasher } from '../../domain/repositories/password-hasher.interface';
import type { TokenService } from '../../domain/repositories/token-service.interface';

describe('LoginUseCase', () => {
  const userRepository: jest.Mocked<Pick<UserRepository, 'findByEmail'>> = {
    findByEmail: jest.fn(),
  };

  const passwordHasher: jest.Mocked<Pick<PasswordHasher, 'compare'>> = {
    compare: jest.fn(),
  };

  const tokenService: jest.Mocked<Pick<TokenService, 'generate'>> = {
    generate: jest.fn(),
  };

  const useCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

  const user = new UserEntity(
    1,
    'Juan',
    'juan@example.com',
    'hashed-password',
    'Admin',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns token and user when credentials are valid', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    tokenService.generate.mockReturnValue('jwt-token');

    const result = await useCase.execute({
      email: '  JUAN@EXAMPLE.COM ',
      password: 'Secret123*',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('juan@example.com');
    expect(passwordHasher.compare).toHaveBeenCalledWith('Secret123*', 'hashed-password');
    expect(tokenService.generate).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      token: 'jwt-token',
      user: {
        id: 1,
        name: 'Juan',
        email: 'juan@example.com',
        role: 'Admin',
      },
    });
  });

  it('throws UnauthorizedException when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'missing@example.com', password: 'Secret123*' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws UnauthorizedException when password is invalid', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'juan@example.com', password: 'bad-pass' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
