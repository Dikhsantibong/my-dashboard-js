import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    nik: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: 'VOTER', // Default role
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async login(nik: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { nik } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      nik: user.nik, 
      role: user.role 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nik: user.nik,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
} 