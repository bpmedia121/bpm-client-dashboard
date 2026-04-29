import { NextResponse } from 'next/server';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function POST(req) {
  try {
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return NextResponse.json({ 
        error: 'Cloudflare not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env.local',
        configured: false 
      }, { status: 503 });
    }

    const { video_id, file_size_bytes } = await req.json();

    // Get one-time upload URL from Cloudflare
    const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/direct_upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxDurationSeconds: 3600,
        meta: { video_id: video_id || 'unknown' },
      }),
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      return NextResponse.json({ error: cfData.errors || 'Cloudflare error' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      uploadURL: cfData.result.uploadURL,
      uid: cfData.result.uid,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
      return NextResponse.json({ error: 'Cloudflare not configured' }, { status: 503 });
    }

    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: 'UID required' }, { status: 400 });

    const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
      },
    });

    if (!cfRes.ok) {
      const data = await cfRes.json();
      return NextResponse.json({ error: data.errors || 'Cloudflare delete failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}