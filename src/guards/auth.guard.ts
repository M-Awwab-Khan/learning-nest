import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Simple token validation (in real apps, you'd validate JWT or API key)
    const token = authHeader.replace('Bearer ', '');

    // For demo purposes, we'll accept tokens: 'valid-token' or 'admin-token'
    const validTokens = ['valid-token', 'admin-token', 'user-token'];

    if (!validTokens.includes(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    // Add user info to request object for later use
    request.user = {
      id: token === 'admin-token' ? 1 : 2,
      role: token === 'admin-token' ? 'admin' : 'user',
      token: token,
    };

    return true;
  }
}
