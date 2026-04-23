import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFamilyDto {
  @IsNotEmpty()
  @IsString()
  qrCodeId!: string;

  @IsOptional()
  @IsString()
  headUserId?: string;

  @IsNotEmpty()
  @IsString()
  headFullName!: string;

  @IsOptional()
  @IsString()
  familyMemberName?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
