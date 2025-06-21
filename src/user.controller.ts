import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { Roles } from './guards/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Public endpoint - no guards
  @Post()
  @UsePipes(CustomValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    console.log('Creating user:', createUserDto);
    const { user, token } = this.userService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
      token: token,
    };
  }

  // Public endpoint - no authentication required
  @Get()
  findAll() {
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: this.userService.findAll(),
    };
  }

  // Authenticated users only
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    return {
      success: true,
      message: 'User profile retrieved',
      data: req.user,
    };
  }

  // Public endpoint
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // Authenticated users can update their own profile or admins can update any
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @UsePipes(CustomValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Check if user is updating their own profile or is admin
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new NotFoundException('You can only update your own profile');
    }

    const user = this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User updated successfully',
      data: user,
      updatedBy: req.user,
    };
  }

  // Only admins can delete users + rate limiting
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard, RateLimitGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const deleted = this.userService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User deleted successfully',
      deletedBy: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
