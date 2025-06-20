import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly limit = 10; // requests per minute
  private readonly windowMs = 60 * 1000; // 1 minute

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientId = this.getClientId(request);
    const now = Date.now();

    const clientData = this.requests.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      // First request or window has reset
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (clientData.count >= this.limit) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment request count
    clientData.count++;
    return true;
  }

  private getClientId(request: any): string {
    // Use IP address as client identifier
    return request.ip || request.connection.remoteAddress || 'unknown';
  }
}
