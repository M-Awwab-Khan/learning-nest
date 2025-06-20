import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { Roles } from './guards/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard) // Apply guards to entire controller
export class AdminController {
  // Only authenticated users can access this
  @Get('dashboard')
  getDashboard(@Request() req) {
    return {
      message: 'Welcome to admin dashboard',
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  // Only admin role can access this
  @Get('users')
  @Roles('admin')
  getAllUsers(@Request() req) {
    return {
      message: 'Admin-only: All users data',
      requestedBy: req.user,
      users: [
        { id: 1, name: 'John Doe', role: 'admin' },
        { id: 2, name: 'Jane Smith', role: 'user' },
        { id: 3, name: 'Bob Johnson', role: 'user' },
      ],
    };
  }

  // Rate limited endpoint
  @Post('broadcast')
  @UseGuards(RateLimitGuard)
  @Roles('admin')
  broadcastMessage(@Body() body: { message: string }, @Request() req) {
    return {
      success: true,
      message: 'Broadcast sent successfully',
      broadcastMessage: body.message,
      sentBy: req.user,
      timestamp: new Date().toISOString(),
    };
  }

  // Multiple role access
  @Get('reports')
  @Roles('admin', 'manager')
  getReports(@Request() req) {
    return {
      message: 'Reports accessible by admin and manager roles',
      accessedBy: req.user,
      reports: ['Monthly Report', 'User Analytics', 'System Health'],
    };
  }

  // Admin-only delete operation
  @Delete('users/:id')
  @Roles('admin')
  deleteUser(@Param('id') id: string, @Request() req) {
    return {
      success: true,
      message: `User ${id} deleted successfully`,
      deletedBy: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
