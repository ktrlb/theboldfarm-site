import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { pastureRestPeriods } from '@/lib/db/schema';
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

    const allRestPeriods = await db
      .select()
      .from(pastureRestPeriods)
      .orderBy(desc(pastureRestPeriods.start_date));
    
    return NextResponse.json(allRestPeriods || []);
  } catch (error) {
    console.error('Error fetching rest periods:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If table doesn't exist, return empty array
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      console.warn('Rest periods table does not exist yet, returning empty array');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch rest periods', details: errorMessage },
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
    const [newRestPeriod] = await db.insert(pastureRestPeriods).values(body).returning();
    
    return NextResponse.json(newRestPeriod);
  } catch (error) {
    console.error('Error creating rest period:', error);
    return NextResponse.json(
      { error: 'Failed to create rest period' },
      { status: 500 }
    );
  }
}

