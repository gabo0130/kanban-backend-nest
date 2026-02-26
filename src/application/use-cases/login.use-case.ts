import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import type { PasswordHasher } from '../../domain/repositories/password-hasher.interface';
import type { TokenService } from '../../domain/repositories/token-service.interface';
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../../shared/interfaces/tokens';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResponseDto> {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await this.passwordHasher.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException({ message: 'Credenciales inválidas' });
    }

    return {
      token: this.tokenService.generate(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
