import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '../../../libs/contracts/src/message-patterns.js';
import { AuthService } from '../../../src/auth/auth.service.js';
import { SignupDto } from '../../../src/auth/dto/signup.dto.js';
import { LoginDto } from '../../../src/auth/dto/login.dto.js';
import { ForgotPasswordDto } from '../../../src/auth/dto/forgot-password.dto.js';
import { ResetPasswordDto } from '../../../src/auth/dto/reset-password.dto.js';

@Controller()
export class AuthMessageController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.SIGNUP)
  signup(@Payload() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERNS.GET_PROFILE)
  getProfile(@Payload() payload: { userId: string }) {
    return this.authService.getProfile(payload.userId);
  }

  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  forgotPassword(@Payload() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  resetPassword(@Payload() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
