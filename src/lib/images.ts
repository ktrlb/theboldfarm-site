import { getDbInstance } from '@/lib/db/client';
import { imageAlbums } from '@/lib/db/schema';

export interface AlbumImage {
  id: number;
  name: string;
  description: string | null;
  images: string[];
}

/**
 * Fetch all albums from the database
 * Returns empty array if database is not available or on error
 */
export async function getAllAlbums(): Promise<AlbumImage[]> {
  try {
    const db = getDbInstance();
    if (!db) {
      return [];
    }

    const albums = await db.select().from(imageAlbums);
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

/**
 * Fetch a specific album by name
 * Returns null if not found
 */
export async function getAlbumByName(name: string): Promise<AlbumImage | null> {
  try {
    const db = getDbInstance();
    if (!db) {
      return null;
    }

    const albums = await db.select().from(imageAlbums);
    const album = albums.find(a => a.name.toLowerCase() === name.toLowerCase());
    return album || null;
  } catch (error) {
    console.error('Error fetching album:', error);
    return null;
  }
}

/**
 * Get images from a specific album by name
 * Returns empty array if album not found or no images
 */
export async function getImagesFromAlbum(albumName: string): Promise<string[]> {
  const album = await getAlbumByName(albumName);
  return album?.images || [];
}

/**
 * Get a random image from a specific album
 * Returns null if no images available
 */
export async function getRandomImageFromAlbum(albumName: string): Promise<string | null> {
  const images = await getImagesFromAlbum(albumName);
  if (images.length === 0) {
    return null;
  }
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get images from multiple albums
 * Returns a flat array of all images from the specified albums
 * Uses flexible matching: exact match, contains match, or any album with images as fallback
 */
export async function getImagesFromAlbums(albumNames: string[]): Promise<string[]> {
  try {
    const db = getDbInstance();
    if (!db) {
      console.log('[getImagesFromAlbums] Database not available');
      return [];
    }

    const allAlbums = await db.select().from(imageAlbums);
    console.log(`[getImagesFromAlbums] Found ${allAlbums.length} albums in database:`, allAlbums.map(a => `${a.name} (${a.images?.length || 0} images)`));
    
    const allImages: string[] = [];
    const lowerAlbumNames = albumNames.map(n => n.toLowerCase().trim()).filter(n => n.length > 0);
    
    // If no specific album names provided, return empty array (don't use any album)
    // This prevents the same image from appearing everywhere
    if (lowerAlbumNames.length === 0) {
      console.log('[getImagesFromAlbums] No album names provided, returning empty array');
      return [];
    }
    
    {
      // Try to find albums by flexible matching (exact or contains)
      const matchedAlbums = new Set<number>(); // Track which albums we've already added
      
      for (const album of allAlbums) {
        if (!album.images || album.images.length === 0) continue;
        
        const albumNameLower = album.name.toLowerCase();
        let isMatch = false;
        
        // Check for exact match
        if (lowerAlbumNames.includes(albumNameLower)) {
          isMatch = true;
        } else {
          // Check if any search term is contained in the album name, or vice versa
          for (const searchTerm of lowerAlbumNames) {
            if (albumNameLower.includes(searchTerm) || searchTerm.includes(albumNameLower)) {
              isMatch = true;
              break;
            }
          }
        }
        
        if (isMatch && !matchedAlbums.has(album.id)) {
          console.log(`[getImagesFromAlbums] Matched album "${album.name}" (search terms: ${albumNames.join(', ')})`);
          allImages.push(...album.images);
          matchedAlbums.add(album.id);
        }
      }
      
      // If no matches found, return empty array (don't use any album as fallback)
      // This prevents the same image from appearing everywhere
      if (allImages.length === 0) {
        console.log('[getImagesFromAlbums] No matches found for albums:', albumNames.join(', '), '- returning empty array');
      }
    }
    
    console.log(`[getImagesFromAlbums] Returning ${allImages.length} total images`);
    return allImages;
  } catch (error) {
    console.error('[getImagesFromAlbums] Error:', error);
    return [];
  }
}
