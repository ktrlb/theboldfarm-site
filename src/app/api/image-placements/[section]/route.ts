import { NextResponse } from 'next/server';
import { getImageForSection } from '@/lib/image-placements';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const imageUrl = await getImageForSection(section);
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching image placement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image placement', imageUrl: null },
      { status: 500 }
    );
  }
}

