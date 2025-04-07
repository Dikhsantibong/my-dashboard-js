import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('users/:id')
  @Roles(Role.ADMIN)
  async getUser(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post('users')
  @Roles(Role.ADMIN)
  async createUser(@Body() userData: any) {
    return await this.usersService.create(userData);
  }

  @Put('users/:id')
  @Roles(Role.ADMIN)
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return await this.usersService.update(id, userData);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
} 