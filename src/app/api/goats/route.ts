import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { goats } from '@/lib/db/schema';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const allGoats = await db.select().from(goats);
    
    return NextResponse.json(allGoats);
  } catch (error) {
    console.error('Error fetching goats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goats' },
      { status: 500 }
    );
  }
}


