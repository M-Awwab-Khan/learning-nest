import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getDetails(): string {
    return 'This is a NestJS application.';
  }
}
