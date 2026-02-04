import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY not set. Set SUPABASE_SERVICE_ROLE_KEY in .env.local and restart.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data, error } = await supabase
      .from('staff_members')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        role_id,
        avatar_url,
        is_active,
        last_login,
        created_at,
        updated_at,
        role:staff_roles(id, name_en, name_hi, description_en, description_hi, permissions, is_active)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      const devDetail = process.env.NODE_ENV !== 'production' ? { detail: error } : {};
      return NextResponse.json({ error: error.message || 'Failed to fetch staff list', ...devDetail }, { status: 500 });
    }

    // Normalize role arrays to single object for convenience
    const normalized = (data || []).map((m: any) => {
      const role = Array.isArray(m.role) ? m.role[0] : m.role;
      return { ...m, role, role_id: m.role_id || (role?.id ?? null) };
    });

    return NextResponse.json({ staff: normalized });
  } catch (err: any) {
    console.error('Staff list lookup error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
