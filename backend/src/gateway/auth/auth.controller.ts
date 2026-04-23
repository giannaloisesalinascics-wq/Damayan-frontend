import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthProxyService } from './auth.proxy.service.js';
import { SignupDto } from '../../auth/dto/signup.dto.js';
import { LoginDto } from '../../auth/dto/login.dto.js';
import { ForgotPasswordDto } from '../../auth/dto/forgot-password.dto.js';
import { ResetPasswordDto } from '../../auth/dto/reset-password.dto.js';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authProxyService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authProxyService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authProxyService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authProxyService.resetPassword(resetPasswordDto);
  }
}
