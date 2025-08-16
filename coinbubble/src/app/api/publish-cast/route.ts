import { NextResponse } from 'next/server';
import { getNeynarClient } from '@/lib/neynar';

export async function POST(request: Request) {
  try {
    const { signerUuid, text } = await request.json();
    
    if (!signerUuid || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = getNeynarClient();
    const result = await client.publishCast({
      signerUuid,
      text
    });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error publishing cast:', error);
    return NextResponse.json(
      { error: 'Failed to publish cast' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
