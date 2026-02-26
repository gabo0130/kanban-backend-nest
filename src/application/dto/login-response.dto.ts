import type { UserRole } from '../../domain/entities/user-role.type';

export interface LoginResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}
