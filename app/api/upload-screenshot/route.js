import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const video_id = formData.get('video_id');
    const user_id = formData.get('user_id');

    if (!file || !video_id) {
      return NextResponse.json({ error: 'Missing file or video_id' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload to Supabase Storage
    const fileName = `${video_id}/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('comment-screenshots')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('comment-screenshots')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: fileName,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}