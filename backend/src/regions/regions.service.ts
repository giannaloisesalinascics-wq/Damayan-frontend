import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateShelterAssignmentDto } from './dto/create-shelter-assignment.dto.js';
import { RegionPhase } from './dto/update-region-phase.dto.js';
import { AppRole } from '../../libs/contracts/src/roles.js';
import { RegionPersonaPhase, UpsertRegionPersonaPhaseDto } from './dto/upsert-region-persona-phase.dto.js';

interface RegionRow {
  id: string;
  name: string;
  current_phase: string;
  updated_at: string | null;
}

interface ShelterAssignmentRow {
  id: string;
  center_id: string;
  manager_id: string;
  assigned_at: string | null;
  updated_at: string | null;
}

interface UserProfileRow {
  auth_user_id: string;
  first_name: string | null;
  last_name: string | null;
}

interface RegionPersonaPhaseControlRow {
  id: string;
  region_id: string;
  persona_role: AppRole;
  phase: RegionPersonaPhase;
  visible_to_assigned_users: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface RegionPersonaAudienceRow {
  auth_user_id: string;
  first_name: string | null;
  last_name: string | null;
  role: AppRole;
  assigned_region_id: string | null;
}

@Injectable()
export class RegionsService {
  constructor(@Inject(SupabaseService) private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('regions')
      .select('id, name, current_phase, updated_at')
      .order('name', { ascending: true });

    if (error) {
      throw new NotFoundException(error.message);
    }

    return ((data ?? []) as RegionRow[]).map((region) => ({
      id: region.id,
      name: region.name,
      currentPhase: region.current_phase as RegionPhase,
      updatedAt: region.updated_at,
    }));
  }

  async updatePhase(id: string, newPhase: RegionPhase) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('regions')
      .update({ current_phase: newPhase, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, name, current_phase, updated_at')
      .maybeSingle();

    if (error || !data) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    return {
      id: data.id,
      name: data.name,
      currentPhase: data.current_phase as RegionPhase,
      updatedAt: data.updated_at,
    };
  }

  async findAssignments(centerId?: string) {
    const supabase = this.supabaseService.getClient() as any;
    let query = supabase
      .from('shelter_assignments')
      .select('id, center_id, manager_id, assigned_at, updated_at')
      .order('assigned_at', { ascending: false });

    if (centerId) {
      query = query.eq('center_id', centerId);
    }

    const { data, error } = await query;
    if (error) {
      throw new NotFoundException(error.message);
    }

    const assignments = (data ?? []) as ShelterAssignmentRow[];
    const managerIds = assignments.map((assignment) => assignment.manager_id);

    const { data: profiles, error: profilesError } = managerIds.length
      ? await supabase
          .from('user_profiles')
          .select('auth_user_id, first_name, last_name')
          .in('auth_user_id', managerIds)
      : { data: [], error: null };

    if (profilesError) {
      throw new NotFoundException(profilesError.message);
    }

    const profileMap = new Map(
      ((profiles ?? []) as UserProfileRow[]).map((profile) => [profile.auth_user_id, profile]),
    );

    return assignments.map((assignment) => {
      const profile = profileMap.get(assignment.manager_id);
      const name = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim();

      return {
        id: assignment.id,
        centerId: assignment.center_id,
        managerId: assignment.manager_id,
        managerName: name || assignment.manager_id,
        assignedAt: assignment.assigned_at,
        updatedAt: assignment.updated_at,
      };
    });
  }

  async createAssignment(dto: CreateShelterAssignmentDto) {
    const supabase = this.supabaseService.getClient() as any;

    const { data: center, error: centerError } = await supabase
      .from('evacuation_centers')
      .select('id, max_managers')
      .eq('id', dto.centerId)
      .maybeSingle();

    if (centerError || !center) {
      throw new NotFoundException(`Evacuation center with ID ${dto.centerId} not found`);
    }

    const { count, error: countError } = await supabase
      .from('shelter_assignments')
      .select('id', { count: 'exact', head: true })
      .eq('center_id', dto.centerId);

    if (countError) {
      throw new NotFoundException(countError.message);
    }

    if ((count ?? 0) >= Number(center.max_managers ?? 0)) {
      throw new ConflictException('Shelter assignment capacity reached for this center');
    }

    const { data, error } = await supabase
      .from('shelter_assignments')
      .insert({
        center_id: dto.centerId,
        manager_id: dto.managerId,
      })
      .select('id, center_id, manager_id, assigned_at, updated_at')
      .single();

    if (error) {
      throw new ConflictException(error.message);
    }

    return data;
  }

  async deleteAssignment(managerId: string): Promise<void> {
    const supabase = this.supabaseService.getClient() as any;
    const { error } = await supabase.from('shelter_assignments').delete().eq('manager_id', managerId);
    if (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findPersonaPhaseControls(regionId?: string) {
    const supabase = this.supabaseService.getClient() as any;
    let query = supabase
      .from('region_persona_phase_controls')
      .select('id, region_id, persona_role, phase, visible_to_assigned_users, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (regionId) {
      query = query.eq('region_id', regionId);
    }

    const { data, error } = await query;
    if (error) {
      throw new NotFoundException(error.message);
    }

    return ((data ?? []) as RegionPersonaPhaseControlRow[]).map((control) => ({
      id: control.id,
      regionId: control.region_id,
      personaRole: control.persona_role,
      phase: control.phase,
      visibleToAssignedUsers: control.visible_to_assigned_users,
      createdAt: control.created_at,
      updatedAt: control.updated_at,
    }));
  }

  async upsertPersonaPhaseControl(regionId: string, dto: UpsertRegionPersonaPhaseDto) {
    const supabase = this.supabaseService.getClient() as any;

    const { data: region, error: regionError } = await supabase
      .from('regions')
      .select('id, name')
      .eq('id', regionId)
      .maybeSingle();

    if (regionError || !region) {
      throw new NotFoundException(`Region with ID ${regionId} not found`);
    }

    const { data, error } = await supabase
      .from('region_persona_phase_controls')
      .upsert(
        {
          region_id: regionId,
          persona_role: dto.personaRole,
          phase: dto.phase,
          visible_to_assigned_users: dto.visibleToAssignedUsers ?? true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'region_id,persona_role' },
      )
      .select('id, region_id, persona_role, phase, visible_to_assigned_users, created_at, updated_at')
      .single();

    if (error || !data) {
      throw new ConflictException(error?.message ?? 'Failed to save regional phase control');
    }

    const audience = await this.findPersonaPhaseAudience(regionId, dto.personaRole);

    return {
      region: {
        id: region.id,
        name: region.name,
      },
      control: {
        id: data.id,
        regionId: data.region_id,
        personaRole: data.persona_role,
        phase: data.phase,
        visibleToAssignedUsers: data.visible_to_assigned_users,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
      audience,
    };
  }

  async findPersonaPhaseAudience(regionId: string, personaRole?: AppRole) {
    const supabase = this.supabaseService.getClient() as any;
    let query = supabase
      .from('user_profiles')
      .select('auth_user_id, first_name, last_name, role, assigned_region_id')
      .eq('assigned_region_id', regionId)
      .order('first_name', { ascending: true });

    if (personaRole) {
      query = query.eq('role', personaRole);
    }

    const { data, error } = await query;
    if (error) {
      throw new NotFoundException(error.message);
    }

    return ((data ?? []) as RegionPersonaAudienceRow[]).map((profile) => ({
      authUserId: profile.auth_user_id,
      name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || profile.auth_user_id,
      role: profile.role,
      assignedRegionId: profile.assigned_region_id,
    }));
  }

  async getAllRegionsGeo() {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase.rpc('get_all_regions_geojson');
    if (error) throw new NotFoundException(error.message);
    return (data ?? []).map((r: any) => ({ id: r.id, name: r.name, geojson: r.geojson }));
  }

  async getRegionGeo(regionId: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase.rpc('get_region_boundary_geojson', { p_region_id: regionId });
    if (error) throw new NotFoundException(error.message);
    const geojsonText = Array.isArray(data) ? data[0] : data;
    try {
      return geojsonText ? JSON.parse(geojsonText) : null;
    } catch {
      return null;
    }
  }

  async getRegionShelters(regionId: string) {
    const supabase = this.supabaseService.getClient() as any;
    const { data, error } = await supabase
      .from('admin_sample_shelters')
      .select('id, name, lat, lng')
      .eq('region_id', regionId)
      .order('created_at', { ascending: true });

    if (error) throw new NotFoundException(error.message);
    return (data ?? []).map((s: any) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng }));
  }
}
