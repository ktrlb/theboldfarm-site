import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { imagePlacements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageSection = searchParams.get('page_section');

    if (pageSection) {
      // Get placements for a specific page section, ordered by priority
      const placements = await db
        .select()
        .from(imagePlacements)
        .where(eq(imagePlacements.page_section, pageSection))
        .orderBy(desc(imagePlacements.priority));
      
      return NextResponse.json(placements);
    }

    // Get all placements
    const allPlacements = await db
      .select()
      .from(imagePlacements)
      .orderBy(desc(imagePlacements.priority));
    
    return NextResponse.json(allPlacements);
  } catch (error) {
    console.error('Error fetching image placements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image placements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { page_section, image_url, priority = 0, description } = body;

    if (!page_section || !image_url) {
      return NextResponse.json(
        { error: 'page_section and image_url are required' },
        { status: 400 }
      );
    }

    // Check if placement already exists for this section
    const existing = await db
      .select()
      .from(imagePlacements)
      .where(eq(imagePlacements.page_section, page_section))
      .limit(1);

    let result;
    if (existing.length > 0) {
      // Update existing placement
      [result] = await db
        .update(imagePlacements)
        .set({
          image_url,
          priority,
          description,
          updated_at: new Date(),
        })
        .where(eq(imagePlacements.page_section, page_section))
        .returning();
    } else {
      // Create new placement
      [result] = await db
        .insert(imagePlacements)
        .values({
          page_section,
          image_url,
          priority,
          description,
        })
        .returning();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating/updating image placement:', error);
    return NextResponse.json(
      { error: 'Failed to create/update image placement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const pageSection = searchParams.get('page_section');

    if (id) {
      await db.delete(imagePlacements).where(eq(imagePlacements.id, parseInt(id)));
    } else if (pageSection) {
      await db.delete(imagePlacements).where(eq(imagePlacements.page_section, pageSection));
    } else {
      return NextResponse.json(
        { error: 'id or page_section is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image placement:', error);
    return NextResponse.json(
      { error: 'Failed to delete image placement' },
      { status: 500 }
    );
  }
}

