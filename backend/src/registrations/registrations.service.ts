import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateCitizenDto } from './dto/create-citizen.dto.js';
import { UpdateCitizenDto } from './dto/update-citizen.dto.js';
import { CreateFamilyDto } from './dto/create-family.dto.js';
import { UpdateFamilyDto } from './dto/update-family.dto.js';

interface CitizenRow {
  user_id: string;
  full_name: string | null;
  birth_date: string | null;
  gender: string | null;
  registration_type: string | null;
  qr_code_id: string | null;
  blood_type: string | null;
  medical_conditions: string | null;
  created_at: string | null;
  family_id: string | null;
}

interface FamilyRow {
  id: string;
  qr_code_id: string;
  head_user_id: string | null;
  created_at: string | null;
  head_full_name: string;
  family_member_name: string | null;
  relationship: string | null;
  user_id: string | null;
}

@Injectable()
export class RegistrationsService {
  constructor(@Inject(SupabaseService) private readonly supabaseService: SupabaseService) {}

  async findCitizens(search?: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('register_citizens')
      .select('user_id, full_name, birth_date, gender, registration_type, qr_code_id, blood_type, medical_conditions, created_at, family_id')
      .order('created_at', { ascending: false });

    if (error) {
      throw new NotFoundException(error.message);
    }

    const citizens = ((data ?? []) as CitizenRow[]).map((row) => this.toCitizen(row));
    if (!search) {
      return citizens;
    }

    const searchText = search.toLowerCase();
    return citizens.filter(
      (citizen) =>
        citizen.firstName.toLowerCase().includes(searchText) ||
        citizen.lastName.toLowerCase().includes(searchText) ||
        citizen.qrCodeId?.toLowerCase().includes(searchText) ||
        citizen.registrationType?.toLowerCase().includes(searchText),
    );
  }

  async findCitizen(id: string) {
    const citizens = await this.findCitizens();
    const citizen = citizens.find((entry) => entry.id === id);
    if (!citizen) {
      throw new NotFoundException(`Citizen with ID ${id} not found`);
    }
    return citizen;
  }

  async createCitizen(createCitizenDto: CreateCitizenDto) {
    if (!createCitizenDto.userId) {
      throw new BadRequestException('userId is required');
    }

    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('register_citizens')
      .insert({
        user_id: createCitizenDto.userId,
        full_name: this.buildFullName(
          createCitizenDto.firstName,
          createCitizenDto.lastName,
          createCitizenDto.middleName,
        ),
        birth_date: createCitizenDto.birthDate ?? null,
        gender: createCitizenDto.gender ?? null,
        registration_type: createCitizenDto.registrationType,
        qr_code_id: createCitizenDto.qrCodeId,
        family_id: createCitizenDto.familyId ?? null,
      })
      .select('user_id, full_name, birth_date, gender, registration_type, qr_code_id, blood_type, medical_conditions, created_at, family_id')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return this.toCitizen(data as CitizenRow);
  }

  async updateCitizen(id: string, updateCitizenDto: UpdateCitizenDto) {
    const existing = await this.findCitizen(id);
    const fullName = this.buildFullName(
      updateCitizenDto.firstName ?? existing.firstName,
      updateCitizenDto.lastName ?? existing.lastName,
      updateCitizenDto.middleName ?? existing.middleName,
    );
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('register_citizens')
      .update({
        full_name: fullName,
        birth_date: updateCitizenDto.birthDate ?? existing.birthDate ?? null,
        gender: updateCitizenDto.gender ?? existing.gender ?? null,
        registration_type: updateCitizenDto.registrationType ?? existing.registrationType ?? null,
        qr_code_id: updateCitizenDto.qrCodeId ?? existing.qrCodeId ?? null,
        family_id: updateCitizenDto.familyId ?? existing.familyId ?? null,
      })
      .eq('user_id', id)
      .select('user_id, full_name, birth_date, gender, registration_type, qr_code_id, blood_type, medical_conditions, created_at, family_id')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return this.toCitizen(data as CitizenRow);
  }

  async deleteCitizen(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient() as any;
    const { error } = await supabase.from('register_citizens').delete().eq('user_id', id);
    if (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findFamilies(search?: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('families')
      .select('id, qr_code_id, head_user_id, created_at, head_full_name, family_member_name, relationship, user_id')
      .order('created_at', { ascending: false });

    if (error) {
      throw new NotFoundException(error.message);
    }

    const grouped = new Map<string, FamilyRow[]>();
    for (const row of (data ?? []) as FamilyRow[]) {
      const groupKey = row.qr_code_id;
      const current = grouped.get(groupKey) ?? [];
      current.push(row);
      grouped.set(groupKey, current);
    }

    const families = Array.from(grouped.values()).map((rows) => this.toFamily(rows));
    if (!search) {
      return families;
    }

    const searchText = search.toLowerCase();
    return families.filter(
      (family) =>
        family.headFullName.toLowerCase().includes(searchText) ||
        family.qrCodeId.toLowerCase().includes(searchText) ||
        family.members.some((member: { name: string; relationship?: string }) =>
          member.name.toLowerCase().includes(searchText) ||
          member.relationship?.toLowerCase().includes(searchText),
        ),
    );
  }

  async findFamily(id: string) {
    const families = await this.findFamilies();
    const family = families.find((entry) => entry.id === id || entry.qrCodeId === id);
    if (!family) {
      throw new NotFoundException(`Family with ID ${id} not found`);
    }
    return family;
  }

  async createFamily(createFamilyDto: CreateFamilyDto) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('families')
      .insert({
        qr_code_id: createFamilyDto.qrCodeId,
        head_user_id: createFamilyDto.headUserId ?? null,
        head_full_name: createFamilyDto.headFullName,
        family_member_name: createFamilyDto.familyMemberName ?? null,
        relationship: createFamilyDto.relationship ?? null,
        user_id: createFamilyDto.userId ?? null,
      })
      .select('id, qr_code_id, head_user_id, created_at, head_full_name, family_member_name, relationship, user_id')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return this.toFamily([data as FamilyRow]);
  }

  async updateFamily(id: string, updateFamilyDto: UpdateFamilyDto) {
    const supabase = this.supabaseService.getClient() as any;
    const { data: existing, error: existingError } = await supabase
      .from('families')
      .select('id, qr_code_id, head_user_id, created_at, head_full_name, family_member_name, relationship, user_id')
      .eq('id', id)
      .maybeSingle();

    if (existingError || !existing) {
      throw new NotFoundException(`Family member record with ID ${id} not found`);
    }

    const existingRow = existing as FamilyRow;
    const { data, error } = await supabase
      .from('families')
      .update({
        qr_code_id: updateFamilyDto.qrCodeId ?? existingRow.qr_code_id,
        head_user_id: updateFamilyDto.headUserId ?? existingRow.head_user_id,
        head_full_name: updateFamilyDto.headFullName ?? existingRow.head_full_name,
        family_member_name: updateFamilyDto.familyMemberName ?? existingRow.family_member_name,
        relationship: updateFamilyDto.relationship ?? existingRow.relationship,
        user_id: updateFamilyDto.userId ?? existingRow.user_id,
      })
      .eq('id', id)
      .select('id, qr_code_id, head_user_id, created_at, head_full_name, family_member_name, relationship, user_id')
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return this.toFamily([data as FamilyRow]);
  }

  async deleteFamily(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient() as any;
    const { error } = await supabase.from('families').delete().eq('id', id);
    if (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getStats() {
    const [citizens, families] = await Promise.all([
      this.findCitizens(),
      this.findFamilies(),
    ]);

    return {
      totalCitizens: citizens.length,
      totalFamilies: families.length,
      qrRegisteredCitizens: citizens.filter((citizen) => citizen.qrCodeId).length,
    };
  }

  private toCitizen(row: CitizenRow) {
    const parsedName = this.parseFullName(row.full_name ?? '');

    return {
      id: row.user_id,
      userId: row.user_id,
      firstName: parsedName.firstName,
      lastName: parsedName.lastName,
      middleName: parsedName.middleName,
      birthDate: row.birth_date ?? undefined,
      gender: row.gender ?? undefined,
      registrationType: row.registration_type ?? undefined,
      qrCodeId: row.qr_code_id ?? undefined,
      emergencyContactName: undefined,
      emergencyContactNumber: undefined,
      familyId: row.family_id ?? undefined,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    };
  }

  private parseFullName(fullName: string) {
    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return { firstName: 'Unknown', lastName: 'User', middleName: undefined as string | undefined };
    }

    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '', middleName: undefined as string | undefined };
    }

    if (parts.length === 2) {
      return { firstName: parts[0], lastName: parts[1], middleName: undefined as string | undefined };
    }

    return {
      firstName: parts[0],
      middleName: parts.slice(1, -1).join(' '),
      lastName: parts[parts.length - 1],
    };
  }

  private buildFullName(firstName?: string, lastName?: string, middleName?: string) {
    return [firstName, middleName, lastName].filter((part) => !!part && part.trim().length > 0).join(' ');
  }

  private toFamily(rows: FamilyRow[]) {
    const [head, ...members] = rows;
    return {
      id: head.id,
      qrCodeId: head.qr_code_id,
      headUserId: head.head_user_id ?? undefined,
      headFullName: head.head_full_name,
      members: rows
        .filter((row) => row.family_member_name)
        .map((row) => ({
          id: row.id,
          name: row.family_member_name as string,
          relationship: row.relationship ?? undefined,
          userId: row.user_id ?? undefined,
        })),
      createdAt: head.created_at ? new Date(head.created_at) : new Date(),
    };
  }
}
