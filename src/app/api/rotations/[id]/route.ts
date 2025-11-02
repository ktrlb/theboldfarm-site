import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { grazingRotations } from '@/lib/db/schema';
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
    const [updatedRotation] = await db
      .update(grazingRotations)
      .set({ ...body, updated_at: new Date() })
      .where(eq(grazingRotations.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updatedRotation);
  } catch (error) {
    console.error('Error updating rotation:', error);
    return NextResponse.json(
      { error: 'Failed to update rotation' },
      { status: 500 }
    );
  }
}

