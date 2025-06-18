import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/details')
  getDetails(): string {
    return this.appService.getDetails();
  }

  @Get('/users/:id')
  getUserById(@Param('id') id: string): string {
    return `User ID: ${id}`;
  }
}
