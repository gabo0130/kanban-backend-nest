import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthController } from './controllers/auth.controller';
import { AccessController } from './controllers/access.controller';
import { UsersController } from './controllers/users.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { GetMeUseCase } from '../application/use-cases/get-me.use-case';
import { ListRolesUseCase } from '../application/use-cases/list-roles.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { UserOrmEntity } from '../infrastructure/database/typeorm/user.orm-entity';
import { TypeOrmUserRepository } from '../infrastructure/database/typeorm/typeorm-user.repository';
import { BcryptPasswordHasherService } from '../infrastructure/security/bcrypt-password-hasher.service';
import { JwtTokenService } from '../infrastructure/security/jwt-token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../shared/interfaces/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '7d') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController, UsersController, AccessController],
  providers: [
    LoginUseCase,
    GetMeUseCase,
    ListRolesUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    JwtAuthGuard,
    AuthorizationGuard,
    TypeOrmUserRepository,
    BcryptPasswordHasherService,
    JwtTokenService,
    {
      provide: USER_REPOSITORY,
      useExisting: TypeOrmUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useExisting: BcryptPasswordHasherService,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
  ],
})
export class AuthModule {}
