import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { animals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    const [animal] = await db
      .select()
      .from(animals)
      .where(eq(animals.id, parseInt(id)))
      .limit(1);

    if (!animal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(animal);
  } catch (error) {
    console.error('Error fetching animal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch animal' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const [updatedAnimal] = await db
      .update(animals)
      .set({ ...body, updated_at: new Date() })
      .where(eq(animals.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedAnimal);
  } catch (error) {
    console.error('Error updating animal:', error);
    return NextResponse.json(
      { error: 'Failed to update animal' },
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
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    await db.delete(animals).where(eq(animals.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting animal:', error);
    return NextResponse.json(
      { error: 'Failed to delete animal' },
      { status: 500 }
    );
  }
}

