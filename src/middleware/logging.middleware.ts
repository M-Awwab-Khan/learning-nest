import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    console.log('\n🔥 === INCOMING REQUEST ===');
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log(`🌐 Method: ${req.method}`);
    console.log(`📍 URL: ${req.originalUrl}`);
    console.log(`🖥️  IP Address: ${req.ip}`);
    console.log(`🔧 User-Agent: ${req.get('User-Agent') || 'Not provided'}`);
    console.log(
      `📦 Content-Type: ${req.get('Content-Type') || 'Not provided'}`,
    );

    // Log request body if it exists (be careful with sensitive data in production)
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`📝 Request Body:`, JSON.stringify(req.body, null, 2));
    }

    // Log query parameters if they exist
    if (req.query && Object.keys(req.query).length > 0) {
      console.log(`🔍 Query Params:`, req.query);
    }

    // Log route parameters if they exist
    if (req.params && Object.keys(req.params).length > 0) {
      console.log(`🎯 Route Params:`, req.params);
    }

    // Listen for the response finish event to log response details
    res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log('\n✅ === OUTGOING RESPONSE ===');
      console.log(`⏱️  Response Time: ${responseTime}ms`);
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📤 Content-Type: ${res.get('Content-Type') || 'Not set'}`);
      console.log('🔚 === REQUEST COMPLETED ===\n');
    });

    next();
  }
}
