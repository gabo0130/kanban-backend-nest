import { UserEntity } from '../entities/user.entity';
import type { UserRole } from '../entities/user-role.type';

export interface CreateUserRepositoryDto {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface UpdateUserRepositoryDto {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(data: CreateUserRepositoryDto): Promise<UserEntity>;
  update(id: number, data: UpdateUserRepositoryDto): Promise<UserEntity | null>;
  delete(id: number): Promise<boolean>;
}
