import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AuthModule } from './presentation/auth.module';
import { UserOrmEntity } from './infrastructure/database/typeorm/user.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): PostgresConnectionOptions => {
        const synchronize =
          configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true';
        const sslEnabled =
          configService.get<string>('DB_SSL', 'true') === 'true';

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          entities: [UserOrmEntity],
          synchronize,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
