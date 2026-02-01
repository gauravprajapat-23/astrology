import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // Create Supabase client inside the function to avoid build-time issues
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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