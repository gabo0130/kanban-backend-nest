import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { GetMeUseCase } from '../../application/use-cases/get-me.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @HttpCode(200)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.userId;

    if (userId === undefined) {
      throw new UnauthorizedException({
        message: 'Token no válido o expirado',
      });
    }

    return this.getMeUseCase.execute(userId);
  }
}
