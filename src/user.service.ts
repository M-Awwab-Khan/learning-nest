import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private users: User[] = [];
  private nextId = 1;

  create(createUserDto: CreateUserDto): User {
    console.log('Creating user:', createUserDto);
    const user: User = {
      id: this.nextId++,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  remove(id: number): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}
