import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
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
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice('Bearer '.length);


    if (!this.configService) {
      console.warn('[JwtAuthGuard] ConfigService is UNDEFINED in constructor injection fallback!');
    }

    const secret = this.configService?.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    
    console.log(`[JwtAuthGuard] Secret source: ${this.configService?.get('JWT_SECRET') ? 'ConfigService' : (process.env.JWT_SECRET ? 'process.env' : 'default')}`);
    console.log(`[JwtAuthGuard] Verifying token with secret: ${secret.substring(0, 3)}...`);

    try {
      request.user = (await this.jwtService.verifyAsync(token, {
        secret,
      })) as RequestWithHeaders['user'];
      console.log(`[JwtAuthGuard] Token verified successfully for user: ${request.user?.email} (role: ${request.user?.role})`);
      return true;
    } catch (err) {
      console.error(`[JwtAuthGuard] Token verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
