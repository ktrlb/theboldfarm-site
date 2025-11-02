import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { pastureRestPeriods } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const allRestPeriods = await db
      .select()
      .from(pastureRestPeriods)
      .orderBy(desc(pastureRestPeriods.start_date));
    
    return NextResponse.json(allRestPeriods);
  } catch (error) {
    console.error('Error fetching rest periods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rest periods' },
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

