import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { imageAlbums } from '@/lib/db/schema';
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
    const [updatedAlbum] = await db
      .update(imageAlbums)
      .set({ ...body, updated_at: new Date() })
      .where(eq(imageAlbums.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updatedAlbum);
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json(
      { error: 'Failed to update album' },
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
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    await db.delete(imageAlbums).where(eq(imageAlbums.id, parseInt(id)));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    );
  }
}
