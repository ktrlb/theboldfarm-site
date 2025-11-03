import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { goats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    const [updatedGoat] = await db
      .update(goats)
      .set({ ...body, updated_at: new Date() })
      .where(eq(goats.id, parseInt(id)))
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
    await db.delete(goats).where(eq(goats.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goat:', error);
    return NextResponse.json(
      { error: 'Failed to delete goat' },
      { status: 500 }
    );
  }
}

