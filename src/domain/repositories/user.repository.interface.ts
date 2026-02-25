import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  save(email: string, name: string, passwordHash: string, role?: string): Promise<UserEntity>;
}
