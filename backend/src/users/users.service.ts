import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../auth/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nik: true,
        fullName: true,
        address: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Exclude password from response
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nik: true,
        fullName: true,
        address: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(userData: {
    nik: string;
    password: string;
    fullName: string;
    address: string;
    phoneNumber: string;
    role?: Role;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: userData.role || Role.VOTER,
      },
      select: {
        id: true,
        nik: true,
        fullName: true,
        address: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
  }

  async update(id: string, userData: {
    nik?: string;
    password?: string;
    fullName?: string;
    address?: string;
    phoneNumber?: string;
    role?: Role;
    isVerified?: boolean;
  }) {
    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        nik: true,
        fullName: true,
        address: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async delete(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { message: 'User deleted successfully' };
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
} 