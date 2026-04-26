import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CheckIn } from './interfaces/check-in.interface.js';
import { CreateCheckInDto } from './dto/create-check-in.dto.js';
import { ScanQrDto } from './dto/scan-qr.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

type EvacueeDbStatus = 'checked_in' | 'checked_out' | string | null;

interface EvacueeRow {
  id: string;
  auth_user_id: string;
  disaster_id: string | null;
  center_id: string | null;
  family_head: string | null;
  family_size: number | null;
  special_needs: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string | null;
}

interface CitizenRow {
  user_id: string;
  full_name: string | null;
  qr_code_id: string | null;
}

interface EvacuationCenterRow {
  id: string;
  name: string | null;
  barangay: string | null;
}

@Injectable()
export class CheckInService {
  constructor(@Inject(SupabaseService) private readonly supabaseService: SupabaseService) {}

  async findAll(search?: string): Promise<CheckIn[]> {
    const supabase = this.supabaseService.getClient() as any;
    const { data: evacuees, error: evacueesError } = await supabase
      .from('evacuees')
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .order('check_in_date', { ascending: false, nullsFirst: false });

    if (evacueesError) throw new NotFoundException(evacueesError.message);

    const rows = (evacuees ?? []) as EvacueeRow[];

    const authUserIds = Array.from(
      new Set(rows.map((r) => r.auth_user_id).filter((v) => !!v)),
    );
    const centerIds = Array.from(
      new Set(rows.map((r) => r.center_id).filter((v) => !!v)),
    ) as string[];

    const { data: citizens } = authUserIds.length
      ? await supabase
          .from('register_citizens')
          .select('user_id, full_name, qr_code_id')
          .in('user_id', authUserIds)
      : { data: [] as CitizenRow[] };

    const { data: centers } = centerIds.length
      ? await supabase
          .from('evacuation_centers')
          .select('id, name, barangay')
          .in('id', centerIds)
      : { data: [] as EvacuationCenterRow[] };

    const citizenMap = new Map<string, CitizenRow>(
      (citizens ?? []).map((p: CitizenRow) => [p.user_id, p]),
    );
    const centerMap = new Map<string, EvacuationCenterRow>(
      (centers ?? []).map((c: EvacuationCenterRow) => [c.id, c]),
    );

    const mapped = rows.map((row) => {
      const citizen = citizenMap.get(row.auth_user_id);
      const center = row.center_id ? centerMap.get(row.center_id) : undefined;
      return this.toCheckIn(row, citizen, center);
    });

    if (search) {
      const q = search.toLowerCase();
      return mapped.filter(
        (c) =>
          c.evacueeId?.toLowerCase().includes(q) ||
          c.status?.toLowerCase().includes(q) ||
          c.zone?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q),
      );
    }

    return mapped;
  }

  async findOne(id: string): Promise<CheckIn> {
    const supabase = this.supabaseService.getClient() as any;
    const { data: evacuee, error: evacueeError } = await supabase
      .from('evacuees')
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .eq('id', id)
      .maybeSingle();

    if (evacueeError || !evacuee) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }

    const row = evacuee as EvacueeRow;

    const { data: citizen } = await supabase
      .from('register_citizens')
      .select('user_id, full_name, qr_code_id')
      .eq('user_id', row.auth_user_id)
      .maybeSingle();

    const { data: center } = row.center_id
      ? await supabase
          .from('evacuation_centers')
          .select('id, name, barangay')
          .eq('id', row.center_id)
          .maybeSingle()
      : { data: undefined as EvacuationCenterRow | undefined };

    return this.toCheckIn(row, citizen ?? undefined, center ?? undefined);
  }

  async findByEvacueeNumber(
    evacueeNumber: string,
  ): Promise<CheckIn | undefined> {
    const supabase = this.supabaseService.getClient() as any;
    const { data } = await this.findEvacueeRecord(evacueeNumber, supabase);

    if (!data) return undefined;
    return this.findOne((data as EvacueeRow).id);
  }

  async scanQr(scanQrDto: ScanQrDto): Promise<CheckIn> {
    const raw = scanQrDto.qrCode.trim();
    const evacueeNumber = raw.startsWith('QR-') ? raw.replace('QR-', '') : raw;
    return this.createManual({ evacueeNumber });
  }

  async createManual(createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    const { evacueeNumber } = createCheckInDto;
    const supabase = this.supabaseService.getClient() as any;

    const { data: existing, error: existingError } = await this.findEvacueeRecord(
      evacueeNumber,
      supabase,
    );

    if (existingError) throw new BadRequestException(existingError.message);
    if (!existing)
      throw new NotFoundException(`Evacuee ${evacueeNumber} not found`);
    if (
      (existing.status as EvacueeDbStatus) === 'checked_in' &&
      existing.check_in_date
    ) {
      throw new BadRequestException(
        `Evacuee ${evacueeNumber} already checked in`,
      );
    }

    const { data, error } = await supabase
      .from('evacuees')
      .update({
        check_in_date: new Date().toISOString(),
        check_out_date: null,
        status: 'checked_in',
      })
      .eq('id', (existing as EvacueeRow).id)
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .single();

    if (error) throw new BadRequestException(error.message);
    return this.findOne((data as EvacueeRow).id);
  }

  async checkOut(id: string): Promise<CheckIn> {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('evacuees')
      .update({
        check_out_date: new Date().toISOString(),
        status: 'checked_out',
      })
      .eq('id', id)
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .single();

    if (error || !data) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async getStats() {
    const all = await this.findAll();
    const totalCheckedIn = all.filter((c) => c.status === 'checked-in').length;
    const totalCheckedOut = all.filter((c) => c.status === 'checked-out').length;

    const byZone = all.reduce(
      (acc, checkIn) => {
        if (checkIn.status === 'checked-in')
          acc[checkIn.zone] = (acc[checkIn.zone] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byLocation = all.reduce(
      (acc, checkIn) => {
        if (checkIn.status === 'checked-in') {
          acc[checkIn.location] = (acc[checkIn.location] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalCheckedIn,
      totalCheckedOut,
      total: all.length,
      byZone,
      byLocation,
    };
  }

  async getRecent(limit: number = 10): Promise<CheckIn[]> {
    const supabase = this.supabaseService.getClient() as any;
    const safeLimit = Number.isFinite(limit) ? Math.max(1, limit) : 10;

    const { data: evacuees, error: evacueesError } = await supabase
      .from('evacuees')
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .not('check_in_date', 'is', null)
      .order('check_in_date', { ascending: false })
      .limit(safeLimit);

    if (evacueesError) {
      throw new NotFoundException(evacueesError.message);
    }

    const rows = (evacuees ?? []) as EvacueeRow[];
    const authUserIds = Array.from(
      new Set(rows.map((r) => r.auth_user_id).filter((v) => !!v)),
    );
    const centerIds = Array.from(
      new Set(rows.map((r) => r.center_id).filter((v) => !!v)),
    ) as string[];

    const { data: citizens } = authUserIds.length
      ? await supabase
          .from('register_citizens')
          .select('user_id, full_name, qr_code_id')
          .in('user_id', authUserIds)
      : { data: [] as CitizenRow[] };

    const { data: centers } = centerIds.length
      ? await supabase
          .from('evacuation_centers')
          .select('id, name, barangay')
          .in('id', centerIds)
      : { data: [] as EvacuationCenterRow[] };

    const citizenMap = new Map<string, CitizenRow>(
      (citizens ?? []).map((p: CitizenRow) => [p.user_id, p]),
    );
    const centerMap = new Map<string, EvacuationCenterRow>(
      (centers ?? []).map((c: EvacuationCenterRow) => [c.id, c]),
    );

    return rows.map((row) =>
      this.toCheckIn(
        row,
        citizenMap.get(row.auth_user_id),
        row.center_id ? centerMap.get(row.center_id) : undefined,
      ),
    );
  }

  private async findEvacueeRecord(identifier: string, supabase: any) {
    const directMatch = await supabase
      .from('evacuees')
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .eq('id', identifier)
      .maybeSingle();

    if (directMatch.data || directMatch.error) {
      return directMatch;
    }

    const citizenMatch = await supabase
      .from('register_citizens')
      .select('user_id')
      .eq('qr_code_id', identifier)
      .maybeSingle();

    if (!citizenMatch.data) {
      return { data: null, error: null };
    }

    return supabase
      .from('evacuees')
      .select('id, auth_user_id, disaster_id, center_id, family_head, family_size, special_needs, check_in_date, check_out_date, status')
      .eq('auth_user_id', citizenMatch.data.user_id)
      .maybeSingle();
  }

  private toCheckIn(
    row: EvacueeRow,
    citizen?: CitizenRow,
    center?: EvacuationCenterRow,
  ): CheckIn {
    const name = this.parseFullName(citizen?.full_name);

    return {
      id: row.id,
      evacueeId: row.id,
      evacueeNumber: row.id,
      firstName: name.firstName,
      lastName: name.lastName,
      zone: center?.name ?? 'Unassigned Center',
      location: center?.barangay ?? 'Unknown Barangay',
      checkInTime: new Date(
        row.check_in_date ??
          row.check_out_date ??
          new Date().toISOString(),
      ),
      qrCode: citizen?.qr_code_id ?? `QR-${row.id}`,
      disasterId: row.disaster_id ?? undefined,
      familyHead: row.family_head ?? undefined,
      familySize: row.family_size ?? undefined,
      specialNeeds: row.special_needs ?? undefined,
      status:
        (row.status as EvacueeDbStatus) === 'checked_out'
          ? 'checked-out'
          : 'checked-in',
    };
  }

  private parseFullName(fullName?: string | null) {
    const parts = (fullName ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return { firstName: 'Unknown', lastName: 'Evacuee' };
    }

    if (parts.length === 1) {
      return { firstName: parts[0], lastName: 'Evacuee' };
    }

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  }
}
