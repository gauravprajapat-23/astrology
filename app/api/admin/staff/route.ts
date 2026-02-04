import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY not set. Set SUPABASE_SERVICE_ROLE_KEY in .env.local and restart.' }, { status: 500 });
    }

    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data, error } = await supabase
      .from('staff_members')
      .select(`id, first_name, last_name, email, is_active, role:staff_roles(name_en, name_hi, permissions)`)
      .eq('email', email)
      .maybeSingle();

    if (error) {
      const devDetail = process.env.NODE_ENV !== 'production' ? { detail: error } : {};
      return NextResponse.json({ error: error.message || 'Failed to fetch staff', ...devDetail }, { status: 500 });
    }

    if (!data) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    return NextResponse.json({ staff: data });
  } catch (err: any) {
    console.error('Staff lookup error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
