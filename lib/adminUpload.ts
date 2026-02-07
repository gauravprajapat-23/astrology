import { supabase } from '@/lib/supabase';

type UploadAdminImageArgs = {
  file: File;
  bucket: string;
  folder?: string;
};

export type UploadAdminImageResult = {
  success: true;
  url: string;
  path: string;
};

export const uploadAdminImage = async ({ file, bucket, folder }: UploadAdminImageArgs) => {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = {};

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch('/api/admin/upload-image', {
    method: 'POST',
    headers,
    body: formData,
  });

  let result: Partial<UploadAdminImageResult> & { error?: string } = {};
  try {
    result = await response.json();
  } catch (error) {
    // ignore parse errors; handled below
  }

  if (!response.ok) {
    throw new Error(result.error || 'Failed to upload image');
  }

  return result as UploadAdminImageResult;
};
