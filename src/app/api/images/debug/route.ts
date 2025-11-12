import { NextResponse } from 'next/server';
import { getAllAlbums } from '@/lib/images';

export async function GET() {
  try {
    const albums = await getAllAlbums();
    
    const debugInfo = {
      totalAlbums: albums.length,
      albums: albums.map(album => ({
        id: album.id,
        name: album.name,
        imageCount: album.images?.length || 0,
        hasImages: (album.images?.length || 0) > 0,
        firstImage: album.images && album.images.length > 0 ? album.images[0] : null
      }))
    };
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug info', errorMessage: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

