import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../domain/repositories/token-service.interface';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(userId: number): string {
    return this.jwtService.sign({ userId });
  }

  verify(token: string): { userId: number } {
    try {
      return this.jwtService.verify<{ userId: number }>(token);
    } catch {
      throw new UnauthorizedException({
        message: 'Token no válido o expirado',
      });
    }
  }
}
