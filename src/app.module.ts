import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './presentation/auth.module';
import { HealthController } from './presentation/controllers/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const synchronize =
          configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true';
        const sslEnabled =
          configService.get<string>('DB_SSL', 'true') === 'true';

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
