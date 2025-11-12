import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { imageAlbums } from '@/lib/db/schema';

export async function GET() {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const allAlbums = await db.select().from(imageAlbums);
    
    return NextResponse.json(allAlbums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Album name is required' },
        { status: 400 }
      );
    }

    // Set defaults
    if (!body.images) {
      body.images = [];
    }
    if (!body.description) {
      body.description = null;
    }

    const [newAlbum] = await db.insert(imageAlbums).values({
      name: body.name.trim(),
      description: body.description?.trim() || null,
      images: body.images || [],
    }).returning();
    
    return NextResponse.json(newAlbum);
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
