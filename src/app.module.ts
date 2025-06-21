import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AdminController } from './admin.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SnrFK!>ytwfbGF*K!{=3@@#nQa|]PxvB~%3yV3KpM]::L%&FfVM,X4~ik~%:K[[', // Use environment variable in production!
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, UserController, AdminController],
  providers: [AppService, UserService, AuthGuard, RolesGuard, RateLimitGuard],
})
export class AppModule {}
