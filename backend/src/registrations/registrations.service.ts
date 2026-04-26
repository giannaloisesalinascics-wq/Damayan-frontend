import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateCitizenDto } from './dto/create-citizen.dto.js';
import { UpdateCitizenDto } from './dto/update-citizen.dto.js';
import { CreateFamilyDto } from './dto/create-family.dto.js';
import { UpdateFamilyDto } from './dto/update-family.dto.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';

interface CitizenRow {
  user_id: string;
  birth_date: string | null;
  gender: string | null;
  registration_type: string | null;
  family_id: string | null;
  full_name: string | null;
  blood_type: string | null;
  medical_conditions: string | null;
  qr_code_id: string | null;
  created_at: string | null;
}

interface FamilyRow {
  id: string;
  qr_code_id: string;
  head_user_id: string | null;
  head_full_name: string | null;
  family_member_name: string | null;
  relationship: string | null;
  user_id: string | null;
  family_member_count: number | null;
  age: number | null;
  accessibility_needs: string | null;
  created_at: string | null;
}

interface AnimalRow {
  id: string;
  user_id: string | null;
  family_id: string | null;
  name: string;
  species: string;
  needs_cage: boolean;
  created_at: string | null;
}

@Injectable()
export class RegistrationsService {
  constructor(
    @Inject(SupabaseService)
    private readonly supabaseService: SupabaseService,
  ) {}

  async findCitizens(search?: string) {
    console.log('RegistrationsService.findCitizens called, search:', search);
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('register_citizens')
      .select('user_id, birth_date, gender, registration_type, family_id, full_name, blood_type, medical_conditions, qr_code_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('findCitizens error:', error);
      throw new NotFoundException(error.message);
    }

    const citizens = ((data ?? []) as CitizenRow[]).map((row) => this.toCitizen(row));
    if (!search) {
      return citizens;
    }

    const searchText = search.toLowerCase();
    return citizens.filter(
      (citizen) =>
        citizen.fullName?.toLowerCase().includes(searchText) ||
        citizen.qrCodeId?.toLowerCase().includes(searchText) ||
        citizen.registrationType?.toLowerCase().includes(searchText),
    );
  }

  async findCitizen(id: string) {
    console.log('RegistrationsService.findCitizen called, id:', id);
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('register_citizens')
      .select('user_id, birth_date, gender, registration_type, family_id, full_name, blood_type, medical_conditions, qr_code_id, created_at')
      .eq('user_id', id)
      .maybeSingle();

    if (error || !data) {
      console.warn(`Citizen profile for user ${id} not found`);
      throw new NotFoundException(`Citizen profile for user ${id} not found`);
    }

    return this.toCitizen(data as CitizenRow);
  }

  async createCitizen(createCitizenDto: CreateCitizenDto) {
    console.log('RegistrationsService.createCitizen called with:', JSON.stringify(createCitizenDto, null, 2));
    
    if (!this.supabaseService) {
      console.error('RegistrationsService: supabaseService is undefined!');
      throw new Error('Internal Server Error: Supabase service missing');
    }

    const supabase = this.supabaseService.getClient() as any;
    if (!supabase) {
      console.error('RegistrationsService: Failed to get supabase client!');
      throw new Error('Internal Server Error: Supabase client missing');
    }

    const { data, error } = await supabase
      .from('register_citizens')
      .upsert({
        user_id: createCitizenDto.userId,
        birth_date: createCitizenDto.birthDate ?? null,
        gender: createCitizenDto.gender ?? null,
        registration_type: createCitizenDto.registrationType,
        family_id: null,
        full_name: createCitizenDto.fullName ?? null,
        blood_type: createCitizenDto.bloodType ?? null,
        medical_conditions: createCitizenDto.medicalConditions ?? null,
        qr_code_id: createCitizenDto.qrCodeId,
      })
      .select()
      .single();

    if (error) {
      console.error('createCitizen error:', error);
      throw new NotFoundException(error.message);
    }

    return this.toCitizen(data as CitizenRow);
  }

  async updateCitizen(id: string, updateCitizenDto: UpdateCitizenDto) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('register_citizens')
      .update({
        birth_date: updateCitizenDto.birthDate,
        gender: updateCitizenDto.gender,
        registration_type: updateCitizenDto.registrationType,
        family_id: updateCitizenDto.familyId,
        full_name: updateCitizenDto.fullName,
        blood_type: updateCitizenDto.bloodType,
        medical_conditions: updateCitizenDto.medicalConditions,
        qr_code_id: updateCitizenDto.qrCodeId,
      })
      .eq('user_id', id)
      .select()
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
      .select('id, qr_code_id, head_user_id, created_at, head_full_name, family_member_name, relationship, user_id, family_member_count, age, accessibility_needs')
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
        family.headFullName?.toLowerCase().includes(searchText) ||
        family.qrCodeId.toLowerCase().includes(searchText) ||
        family.members.some((member: any) =>
          member.name.toLowerCase().includes(searchText) ||
          member.relationship?.toLowerCase().includes(searchText),
        ),
    );
  }

  async findFamily(id: string) {
    const families = await this.findFamilies();
    const family = families.find((entry) => entry.id === id || entry.qrCodeId === id);
    if (!family) {
      throw new NotFoundException(`Family record ${id} not found`);
    }
    return family;
  }

  async createFamily(createFamilyDto: CreateFamilyDto) {
    console.log('RegistrationsService.createFamily called with:', JSON.stringify(createFamilyDto, null, 2));
    const supabase = this.supabaseService.getClient() as any;
    if (!supabase) {
      console.error('RegistrationsService: Failed to get supabase client in createFamily!');
      throw new Error('Internal Server Error: Supabase client missing');
    }

    const { data, error } = await supabase
      .from('families')
      .insert({
        qr_code_id: createFamilyDto.qrCodeId,
        head_user_id: createFamilyDto.headUserId ?? null,
        head_full_name: createFamilyDto.headFullName,
        family_member_name: createFamilyDto.familyMemberName ?? null,
        relationship: createFamilyDto.relationship ?? null,
        user_id: createFamilyDto.userId ?? null,
        family_member_count: createFamilyDto.familyMemberCount ?? 1,
        age: createFamilyDto.age ?? null,
        accessibility_needs: createFamilyDto.accessibilityNeeds ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new NotFoundException(error.message);
    }

    return this.toFamily([data as FamilyRow]);
  }

  async updateFamily(id: string, updateFamilyDto: UpdateFamilyDto) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('families')
      .update({
        qr_code_id: updateFamilyDto.qrCodeId,
        head_user_id: updateFamilyDto.headUserId,
        head_full_name: updateFamilyDto.headFullName,
        family_member_name: updateFamilyDto.familyMemberName,
        relationship: updateFamilyDto.relationship,
        user_id: updateFamilyDto.userId,
        age: updateFamilyDto.age,
        accessibility_needs: updateFamilyDto.accessibilityNeeds,
      })
      .eq('id', id)
      .select()
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

  async createAnimal(createAnimalDto: CreateAnimalDto) {
    console.log('RegistrationsService.createAnimal called with:', JSON.stringify(createAnimalDto, null, 2));
    const supabase = this.supabaseService.getClient() as any;
    if (!supabase) {
      console.error('RegistrationsService: Failed to get supabase client in createAnimal!');
      throw new Error('Internal Server Error: Supabase client missing');
    }

    const { data, error } = await supabase
      .from('household_animals')
      .insert({
        user_id: createAnimalDto.userId ?? null,
        qr_code_id: createAnimalDto.qrCodeId ?? null,
        name: createAnimalDto.name,
        species: createAnimalDto.species,
        needs_cage: createAnimalDto.needsCage ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('createAnimal error:', error);
      throw new NotFoundException(error.message);
    }

    return data;
  }

  async deleteFamilyMembersByQr(qrCodeId: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { error } = await supabase
      .from('families')
      .delete()
      .eq('qr_code_id', qrCodeId);
    if (error) throw new Error(error.message);
  }

  async deleteAnimalsByUser(userId: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { error } = await supabase
      .from('household_animals')
      .delete()
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  async findFamiliesByHead(headUserId: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('head_user_id', headUserId);
    if (error) throw new Error(error.message);
    return data;
  }

  async findAnimalsByUser(userId: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('household_animals')
      .select('*')
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data;
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
    return {
      id: row.user_id, // Using user_id as ID
      userId: row.user_id,
      fullName: row.full_name ?? undefined,
      birthDate: row.birth_date ?? undefined,
      gender: row.gender ?? undefined,
      registrationType: row.registration_type ?? undefined,
      qrCodeId: row.qr_code_id ?? undefined,
      familyId: row.family_id ?? undefined,
      bloodType: row.blood_type ?? undefined,
      medicalConditions: row.medical_conditions ?? undefined,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    };
  }

  private toFamily(rows: FamilyRow[]) {
    const head = rows[0];
    return {
      id: head.id,
      qrCodeId: head.qr_code_id,
      headUserId: head.head_user_id ?? undefined,
      headFullName: head.head_full_name ?? undefined,
      members: rows
        .filter((row) => row.family_member_name)
        .map((row) => ({
          id: row.id,
          name: row.family_member_name as string,
          relationship: row.relationship ?? undefined,
          userId: row.user_id ?? undefined,
          age: row.age ?? undefined,
          accessibilityNeeds: row.accessibility_needs ?? undefined,
        })),
      createdAt: head.created_at ? new Date(head.created_at) : new Date(),
    };
  }
}
