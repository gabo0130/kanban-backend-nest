import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserRepository,
  type CreateUserRepositoryDto,
  type UpdateUserRepositoryDto,
} from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';
import {
  USER_ROLES,
  type UserRole,
} from '../../../domain/entities/user-role.type';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.repository.find({ order: { id: 'ASC' } });
    return users.map((user) => this.toDomain(user));
  }

  async create(data: CreateUserRepositoryDto): Promise<UserEntity> {
    const user = this.repository.create({
      email: data.email,
      name: data.name,
      username: data.email.split('@')[0],
      password: data.passwordHash,
      role: data.role,
    });

    const saved = await this.repository.save(user);
    return this.toDomain(saved);
  }

  async update(
    id: number,
    data: UpdateUserRepositoryDto,
  ): Promise<UserEntity | null> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    const merged = this.repository.merge(user, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined
        ? {
            email: data.email,
            username: data.email.split('@')[0],
          }
        : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
    });

    const saved = await this.repository.save(merged);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(user: UserOrmEntity): UserEntity {
    const role = USER_ROLES.includes(user.role as UserRole)
      ? (user.role as UserRole)
      : 'Member';

    return new UserEntity(
      user.id,
      user.name ?? user.username ?? user.email,
      user.email,
      user.password,
      role,
    );
  }
}
