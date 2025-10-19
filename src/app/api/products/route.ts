import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { products } from '@/lib/db/schema';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const allProducts = await db.select().from(products);
    
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}


