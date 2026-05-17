import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCenterService } from '../apicenter/apicenter.service.js';
import { RecoveryMethod } from '../auth/dto/forgot-password.dto.js';

@Injectable()
export class NotificationsService {
  private readonly isProduction: boolean;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(ApiCenterService) private readonly apiCenterService: ApiCenterService,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

  async sendPasswordResetCode(
    method: RecoveryMethod,
    contact: string,
    code: string,
  ): Promise<void> {
    const sentViaSupabaseFunction = await this.sendPasswordResetViaSupabaseFunction(
      method,
      contact,
      code,
    );

    if (sentViaSupabaseFunction) {
      return;
    }

    if (method === RecoveryMethod.EMAIL) {
      await this.sendPasswordResetEmail(contact, code);
      return;
    }

    await this.sendPasswordResetSms(contact, code);
  }

  async sendBroadcastEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      await this.apiCenterService.sendEmail({
        to: [{ email: to }],
        subject,
        text: message,
      });
      return true;
    } catch (error) {
      this.handleDeliveryFailure(
        error instanceof Error ? error.message : 'Failed to send broadcast email.',
      );
      return false;
    }
  }

  async sendBroadcastSms(to: string, message: string): Promise<boolean> {
    try {
      await this.apiCenterService.sendSms({ to, message });
      return true;
    } catch (error) {
      this.handleDeliveryFailure(
        error instanceof Error ? error.message : 'Failed to send broadcast SMS.',
      );
      return false;
    }
  }

  private async sendPasswordResetEmail(to: string, code: string): Promise<void> {
    try {
      await this.apiCenterService.sendEmail({
        to: [{ email: to }],
        subject: 'Your Damayan password reset code',
        text: `Your password reset code is ${code}. It will expire in 10 minutes.`,
      });
    } catch (error) {
      this.handleDeliveryFailure(
        error instanceof Error ? error.message : 'Failed to send password reset email.',
      );
    }
  }

  private async sendPasswordResetSms(to: string, code: string): Promise<void> {
    try {
      await this.apiCenterService.sendSms({
        to,
        message: `Your Damayan password reset code is ${code}. It expires in 10 minutes.`,
      });
    } catch (error) {
      this.handleDeliveryFailure(
        error instanceof Error ? error.message : 'Failed to send password reset SMS.',
      );
    }
  }

  private async sendPasswordResetViaSupabaseFunction(
    method: RecoveryMethod,
    contact: string,
    code: string,
  ): Promise<boolean> {
    const functionName = this.configService.get<string>('SUPABASE_PASSWORD_RESET_FUNCTION_NAME')?.trim();
    if (!functionName) {
      return false;
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')?.replace(/\/$/, '');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ??
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        '[NotificationsService] Supabase password reset function is configured, but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to direct delivery.',
      );
      return false;
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method, contact, code }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.warn(
          `[NotificationsService] Supabase password reset function ${functionName} returned ${response.status}: ${responseText}. Falling back to direct delivery.`,
        );
        return false;
      }

      return true;
    } catch (error) {
      console.warn(
        `[NotificationsService] Supabase password reset function ${functionName} failed: ${error instanceof Error ? error.message : 'Unknown error'}. Falling back to direct delivery.`,
      );
      return false;
    }
  }

  private handleDeliveryFailure(message: string): void {
    if (!this.isProduction) {
      console.warn(`[NotificationsService] ${message}`);
      return;
    }

    throw new InternalServerErrorException(message);
  }
}