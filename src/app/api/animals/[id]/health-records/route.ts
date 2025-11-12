import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { animalHealthRecords } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const records = await db
      .select()
      .from(animalHealthRecords)
      .where(eq(animalHealthRecords.animal_id, parseInt(id)))
      .orderBy(desc(animalHealthRecords.record_date));

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health records' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const [newRecord] = await db
      .insert(animalHealthRecords)
      .values({
        ...body,
        animal_id: parseInt(id),
      })
      .returning();

    return NextResponse.json(newRecord);
  } catch (error) {
    console.error('Error creating health record:', error);
    return NextResponse.json(
      { error: 'Failed to create health record' },
      { status: 500 }
    );
  }
}

