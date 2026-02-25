import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';

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

  async save(
    email: string,
    name: string,
    passwordHash: string,
    role = 'user',
  ): Promise<UserEntity> {
    const user = this.repository.create({
      email,
      name,
      password: passwordHash,
      role,
    });
    const saved = await this.repository.save(user);
    return this.toDomain(saved);
  }

  private toDomain(user: UserOrmEntity): UserEntity {
    return new UserEntity(user.id, user.name, user.email, user.password);
  }
}
