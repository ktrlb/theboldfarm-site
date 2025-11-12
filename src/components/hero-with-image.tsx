"use client";

import { useEffect, useState, createContext, useContext } from "react";
import Image from "next/image";

interface HeroContextType {
  hasImage: boolean;
}

const HeroContext = createContext<HeroContextType>({ hasImage: false });

export function useHeroContext() {
  return useContext(HeroContext);
}

interface HeroWithImageProps {
  albumNames: string[];
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  fallbackClassName?: string;
  defaultImage?: string;
}

export function HeroWithImage({ 
  albumNames, 
  children, 
  className = "",
  overlayClassName = "bg-black/50",
  fallbackClassName = "bg-cream",
  defaultImage
}: HeroWithImageProps) {
  const [heroImage, setHeroImage] = useState<string | null>(defaultImage || null);
  const [loading, setLoading] = useState(!defaultImage);

  useEffect(() => {
    // If defaultImage is provided, use it and don't fetch
    if (defaultImage) {
      setHeroImage(defaultImage);
      setLoading(false);
      return;
    }

    async function fetchImage() {
      try {
        if (albumNames.length === 0) {
          setLoading(false);
          return;
        }
        const params = new URLSearchParams({ albums: albumNames.join(',') });
        console.log(`[HeroWithImage] Fetching images from albums: ${albumNames.join(', ')}`);
        const res = await fetch(`/api/images?${params}`);
        const data = await res.json();
        console.log(`[HeroWithImage] Received ${data.images?.length || 0} images`);
        if (data.images && data.images.length > 0) {
          console.log(`[HeroWithImage] Setting hero image: ${data.images[0]}`);
          setHeroImage(data.images[0]);
        } else {
          console.log('[HeroWithImage] No images found, will use fallback');
        }
      } catch (error) {
        console.error('[HeroWithImage] Error fetching hero image:', error);
      } finally {
        setLoading(false);
      }
    }

    if (albumNames.length > 0) {
      fetchImage();
    } else {
      setLoading(false);
    }
    // Dependencies: defaultImage and albumNames array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultImage, JSON.stringify(albumNames)]);

  const hasImage = !loading && heroImage;

  return (
    <HeroContext.Provider value={{ hasImage }}>
      <section className={`relative overflow-hidden ${className}`}>
        {hasImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroImage}
                alt="The Bold Farm"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
            <div className={`absolute inset-0 ${overlayClassName}`}></div>
          </>
        ) : (
          !loading && <div className={`absolute inset-0 ${fallbackClassName}`}></div>
        )}
        <div className={`relative z-10 ${hasImage ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </div>
      </section>
    </HeroContext.Provider>
  );
}
