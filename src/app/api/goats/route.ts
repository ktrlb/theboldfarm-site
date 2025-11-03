import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { goats } from '@/lib/db/schema';

export async function GET() {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const allGoats = await db.select().from(goats);
    
    return NextResponse.json(allGoats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching goats:', message);
    return NextResponse.json({ error: 'Failed to fetch goats', details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const [newGoat] = await db.insert(goats).values(body).returning();
    
    return NextResponse.json(newGoat);
  } catch (error) {
    console.error('Error creating goat:', error);
    return NextResponse.json(
      { error: 'Failed to create goat' },
      { status: 500 }
    );
  }
}


