import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { animals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Backwards compatibility route - filters animals by animal_type = 'Goat'
export async function GET() {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    // Fetch only goats from the animals table
    const allGoats = await db
      .select()
      .from(animals)
      .where(eq(animals.animal_type, 'Goat'));
    
    return NextResponse.json(allGoats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching goats:', message);
    return NextResponse.json({ error: 'Failed to fetch goats', details: message }, { status: 500 });
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
    // Ensure animal_type is set to 'Goat' for backwards compatibility
    const goatData = { ...body, animal_type: 'Goat' };
    const [newGoat] = await db.insert(animals).values(goatData).returning();
    
    return NextResponse.json(newGoat);
  } catch (error) {
    console.error('Error creating goat:', error);
    return NextResponse.json(
      { error: 'Failed to create goat', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


