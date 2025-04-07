import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    data: {
      nik: string;
      password: string;
      fullName: string;
      phoneNumber?: string;
      address?: string;
    },
  ) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: { nik: string; password: string }) {
    return this.authService.login(data.nik, data.password);
  }
}
