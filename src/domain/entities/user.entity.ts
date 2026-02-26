import type { UserRole } from './user-role.type';

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
  ) {}
}
