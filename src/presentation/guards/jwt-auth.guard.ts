import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import type { TokenService } from '../../domain/repositories/token-service.interface';
import { TOKEN_SERVICE } from '../../shared/interfaces/tokens';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({ message: 'Token no proporcionado' });
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = this.tokenService.verify(token);
    request.user = { userId: payload.userId };

    return true;
  }
}
