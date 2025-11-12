import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { gates } from '@/lib/db/schema';

export async function GET() {
  try {
    const db = getDbInstance();
    if (!db) return NextResponse.json([], { status: 200 });
    const all = await db.select().from(gates);
    return NextResponse.json(all || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('does not exist') || message.includes('relation')) return NextResponse.json([]);
    return NextResponse.json({ error: 'Failed to fetch gates', details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    const body = await request.json();
    const [created] = await db.insert(gates).values(body).returning();
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: 'Failed to create gate' }, { status: 500 });
  }
}





