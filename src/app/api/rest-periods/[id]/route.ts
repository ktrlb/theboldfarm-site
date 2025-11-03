import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { pastureRestPeriods } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const [updatedRestPeriod] = await db
      .update(pastureRestPeriods)
      .set({ ...body, updated_at: new Date() })
      .where(eq(pastureRestPeriods.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updatedRestPeriod);
  } catch (error) {
    console.error('Error updating rest period:', error);
    return NextResponse.json(
      { error: 'Failed to update rest period' },
      { status: 500 }
    );
  }
}

