import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_PATTERNS } from '../../../libs/contracts/src/message-patterns.js';
import { AUTH_SERVICE } from '../gateway.tokens.js';
import { SignupDto } from '../../auth/dto/signup.dto.js';
import { LoginDto } from '../../auth/dto/login.dto.js';
import { ForgotPasswordDto } from '../../auth/dto/forgot-password.dto.js';
import { ResetPasswordDto } from '../../auth/dto/reset-password.dto.js';

@Injectable()
export class AuthProxyService {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  signup(signupDto: SignupDto) {
    return firstValueFrom(this.authClient.send(AUTH_PATTERNS.SIGNUP, signupDto));
  }

  login(loginDto: LoginDto) {
    return firstValueFrom(this.authClient.send(AUTH_PATTERNS.LOGIN, loginDto));
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.FORGOT_PASSWORD, forgotPasswordDto),
    );
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.RESET_PASSWORD, resetPasswordDto),
    );
  }
}
