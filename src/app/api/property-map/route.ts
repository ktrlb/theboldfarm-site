import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { propertyMap } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const map = await db.select().from(propertyMap).limit(1);
    
    return NextResponse.json(map[0] || null);
  } catch (error) {
    console.error('Error fetching property map:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation')) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch property map', details: errorMessage },
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
    
    // Check if property map already exists
    const existing = await db.select().from(propertyMap).limit(1);
    
    if (existing.length > 0) {
      // Update existing
      const [updated] = await db
        .update(propertyMap)
        .set({ ...body, updated_at: new Date() })
        .where(eq(propertyMap.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    } else {
      // Create new
      const [newMap] = await db.insert(propertyMap).values(body).returning();
      return NextResponse.json(newMap);
    }
  } catch (error) {
    console.error('Error saving property map:', error);
    return NextResponse.json(
      { error: 'Failed to save property map' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const existing = await db.select().from(propertyMap).limit(1);
    
    if (existing.length > 0) {
      const [updated] = await db
        .update(propertyMap)
        .set({ ...body, updated_at: new Date() })
        .where(eq(propertyMap.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    } else {
      // Create if doesn't exist
      const [newMap] = await db.insert(propertyMap).values(body).returning();
      return NextResponse.json(newMap);
    }
  } catch (error) {
    console.error('Error updating property map:', error);
    return NextResponse.json(
      { error: 'Failed to update property map' },
      { status: 500 }
    );
  }
}

