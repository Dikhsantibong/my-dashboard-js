import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
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
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { nik: data.nik },
      });

      if (existingUser) {
        throw new ConflictException('NIK sudah terdaftar');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      // Remove password from response
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Gagal melakukan registrasi');
    }
  }

  async login(nik: string, password: string) {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { nik },
      });

      if (!user) {
        throw new UnauthorizedException('NIK atau password salah');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('NIK atau password salah');
      }

      // Generate JWT token
      const payload = {
        sub: user.id,
        nik: user.nik,
        role: user.role,
      };

      // Remove password from response
      const { password: _, ...result } = user;

      return {
        access_token: await this.jwtService.signAsync(payload),
        user: result,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Gagal melakukan login');
    }
  }
}
