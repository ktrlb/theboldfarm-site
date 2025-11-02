import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_OUTPUT_SIZE = 2 * 1024 * 1024; // 2MB max output
const MAX_INPUT_SIZE = 50 * 1024 * 1024; // 50MB max input (reasonable limit)

async function compressImage(buffer: Buffer): Promise<Buffer> {
  let quality = 85;
  let width = 2048; // Start with max width
  
  // Convert to JPEG and resize if needed
  let compressed = buffer;
  
  // If already under 2MB, try simple format conversion first
  if (buffer.length <= MAX_OUTPUT_SIZE) {
    try {
      const result = await sharp(buffer)
        .jpeg({ 
          quality: 90,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();
      
      // If converted version is still under limit, return it
      if (result.length <= MAX_OUTPUT_SIZE) {
        return result;
      }
      // Otherwise, use the converted version as starting point for compression
      compressed = result;
    } catch {
      // If sharp can't process, keep original buffer (shouldn't happen for valid images)
      compressed = buffer;
    }
  }

  // Try to compress iteratively until under 2MB
  for (let attempts = 0; attempts < 5; attempts++) {
    const result = await sharp(compressed)
      .resize(width, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ 
        quality,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    if (result.length <= MAX_OUTPUT_SIZE) {
      return result;
    }

    // Reduce quality and width for next attempt
    quality = Math.max(60, quality - 10); // Don't go below 60% quality
    width = Math.max(800, width - 300);
    compressed = result;
  }

  // Final attempt with more aggressive compression if still too large
  const finalResult = await sharp(compressed)
    .resize(1200, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ 
      quality: 70,
      progressive: true,
      mozjpeg: true,
    })
    .toBuffer();

  // Even if still over 2MB, return it (better than failing)
  return finalResult;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate input file size (max 50MB)
    if (file.size > MAX_INPUT_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum input size is ${MAX_INPUT_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress image if needed
    const compressedBuffer = await compressImage(buffer);
    const finalSize = compressedBuffer.length;

    // Upload to Vercel Blob in goat-images folder
    const fileName = file.name || 'upload';
    const blobPath = `goat-images/${fileName.split('.')[0]}.jpg`; // Always save as JPG after compression
    
    const blob = await put(blobPath, compressedBuffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/jpeg',
    });

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
      originalSize: buffer.length,
      compressedSize: finalSize,
    });
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    
    // Check if it's a size error
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('too large') || errorMessage.includes('413')) {
        return NextResponse.json(
          { error: 'File too large. Please choose a smaller image.' },
          { status: 413 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to remove photos
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    const { del } = await import('@vercel/blob');
    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from Blob:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

