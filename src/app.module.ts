import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AdminController } from './admin.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Module({
  imports: [],
  controllers: [AppController, UserController, AdminController],
  providers: [AppService, UserService, AuthGuard, RolesGuard, RateLimitGuard],
})
export class AppModule {}
