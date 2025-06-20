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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(CustomValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      message: 'User created successfully',
      data: this.userService.create(createUserDto),
    };
  }

  @Get()
  findAll() {
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: this.userService.findAll(),
    };
  }

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

  @Patch(':id')
  @UsePipes(CustomValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.userService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
