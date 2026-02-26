import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthController } from './controllers/auth.controller';
import { AccessController } from './controllers/access.controller';
import { UsersController } from './controllers/users.controller';
import { BoardsController } from './controllers/boards.controller';
import { TasksController } from './controllers/tasks.controller';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { GetMeUseCase } from '../application/use-cases/get-me.use-case';
import { ListRolesUseCase } from '../application/use-cases/list-roles.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { ListBoardsUseCase } from '../application/use-cases/list-boards.use-case';
import { GetBoardByIdUseCase } from '../application/use-cases/get-board-by-id.use-case';
import { CreateBoardUseCase } from '../application/use-cases/create-board.use-case';
import { UpdateBoardUseCase } from '../application/use-cases/update-board.use-case';
import { DeleteBoardUseCase } from '../application/use-cases/delete-board.use-case';
import { CreateLabelUseCase } from '../application/use-cases/create-label.use-case';
import { UpdateLabelUseCase } from '../application/use-cases/update-label.use-case';
import { DeleteLabelUseCase } from '../application/use-cases/delete-label.use-case';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.use-case';
import { UpdateTaskStatusUseCase } from '../application/use-cases/update-task-status.use-case';
import { UserOrmEntity } from '../infrastructure/database/typeorm/user.orm-entity';
import { BoardOrmEntity } from '../infrastructure/database/typeorm/board.orm-entity';
import { BoardStatusOrmEntity } from '../infrastructure/database/typeorm/board-status.orm-entity';
import { BoardLabelOrmEntity } from '../infrastructure/database/typeorm/board-label.orm-entity';
import { TaskOrmEntity } from '../infrastructure/database/typeorm/task.orm-entity';
import { TypeOrmUserRepository } from '../infrastructure/database/typeorm/typeorm-user.repository';
import { TypeOrmBoardRepository } from '../infrastructure/database/typeorm/typeorm-board.repository';
import { TypeOrmTaskRepository } from '../infrastructure/database/typeorm/typeorm-task.repository';
import { BcryptPasswordHasherService } from '../infrastructure/security/bcrypt-password-hasher.service';
import { JwtTokenService } from '../infrastructure/security/jwt-token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import {
  BOARD_REPOSITORY,
  PASSWORD_HASHER,
  TASK_REPOSITORY,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from '../shared/interfaces/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      BoardOrmEntity,
      BoardStatusOrmEntity,
      BoardLabelOrmEntity,
      TaskOrmEntity,
    ]),
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
  controllers: [
    AuthController,
    UsersController,
    AccessController,
    BoardsController,
    TasksController,
  ],
  providers: [
    LoginUseCase,
    GetMeUseCase,
    ListRolesUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListBoardsUseCase,
    GetBoardByIdUseCase,
    CreateBoardUseCase,
    UpdateBoardUseCase,
    DeleteBoardUseCase,
    CreateLabelUseCase,
    UpdateLabelUseCase,
    DeleteLabelUseCase,
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    UpdateTaskStatusUseCase,
    JwtAuthGuard,
    AuthorizationGuard,
    TypeOrmUserRepository,
    TypeOrmBoardRepository,
    TypeOrmTaskRepository,
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
      provide: BOARD_REPOSITORY,
      useExisting: TypeOrmBoardRepository,
    },
    {
      provide: TASK_REPOSITORY,
      useExisting: TypeOrmTaskRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
  ],
})
export class AuthModule {}
