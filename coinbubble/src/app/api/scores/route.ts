import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

export async function GET() {
  if (!kv) {
    return NextResponse.json({ items: [] });
  }
  try {
    const rows = await kv.zrange('leaderboard:all', 0, 19, { withScores: true, rev: true }) as any[];
    const items: any[] = [];
    for (let i = 0; i < rows.length; i += 2) {
      const fid = rows[i];
      const score = Number(rows[i+1]);
      const u = await kv.hgetall(`user:${fid}`) as any;
      items.push({ fid, username: u?.username || String(fid), score });
    }
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!kv) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  try {
    const { fid, username, score, pops, livesUsed } = await req.json();
    const s = Number(score || 0);
    const kUser = `user:${fid}`;
    const prev = await kv.hget(kUser, 'high');
    const high = Math.max(Number(prev||0), s);
    await kv.hset(kUser, { username, high, updatedAt: Date.now() });
    await kv.zadd('leaderboard:all', { score: high, member: String(fid) });
    const histKey = `history:${fid}`;
    await kv.lpush(histKey, JSON.stringify({ score: s, pops, livesUsed, ts: Date.now() }));
    await kv.ltrim(histKey, 0, 49);
    return NextResponse.json({ ok: true, high });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
