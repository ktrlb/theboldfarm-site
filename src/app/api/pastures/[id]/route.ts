import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { pastures } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const [updatedPasture] = await db
      .update(pastures)
      .set({ ...body, updated_at: new Date() })
      .where(eq(pastures.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updatedPasture);
  } catch (error) {
    console.error('Error updating pasture:', error);
    return NextResponse.json(
      { error: 'Failed to update pasture' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    await db.delete(pastures).where(eq(pastures.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pasture:', error);
    return NextResponse.json(
      { error: 'Failed to delete pasture' },
      { status: 500 }
    );
  }
}

