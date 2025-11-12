import { NextResponse } from 'next/server';
import { getImageForSection } from '@/lib/image-placements';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    console.log(`[API /image-placements/${section}] Fetching image for section: ${section}`);
    
    const imageUrl = await getImageForSection(section);
    
    console.log(`[API /image-placements/${section}] Found image: ${imageUrl ? 'yes' : 'no'}`);
    
    return NextResponse.json({ imageUrl: imageUrl || null });
  } catch (error) {
    console.error(`[API /image-placements/${section}] Error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch image placement', imageUrl: null },
      { status: 500 }
    );
  }
}

