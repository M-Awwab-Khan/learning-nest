import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { UpperCasePipe } from './pipes/upper-case-pipe';

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

  @Get('/details/:name')
  getUserDetails(@Param('name', UpperCasePipe) name: string): string {
    return `User Name: ${name}`;
  }

  // @Get('/users/:id')
  // getUserById(@Param('id', ParseIntPipe) id: number): string {
  //   return `User ID: ${id}`;
  // }
}
