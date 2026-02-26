import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_ROLES } from '../../domain/entities/user-role.type';
import type { UserRole } from '../../domain/entities/user-role.type';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de email inválido' })
  email?: string;

  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;
}
