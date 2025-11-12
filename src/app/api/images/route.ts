import { NextResponse } from 'next/server';
import { getImagesFromAlbums } from '@/lib/images';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumNamesParam = searchParams.get('albums');
    const albumNames = albumNamesParam ? albumNamesParam.split(',').map(s => s.trim()) : [];
    
    console.log(`[API /images] Requested albums: ${albumNames.join(', ')}`);
    
    const images = await getImagesFromAlbums(albumNames);
    
    console.log(`[API /images] Returning ${images.length} images`);
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('[API /images] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', images: [] },
      { status: 500 }
    );
  }
}
