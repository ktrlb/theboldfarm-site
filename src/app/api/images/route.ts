import { NextResponse } from 'next/server';
import { getImagesFromAlbums } from '@/lib/images';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Support both 'albums' and 'albumNames' parameters for backwards compatibility
    // Use getAll to handle multiple parameters with the same name
    const albumNamesArray = searchParams.getAll('albums').concat(searchParams.getAll('albumNames'));
    // Also support comma-separated values in a single parameter
    const albumNamesParam = searchParams.get('albums') || searchParams.get('albumNames');
    const albumNamesFromParam = albumNamesParam ? albumNamesParam.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    // Combine all sources and deduplicate
    const albumNames = [...new Set([...albumNamesArray, ...albumNamesFromParam].map(s => s.trim()).filter(s => s.length > 0))];
    
    console.log(`[API /images] Requested albums: ${albumNames.join(', ') || '(none - will return empty)'}`);
    
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
