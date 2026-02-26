import type { UserRole } from '../../domain/entities/user-role.type';

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
