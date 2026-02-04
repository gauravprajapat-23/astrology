import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const defaultRoles = [
  {
    id: 'default-admin',
    name_en: 'Administrator',
    name_hi: 'प्रबंधक',
    description_en: 'Full administrative access',
    description_hi: 'पूर्ण प्रशासनिक पहुंच',
    permissions: ['admin', 'staff_management', 'site_settings', 'content_management'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'default-editor',
    name_en: 'Editor',
    name_hi: 'संपादक',
    description_en: 'Content management access',
    description_hi: 'सामग्री प्रबंधन पहुंच',
    permissions: ['content_management', 'testimonials'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      // Return fallback roles when server config isn't available
      return new Response(JSON.stringify(defaultRoles), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await supabase
      .from('staff_roles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching staff_roles (server):', error);
      // If the error indicates invalid API key or other auth issue, return fallback roles
      const msg = (error && (error as any).message) || '';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('api key')) {
        return new Response(JSON.stringify(defaultRoles), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ error: 'Failed to fetch roles' }), { status: 500 });
    }

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Unexpected error in /api/admin/roles:', err);
    // On unexpected errors (including invalid service key), return fallback roles so UI remains usable
    return new Response(JSON.stringify(defaultRoles), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
