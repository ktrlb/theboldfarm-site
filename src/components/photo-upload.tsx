"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

interface UploadProgress {
  fileName: string;
  status: 'compressing' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [currentProcessing, setCurrentProcessing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log when photos prop changes
  useEffect(() => {
    console.log('PhotoUpload: photos prop changed:', photos.length, photos);
  }, [photos]);

  // Client-side image compression using Canvas API
  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Store original dimensions
          const originalWidth = img.width;
          const originalHeight = img.height;
          
          // Calculate initial dimensions (max 2048px on longest side)
          const MAX_DIMENSION = 2048;
          let currentWidth = originalWidth;
          let currentHeight = originalHeight;
          
          if (currentWidth > currentHeight && currentWidth > MAX_DIMENSION) {
            currentHeight = (currentHeight / currentWidth) * MAX_DIMENSION;
            currentWidth = MAX_DIMENSION;
          } else if (currentHeight > MAX_DIMENSION) {
            currentWidth = (currentWidth / currentHeight) * MAX_DIMENSION;
            currentHeight = MAX_DIMENSION;
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Convert to blob with quality compression
          // Iteratively reduce quality and dimensions until under 4.5MB limit
          const VERCEL_LIMIT = 4.5 * 1024 * 1024; // 4.5MB
          const aspectRatio = originalHeight / originalWidth;
          
          const tryCompress = (quality: number, width: number, height: number): void => {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                // If still too large and we can reduce quality more, try again
                if (blob.size > VERCEL_LIMIT && quality > 0.3) {
                  const newQuality = Math.max(0.3, quality - 0.1);
                  tryCompress(newQuality, width, height);
                } else if (blob.size > VERCEL_LIMIT && width > 800) {
                  // If still too large at minimum quality, reduce dimensions further
                  const newWidth = Math.max(800, Math.floor(width * 0.8));
                  const newHeight = Math.floor(newWidth * aspectRatio);
                  tryCompress(0.5, newWidth, newHeight);
                } else {
                  // Create a new File from the blob
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              quality
            );
          };
          
          // Start with 0.85 quality and initial dimensions
          tryCompress(0.85, currentWidth, currentHeight);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadPhoto = useCallback(async (file: File, progressIndex: number): Promise<string> => {
    // Update progress to show compression
    setUploadProgress(prev => {
      const updated = [...prev];
      updated[progressIndex] = { fileName: file.name, status: 'compressing' };
      return updated;
    });
    setCurrentProcessing(file.name);

    // Compress image on client side before uploading
    // This ensures we stay under Vercel's 4.5MB limit and reduces upload time
    let fileToUpload = file;
    const VERCEL_LIMIT = 4.5 * 1024 * 1024; // 4.5MB
    
    // Always compress images to ensure they're under the limit and optimized
    if (file.type.startsWith('image/')) {
      try {
        const originalSize = (file.size / 1024 / 1024).toFixed(1);
        console.log(`Compressing "${file.name}" (${originalSize}MB) before upload...`);
        fileToUpload = await compressImage(file);
        const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(1);
        console.log(`Compressed to ${compressedSize}MB (${((1 - fileToUpload.size / file.size) * 100).toFixed(0)}% reduction)`);
      } catch (error) {
        const errorMessage = `Failed to compress image: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error('Compression error:', error);
        setUploadProgress(prev => {
          const updated = [...prev];
          updated[progressIndex] = { fileName: file.name, status: 'error', error: errorMessage };
          return updated;
        });
        throw new Error(errorMessage);
      }
    }

    // Final check - if still too large after compression, reject
    if (fileToUpload.size > VERCEL_LIMIT) {
      const errorMessage = `File "${file.name}" is too large even after compression (${(fileToUpload.size / 1024 / 1024).toFixed(1)}MB). Please try a smaller image.`;
      console.error('File still too large after compression:', errorMessage);
      setUploadProgress(prev => {
        const updated = [...prev];
        updated[progressIndex] = { fileName: file.name, status: 'error', error: errorMessage };
        return updated;
      });
      throw new Error(errorMessage);
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);

    // Update progress to show uploading
    setUploadProgress(prev => {
      const updated = [...prev];
      updated[progressIndex] = { fileName: file.name, status: 'uploading' };
      return updated;
    });

    const response = await fetch('/api/upload-photo', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      
      // Handle 413 (Payload Too Large) specifically
      if (response.status === 413) {
        errorMessage = `File "${file.name}" is too large. Vercel has a 4.5MB limit for uploads. Please compress or resize the image before uploading.`;
      } else {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse the response, use status-based message
          if (response.status === 413) {
            errorMessage = `File "${file.name}" is too large. Maximum upload size is 4.5MB.`;
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
      }
      
      console.error('Upload failed:', errorMessage, { status: response.status, fileName: file.name });
      setUploadProgress(prev => {
        const updated = [...prev];
        updated[progressIndex] = { fileName: file.name, status: 'error', error: errorMessage };
        return updated;
      });
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const url = data.url;
    
    if (!url) {
      console.error('No URL returned from upload:', data);
      throw new Error('No URL returned from upload');
    }
    
    console.log('Upload successful:', url);
    
    // Mark as complete
    setUploadProgress(prev => {
      const updated = [...prev];
      updated[progressIndex] = { fileName: file.name, status: 'complete' };
      return updated;
    });
    
    return url;
  }, []);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    console.log('handleFiles called with:', files);
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    console.log('Filtered image files:', imageFiles.length, imageFiles.map(f => ({ name: f.name, type: f.type })));

    if (imageFiles.length === 0) {
      alert('Please select image files only');
      return;
    }

    if (photos.length + imageFiles.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    console.log('Starting upload process for', imageFiles.length, 'files');
    setUploading(true);
    setUploadProgress(imageFiles.map(file => ({ fileName: file.name, status: 'compressing' as const })));

    try {
      // Process files one at a time to show progress
      const urls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        try {
          const url = await uploadPhoto(file, i);
          urls.push(url);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          // Continue with other files even if one fails
        }
      }
      
      // Clear current processing after all files are done
      setCurrentProcessing(null);

      if (urls.length > 0) {
        // Update photos with new URLs
        const updatedPhotos = [...photos, ...urls];
        console.log('Calling onPhotosChange with:', updatedPhotos.length, 'photos');
        console.log('Current photos before update:', photos);
        console.log('New URLs to add:', urls);
        onPhotosChange(updatedPhotos);
        console.log('onPhotosChange called, updated photos:', updatedPhotos);
      } else {
        console.warn('No URLs returned from upload - all uploads may have failed');
        alert('No photos were uploaded. Please check the console for errors.');
      }

      // Clear progress after a short delay to show completion
      setTimeout(() => {
        setUploadProgress([]);
        setCurrentProcessing(null);
      }, 2000);
    } catch (error) {
      console.error('Error uploading photos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photos';
      alert(errorMessage);
      // Ensure uploading state is cleared on error
      setUploading(false);
      setUploadProgress([]);
      setCurrentProcessing(null);
    } finally {
      // Always ensure uploading is false
      setUploading(false);
    }
  }, [photos, maxPhotos, onPhotosChange, uploadPhoto]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      console.log('File input changed, files selected:', files.length, Array.from(files).map(f => f.name));
      // Create a copy of the FileList before resetting
      const fileArray = Array.from(files);
      // Reset the input value after we've captured the files
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Process the files
      handleFiles(fileArray);
    } else {
      console.log('File input changed but no files selected');
    }
  }, [handleFiles]);

  const removePhoto = async (index: number) => {
    const photoUrl = photos[index];
    
    // Optionally delete from Blob storage
    try {
      await fetch(`/api/upload-photo?url=${encodeURIComponent(photoUrl)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
    }

    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={(e) => {
          // Don't trigger if clicking on a button or the file input itself
          const target = e.target as HTMLElement;
          if (target.tagName === 'BUTTON' || target.closest('button') || target === fileInputRef.current || target.closest('input[type="file"]')) {
            console.log('Click ignored - button or input clicked');
            return;
          }
          // Trigger file input click
          if (!uploading && fileInputRef.current) {
            console.log('Click detected on drop zone, triggering file input');
            // Don't prevent default - let the click bubble naturally
            fileInputRef.current.click();
          } else {
            console.log('Not triggering file input - uploading:', uploading, 'ref:', !!fileInputRef.current);
          }
        }}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-fresh-sprout-green bg-cream'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
          style={{ display: 'none' }}
        />

        <div className="space-y-2 drop-zone-content">
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-fresh-sprout-green mx-auto animate-spin" />
              {currentProcessing && (
                <>
                  <p className="text-sm font-medium text-gray-900">Processing {currentProcessing}</p>
                  <p className="text-xs text-gray-600">
                    Compressing and optimizing image...
                  </p>
                </>
              )}
              {!currentProcessing && (
                <p className="text-sm text-gray-600">Processing photos...</p>
              )}
              {uploadProgress.length > 0 && (
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                  {uploadProgress.map((progress, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {progress.status === 'compressing' && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin text-fresh-sprout-green" />
                          <span>Compressing {progress.fileName}...</span>
                        </div>
                      )}
                      {progress.status === 'uploading' && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span>Uploading {progress.fileName}...</span>
                        </div>
                      )}
                      {progress.status === 'complete' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          <span>{progress.fileName} uploaded</span>
                        </div>
                      )}
                      {progress.status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <span>✗</span>
                          <span>{progress.fileName} failed</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-fresh-sprout-green">Click to upload</span> or
                drag and drop
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF - auto-compressed and resized ({photos.length}/{maxPhotos} photos)
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Choose Files button clicked');
                  console.log('fileInputRef.current:', fileInputRef.current);
                  console.log('uploading:', uploading);
                  if (!uploading && fileInputRef.current) {
                    console.log('Button click - triggering file input click()');
                    try {
                      fileInputRef.current.click();
                      console.log('File input click() called successfully');
                    } catch (error) {
                      console.error('Error calling file input click():', error);
                    }
                  } else {
                    console.log('Cannot trigger file input - uploading:', uploading, 'ref exists:', !!fileInputRef.current);
                  }
                }}
                className="mt-4 px-4 py-2 bg-fresh-sprout-green text-white rounded-lg hover:opacity-90 text-sm font-medium"
              >
                Choose Files
              </button>
            </>
          )}
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                disabled={uploading}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Photo {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          No photos uploaded yet. Add photos to help showcase this goat!
        </p>
      )}
    </div>
  );
}

