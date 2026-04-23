import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCheckInDto {
  @IsNotEmpty()
  @IsString()
  evacueeNumber: string; // ID number or QR code data

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
