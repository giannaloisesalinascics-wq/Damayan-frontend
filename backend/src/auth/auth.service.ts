import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  GatewayTimeoutException,
} from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import {
  ForgotPasswordDto,
  RecoveryMethod,
} from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { AppRole } from '../../libs/contracts/src/roles.js';

interface UserProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  auth_user_id?: string | null;
}

interface PasswordResetRequestRow {
  contact: string;
  user_id: string;
  method: RecoveryMethod;
  code: string;
  expires_at: string;
  used_at: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async signup(signupDto: SignupDto) {
    const supabase = this.supabaseService.getClient() as any;
    const formattedPhone = this.formatPhoneForStorage(signupDto.phone);
    const requestedRole = signupDto.role ?? AppRole.LINE_MANAGER;

    if (
      requestedRole === AppRole.ADMIN &&
      process.env.ALLOW_ADMIN_SELF_SIGNUP !== 'true'
    ) {
      throw new BadRequestException(
        'Admin accounts must be provisioned by an existing administrator',
      );
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: signupDto.email,
        password: signupDto.password,
      },
    );

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already registered')) {
        throw new ConflictException('User with this email already exists');
      }
      throw new BadRequestException(signUpError.message);
    }

    const authUser = signUpData.user;
    if (!authUser) {
      throw new BadRequestException('Unable to create auth user');
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        auth_user_id: authUser.id,
        first_name: signupDto.firstName,
        last_name: signupDto.lastName,
        phone: formattedPhone,
        role: requestedRole,
      });

    if (profileError) {
      throw new BadRequestException(
        `Profile creation failed: ${profileError.message}`,
      );
    }

    const payload = {
      sub: authUser.id,
      email: signupDto.email,
      role: requestedRole,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Signup successful',
      access_token: accessToken,
      user: {
        id: authUser.id,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        name: `${signupDto.firstName} ${signupDto.lastName}`.trim(),
        email: signupDto.email,
        phone: formattedPhone,
        role: requestedRole,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const supabase = this.supabaseService.getClient() as any;

    const { data, error } = await this.withTimeout<any>(
      supabase.auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      }),
      'Authentication service timed out during login.',
    );

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = data.user.id;
    const { data: profile, error: profileError } = await this.withTimeout<any>(
      supabase
        .from('user_profiles')
        .select('id, first_name, last_name, phone, role')
        .eq('auth_user_id', userId)
        .maybeSingle(),
      'Profile lookup timed out during login.',
    );

    if (profileError) {
      throw new BadRequestException(profileError.message);
    }

    const payload = {
      sub: userId,
      email: loginDto.email,
      role: (profile?.role as AppRole | undefined) ?? AppRole.CITIZEN,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: loginDto.rememberMe ? '30d' : '7d',
    });

    return {
      message: 'Login successful',
      access_token: accessToken,
      expiresIn: loginDto.rememberMe ? '30d' : '7d',
      user: {
        id: profile?.id ?? userId,
        firstName: profile?.first_name ?? '',
        lastName: profile?.last_name ?? '',
        name: `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim(),
        email: loginDto.email,
        phone: profile?.phone ?? '',
        role: (profile?.role as AppRole | undefined) ?? AppRole.CITIZEN,
      },
    };
  }

  private async withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = 10000): Promise<T> {
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          timeoutHandle = setTimeout(() => {
            reject(new GatewayTimeoutException(message));
          }, timeoutMs);
        }),
      ]);
    } finally {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const supabase = this.supabaseService.getClient() as any;
    const method: RecoveryMethod =
      forgotPasswordDto.method ??
      (forgotPasswordDto.contact?.includes('@')
        ? RecoveryMethod.EMAIL
        : RecoveryMethod.SMS);
    const email =
      forgotPasswordDto.email ??
      (method === RecoveryMethod.EMAIL ? forgotPasswordDto.contact : undefined);
    const phone =
      forgotPasswordDto.phone ??
      (method === RecoveryMethod.SMS ? forgotPasswordDto.contact : undefined);
    const contact =
      method === RecoveryMethod.EMAIL ? email ?? '' : phone ?? '';

    if (!contact) {
      throw new BadRequestException('A valid contact value is required');
    }

    const normalizedContact = this.normalizeContact(contact, method);
    const userId = await this.findUserIdForPasswordReset(normalizedContact, method);
    const code = randomInt(1000, 10000).toString();

    const { error: resetRequestError } = await supabase
      .from('password_reset_requests')
      .upsert(
        {
          contact: normalizedContact,
          user_id: userId,
          method,
          code,
          expires_at: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
          used_at: null,
        },
        { onConflict: 'contact' },
      );

    if (resetRequestError) {
      throw new BadRequestException(
        `Password reset request could not be stored: ${resetRequestError.message}`,
      );
    }

    await this.notificationsService.sendPasswordResetCode(
      method,
      normalizedContact,
      code,
    );

    return {
      message: 'Verification code sent',
      maskedContact: this.maskContact(normalizedContact, method),
      ...(process.env.NODE_ENV !== 'production'
        ? { debugVerificationCode: code }
        : {}),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const code = resetPasswordDto.code ?? resetPasswordDto.verificationCode;
    const { newPassword, contact } = resetPasswordDto;
    if (!code) {
      throw new BadRequestException('Verification code is required');
    }

    const method = contact.includes('@')
      ? RecoveryMethod.EMAIL
      : RecoveryMethod.SMS;
    const normalizedContact = this.normalizeContact(contact, method);
    const supabase = this.supabaseService.getClient() as any;
    const { data: resetRequest, error: resetRequestError } = await supabase
      .from('password_reset_requests')
      .select('contact, user_id, method, code, expires_at, used_at')
      .eq('contact', normalizedContact)
      .maybeSingle();

    if (resetRequestError) {
      throw new BadRequestException(resetRequestError.message);
    }

    if (!resetRequest || resetRequest.code !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const resetRequestRow = resetRequest as PasswordResetRequestRow;

    if (resetRequestRow.used_at) {
      throw new UnauthorizedException('Verification code has already been used');
    }

    if (new Date(resetRequestRow.expires_at).getTime() < Date.now()) {
      await supabase
        .from('password_reset_requests')
        .delete()
        .eq('contact', normalizedContact);
      throw new UnauthorizedException('Verification code expired');
    }

    const { error } = await supabase.auth.admin.updateUserById(
      resetRequestRow.user_id,
      { password: newPassword },
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    await supabase
      .from('password_reset_requests')
      .update({ used_at: new Date().toISOString() })
      .eq('contact', normalizedContact);

    return {
      message: 'Password reset successful.',
    };
  }

  private maskContact(contact: string, method: RecoveryMethod): string {
    if (method === RecoveryMethod.EMAIL) {
      const [username, domain] = contact.split('@');
      const masked =
        username.substring(0, 2) +
        '***' +
        username.substring(username.length - 1);
      return `${masked}@${domain}`;
    } else {
      // Phone: +63XXXXXXXXXX -> +63XXX***XX
      return (
        contact.substring(0, 6) + '***' + contact.substring(contact.length - 2)
      );
    }
  }

  private normalizeContact(contact: string, method: RecoveryMethod): string {
    if (method === RecoveryMethod.EMAIL) {
      return contact.trim().toLowerCase();
    }

    let digits = contact.replace(/\D/g, '');

    if (digits.startsWith('63')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    return `+63${digits.slice(0, 10)}`;
  }

  private formatPhoneForStorage(phone: string): string {
    let digits = phone.replace(/\D/g, '');

    if (digits.startsWith('63')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    const localDigits = digits.slice(0, 10);
    return `+63-${localDigits.slice(0, 3)}-${localDigits.slice(3, 6)}-${localDigits.slice(6, 10)}`;
  }

  private async findUserIdForPasswordReset(
    contact: string,
    method: RecoveryMethod,
  ): Promise<string> {
    const supabase = this.supabaseService.getClient() as any;

    if (method === RecoveryMethod.EMAIL) {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        throw new BadRequestException(error.message);
      }

      const matchedUser = data.users.find(
        (user: { id: string; email?: string | null }) =>
          user.email?.toLowerCase() === contact,
      );

      if (!matchedUser) {
        throw new BadRequestException('No account found for that email');
      }

      return matchedUser.id;
    }

    const formattedPhone = this.formatPhoneForStorage(contact);
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('auth_user_id, phone')
      .not('auth_user_id', 'is', null);

    if (error) {
      throw new BadRequestException(error.message);
    }

    const matchedProfile = (profiles as UserProfileRow[]).find((profile) => {
      const profilePhone = profile.phone ?? '';
      return (
        this.normalizeContact(profilePhone, RecoveryMethod.SMS) === contact ||
        profilePhone === formattedPhone
      );
    });

    if (!matchedProfile?.auth_user_id) {
      throw new BadRequestException('No account found for that phone number');
    }

    return matchedProfile.auth_user_id;
  }
}
