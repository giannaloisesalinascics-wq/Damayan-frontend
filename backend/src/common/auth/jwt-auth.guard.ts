import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppRole } from '../../../libs/contracts/src/roles.js';

interface RequestWithHeaders {
  headers: {
    authorization?: string;
  };
  user?: {
    sub: string;
    email: string;
    role: AppRole;
    exp?: number;
    iat?: number;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      request.user = (await this.jwtService.verifyAsync(token, {
        secret:
          this.configService.get<string>('JWT_SECRET') ??
          'your-secret-key-change-this-in-production',
      })) as RequestWithHeaders['user'];
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
