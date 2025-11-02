import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { imageAlbums } from '@/lib/db/schema';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
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
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const [newAlbum] = await db.insert(imageAlbums).values(body).returning();
    
    return NextResponse.json(newAlbum);
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
