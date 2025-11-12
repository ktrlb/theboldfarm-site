import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { grazingRotations, pastures } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

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
    const animalId = parseInt(id);

    // Get all grazing rotations where this animal is in the animal_ids array
    const rotations = await db
      .select({
        id: grazingRotations.id,
        pasture_id: grazingRotations.pasture_id,
        pasture_name: pastures.name,
        start_date: grazingRotations.start_date,
        end_date: grazingRotations.end_date,
        is_current: grazingRotations.is_current,
        animal_type: grazingRotations.animal_type,
        animal_count: grazingRotations.animal_count,
        grazing_pressure: grazingRotations.grazing_pressure,
        pasture_quality_start: grazingRotations.pasture_quality_start,
        pasture_quality_end: grazingRotations.pasture_quality_end,
        notes: grazingRotations.notes,
        created_at: grazingRotations.created_at,
      })
      .from(grazingRotations)
      .leftJoin(pastures, eq(grazingRotations.pasture_id, pastures.id))
      .where(
        sql`${animalId} = ANY(${grazingRotations.animal_ids})`
      )
      .orderBy(grazingRotations.start_date);

    return NextResponse.json(rotations);
  } catch (error) {
    console.error('Error fetching grazing history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grazing history' },
      { status: 500 }
    );
  }
}

