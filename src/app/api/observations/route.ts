import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { pastureObservations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const allObservations = await db
      .select()
      .from(pastureObservations)
      .orderBy(desc(pastureObservations.observation_date));
    
    return NextResponse.json(allObservations || []);
  } catch (error) {
    console.error('Error fetching observations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If table doesn't exist, return empty array
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      console.warn('Observations table does not exist yet, returning empty array');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch observations', details: errorMessage },
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
    const [newObservation] = await db.insert(pastureObservations).values(body).returning();
    
    return NextResponse.json(newObservation);
  } catch (error) {
    console.error('Error creating observation:', error);
    return NextResponse.json(
      { error: 'Failed to create observation' },
      { status: 500 }
    );
  }
}

