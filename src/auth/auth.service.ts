import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(email: string, username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id, user.role);

    return { token, user };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.role);

    return { token, user };
  }

  private generateToken(userId: number, role: string): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
