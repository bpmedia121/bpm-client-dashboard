import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title } = await request.json();
    
    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const apiKey = process.env.BUNNY_API_KEY;
    
    if (!libraryId || !apiKey) {
      return NextResponse.json({ error: 'Bunny credentials not configured' }, { status: 500 });
    }
    
    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: 'POST',
      headers: {
        'AccessKey': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title || 'Untitled' }),
    });
    
    if (!createRes.ok) {
      const errorText = await createRes.text();
      return NextResponse.json({ error: 'Failed to create video', details: errorText }, { status: 500 });
    }
    
    const videoData = await createRes.json();
    const videoId = videoData.guid;
    
    return NextResponse.json({
      success: true,
      videoId: videoId,
      uploadUrl: `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      apiKey: apiKey,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
    });
    
  } catch (err) {
    console.error('Bunny upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const apiKey = process.env.BUNNY_API_KEY;
    
    const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      method: 'DELETE',
      headers: { 'AccessKey': apiKey },
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}