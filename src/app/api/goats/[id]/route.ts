import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { animals } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Ensure animal_type remains 'Goat' for backwards compatibility
    const updateData = { ...body, animal_type: 'Goat', updated_at: new Date() };

    const [updatedGoat] = await db
      .update(animals)
      .set(updateData)
      .where(and(
        eq(animals.id, parseInt(id)),
        eq(animals.animal_type, 'Goat')
      ))
      .returning();
    
    return NextResponse.json(updatedGoat);
  } catch (error) {
    console.error('Error updating goat:', error);
    return NextResponse.json(
      { error: 'Failed to update goat' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const { id } = await params;
    // Only delete if it's a goat (backwards compatibility)
    await db
      .delete(animals)
      .where(and(
        eq(animals.id, parseInt(id)),
        eq(animals.animal_type, 'Goat')
      ));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goat:', error);
    return NextResponse.json(
      { error: 'Failed to delete goat' },
      { status: 500 }
    );
  }
}

