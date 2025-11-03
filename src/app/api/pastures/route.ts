import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { pastures } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const allPastures = await db.select().from(pastures).orderBy(asc(pastures.name));
    
    return NextResponse.json(allPastures || []);
  } catch (error) {
    console.error('Error fetching pastures:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If table doesn't exist, return empty array instead of error
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      console.warn('Pastures table does not exist yet, returning empty array');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch pastures', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const [newPasture] = await db.insert(pastures).values(body).returning();
    
    return NextResponse.json(newPasture);
  } catch (error) {
    console.error('Error creating pasture:', error);
    return NextResponse.json(
      { error: 'Failed to create pasture' },
      { status: 500 }
    );
  }
}

