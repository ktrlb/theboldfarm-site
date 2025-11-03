import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { grazingRotations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const allRotations = await db
      .select()
      .from(grazingRotations)
      .orderBy(desc(grazingRotations.start_date));
    
    return NextResponse.json(allRotations || []);
  } catch (error) {
    console.error('Error fetching rotations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If table doesn't exist, return empty array
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      console.warn('Rotations table does not exist yet, returning empty array');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch rotations', details: errorMessage },
      { status: 500 }
    );
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
    const [newRotation] = await db.insert(grazingRotations).values(body).returning();
    
    return NextResponse.json(newRotation);
  } catch (error) {
    console.error('Error creating rotation:', error);
    return NextResponse.json(
      { error: 'Failed to create rotation' },
      { status: 500 }
    );
  }
}

