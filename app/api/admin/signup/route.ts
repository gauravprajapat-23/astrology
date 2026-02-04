import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create a Supabase client with service role key (full access)
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // For enhanced security, we can implement different authorization mechanisms:
    // Option 1: Check for an admin creation token in headers
    const adminCreationToken = request.headers.get('X-Admin-Creation-Token');
    const envToken = process.env.ADMIN_CREATION_TOKEN;
    
    // If environment token is set, require it in the request
    if (envToken && adminCreationToken !== envToken) {
      return Response.json(
        { error: 'Unauthorized: Invalid admin creation token' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { firstName, lastName, email, password } = body;
    let role_id: string | undefined = body.role_id;

    // If role_id not provided, attempt to default to the Administrator role
    if (!role_id) {
      const { data: adminRoleData, error: adminRoleError } = await supabase
        .from('staff_roles')
        .select('id')
        .eq('name_en', 'Administrator')
        .limit(1);
      if (adminRoleError) {
        console.error('Failed to fetch Administrator role:', adminRoleError);
      }
      if (adminRoleData && (adminRoleData as any[]).length > 0) {
        role_id = (adminRoleData as any[])[0].id;
      }
    }

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role_id only if provided. If we couldn't look up the Administrator
    // role because the service key is missing/invalid, allow creating the user
    // without a role (role_id = null) so setup can continue in dev environments.
    if (role_id) {
      const { data: validRole, error: roleError } = await supabase
        .from('staff_roles')
        .select('id')
        .eq('id', role_id)
        .limit(1);

      if (roleError || !validRole || (validRole as any[]).length === 0) {
        return Response.json(
          { error: 'Invalid role specified' },
          { status: 400 }
        );
      }
    } else {
      // role_id not provided; proceed and insert null role (caller may rely on defaults)
      role_id = null as unknown as string;
    }

    // Check if user already exists in staff_members table
    const { data: existingStaff, error: staffCheckError } = await supabase
      .from('staff_members')
      .select('id')
      .eq('email', email)
      .single();

    if (existingStaff) {
      return Response.json(
        { error: 'User with this email already exists in staff database' },
        { status: 409 }
      );
    }

    // Hash password for local staff record (Supabase Auth also stores a hashed password)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      if (authError.message && authError.message.includes('User already registered')) {
        return Response.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      const devDetail = process.env.NODE_ENV !== 'production' ? { detail: authError } : {};
      return Response.json(
        { error: authError.message || 'Failed to create user', ...devDetail },
        { status: 400 }
      );
    }

    if (!authData?.user) {
      return Response.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Insert user into staff_members table (store password hash for legacy/lookup needs)
    const { data: staffInsertData, error: staffError } = await supabase
      .from('staff_members')
      .insert([{
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        role_id: role_id || null,
        password_hash: passwordHash,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('id, email')
      .maybeSingle();

    if (staffError) {
      // Rollback: delete the user from auth if staff insertion fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (delErr) {
        console.error('Failed to rollback auth user after staff insert failure:', delErr);
      }
      const devDetail = process.env.NODE_ENV !== 'production' ? { detail: staffError } : {};
      return Response.json(
        { error: staffError.message || 'Failed to create staff record', ...devDetail },
        { status: 500 }
      );
    }

    // Return success response including created staff id/email for debugging
    return Response.json({
      message: 'Admin account created successfully',
      staff: staffInsertData || { id: authData.user.id, email }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}