import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/db/client';
import { animals } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const db = getDbInstance();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured. Missing NEON_POSTGRES_DATABASE_URL or POSTGRES_URL' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const animalType = searchParams.get('animal_type');
    const isForSale = searchParams.get('is_for_sale');

    // Apply filters if provided
    const conditions = [];
    if (animalType) {
      conditions.push(eq(animals.animal_type, animalType));
    }
    if (isForSale !== null) {
      conditions.push(eq(animals.is_for_sale, isForSale === 'true'));
    }

    // Build query conditionally
    const allAnimals = conditions.length > 0
      ? await db.select().from(animals).where(and(...conditions))
      : await db.select().from(animals);
    
    return NextResponse.json(allAnimals);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching animals:', message);
    return NextResponse.json({ error: 'Failed to fetch animals', details: message }, { status: 500 });
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
    if (!body.name || !body.animal_type) {
      return NextResponse.json(
        { error: 'Name and animal_type are required fields' },
        { status: 400 }
      );
    }
    
    // Set type default if not provided or empty
    if (!body.type || body.type.trim() === '') {
      body.type = body.animal_type; // Default to animal_type if no subtype provided
    }
    
    // Set defaults if not provided
    if (!body.status) {
      body.status = 'Active';
    }
    if (!body.bio) {
      body.bio = '';
    }
    if (!body.birth_type) {
      body.birth_type = 'exact';
    }
    if (body.price === undefined || body.price === null) {
      body.price = '0';
    }
    if (body.is_for_sale === undefined) {
      body.is_for_sale = false;
    }
    if (body.registered === undefined) {
      body.registered = false;
    }
    if (!body.photos) {
      body.photos = [];
    }
    
    const [newAnimal] = await db.insert(animals).values(body).returning();
    
    return NextResponse.json(newAnimal);
  } catch (error) {
    console.error('Error creating animal:', error);
    return NextResponse.json(
      { error: 'Failed to create animal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

