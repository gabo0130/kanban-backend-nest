import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import type { LoginUseCase } from '../../application/use-cases/login.use-case';
import type { GetMeUseCase } from '../../application/use-cases/get-me.use-case';
import type { LoginDto } from '../../application/dto/login.dto';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

describe('AuthController', () => {
  const loginUseCase: jest.Mocked<Pick<LoginUseCase, 'execute'>> = {
    execute: jest.fn(),
  };
  const getMeUseCase: jest.Mocked<Pick<GetMeUseCase, 'execute'>> = {
    execute: jest.fn(),
  };

  const controller = new AuthController(loginUseCase, getMeUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates login to use case', async () => {
    loginUseCase.execute.mockResolvedValue({ token: 'x' });

    const dto: LoginDto = { email: 'a@example.com', password: 'Secret123*' };
    await expect(controller.login(dto)).resolves.toEqual({ token: 'x' });
    expect(loginUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('throws UnauthorizedException when request user is missing in getMe', async () => {
    expect(() => controller.getMe({} as AuthenticatedRequest)).toThrow(
      UnauthorizedException,
    );
  });

  it('delegates getMe to use case', async () => {
    getMeUseCase.execute.mockResolvedValue({ id: 1 });

    await expect(
      controller.getMe({ user: { userId: 1, role: 'Admin' } } as AuthenticatedRequest),
    ).resolves.toEqual({ id: 1 });
    expect(getMeUseCase.execute).toHaveBeenCalledWith(1);
  });
});
