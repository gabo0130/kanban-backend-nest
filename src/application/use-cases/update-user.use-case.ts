import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../shared/interfaces/tokens';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, data: UpdateUserDto) {
    const existing = await this.userRepository.findById(userId);
    if (!existing) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    const normalizedEmail = data.email?.trim().toLowerCase();
    if (normalizedEmail && normalizedEmail !== existing.email) {
      const userByEmail =
        await this.userRepository.findByEmail(normalizedEmail);
      if (userByEmail && userByEmail.id !== userId) {
        throw new ConflictException({ message: 'Correo ya registrado' });
      }
    }

    const updated = await this.userRepository.update(userId, {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(normalizedEmail !== undefined ? { email: normalizedEmail } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
    });

    if (!updated) {
      throw new NotFoundException({ message: 'Recurso no encontrado' });
    }

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    };
  }
}
