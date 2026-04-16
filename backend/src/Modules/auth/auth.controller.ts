import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const payload = {
      name: body.name,
      email: body.email,
      password: body.password,
    };
    return this.authService.register(payload);
  }
  @Post('login')
  login(@Body() body: any) {
    const payload = {
      email: body.email,
      password: body.password,
    };
    return this.authService.login(payload);
  }
}
