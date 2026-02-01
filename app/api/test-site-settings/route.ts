import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration missing');
    return NextResponse.json({ 
      success: false, 
      error: 'Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.',
      details: 'Environment variables not configured'
    }, { status: 500 });
  }
  
  // Create Supabase client inside the function to avoid build-time issues
  const supabase = createClient(
    supabaseUrl,
    supabaseKey
  );
  try {
    console.log('Testing site settings fetch...');
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Site settings error:', error);
      // Check if the error is specifically about the table not existing
      if (error.message?.includes('does not exist')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Site settings table does not exist. Please run database migrations.',
          details: error,
          table_exists: false
        }, { status: 500 });
      }
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error,
        table_exists: true
      }, { status: 500 });
    }

    console.log('Site settings data:', data);
    return NextResponse.json({ 
      success: true, 
      data: data,
      count: data?.length || 0
    });

  } catch (error: any) {
    console.error('Site settings fetch failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
