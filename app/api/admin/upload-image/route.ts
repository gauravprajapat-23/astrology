import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a service role client for admin operations
const getServiceRoleClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL configuration');
  }
  
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing Supabase SERVICE_ROLE_KEY. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables. This is required for admin operations.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Function to verify if a user has admin permissions
const hasAdminPermissions = async (userId: string) => {
  const adminClient = getServiceRoleClient();
  
  const { data: staffData, error } = await adminClient
    .from('staff_members')
    .select('id, is_active, staff_roles')
    .eq('id', userId)
    .single();

  if (error || !staffData || !staffData.is_active) {
    return false;
  }

  // Extract permissions from the role
  const roleData = staffData.staff_roles as any;
  const permissions = Array.isArray(roleData?.permissions) ? roleData.permissions : [];
  return permissions.includes('admin') || permissions.includes('content_management') || permissions.includes('staff_management');
};

export async function POST(request: NextRequest) {
  try {
    // Get the access token from header or cookie
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const cookieStore = cookies();
    const cookieAccessToken = cookieStore.get('sb-access-token')?.value;
    const accessToken = bearerToken || cookieAccessToken;
    
    if (!accessToken) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Create a temporary client to get user info using the access token
    const tempClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get user info
    const { data: { user }, error: userError } = await tempClient.auth.getUser(accessToken);
    
    if (userError || !user) {
      return Response.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify if the user has admin permissions
    const isAdmin = await hasAdminPermissions(user.id);
    if (!isAdmin) {
      return Response.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Process the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucketName = formData.get('bucket') as string | null;
    const folderPath = formData.get('folder') as string | null;

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!bucketName) {
      return Response.json(
        { error: 'No bucket name provided' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Generate filename with timestamp and extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folderPath ? folderPath + '/' : ''}${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    // Upload to Supabase storage
    const adminClient = getServiceRoleClient();
    const { data, error: uploadError } = await adminClient
      .storage
      .from(bucketName)
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('Bucket not found')) {
        return Response.json(
          { error: 'Storage bucket not found. Please create the "' + bucketName + '" bucket in Supabase dashboard first.' },
          { status: 400 }
        );
      }
      
      return Response.json(
        { error: uploadError.message || 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return Response.json({
      success: true,
      url: publicUrl,
      path: fileName
    });

  } catch (error: any) {
    console.error('Image upload error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
