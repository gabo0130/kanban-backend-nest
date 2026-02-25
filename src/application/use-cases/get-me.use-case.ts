import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from '../dto/user-response.dto';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../shared/interfaces/tokens';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException({ message: 'Usuario no encontrado' });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
