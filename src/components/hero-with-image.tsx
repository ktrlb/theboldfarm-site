"use client";

import { useEffect, useState, createContext, useContext } from "react";
import Image from "next/image";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/image-fallbacks";

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
  // Always start with fallback image to prevent flashing unwanted images
  const [heroImage, setHeroImage] = useState<string | null>(defaultImage || DEFAULT_FALLBACK_IMAGE);
  const [loading, setLoading] = useState(!defaultImage);

  useEffect(() => {
    // If defaultImage is provided, use it immediately
    if (defaultImage) {
      setHeroImage(defaultImage);
      setLoading(false);
      return;
    }

    // If no defaultImage, use fallback image immediately (don't fetch from albums)
    // This prevents showing random album images while waiting for assigned images
    setHeroImage(DEFAULT_FALLBACK_IMAGE);
    setLoading(false);
    
    // Only fetch from albums if explicitly requested (for legacy components)
    // But prefer fallback image over album images to avoid showing unwanted photos
    if (albumNames.length > 0) {
      async function fetchImage() {
        try {
          const params = new URLSearchParams();
          albumNames.forEach(name => params.append('albumNames', name));
          const res = await fetch(`/api/images?${params.toString()}`);
          const data = await res.json();
          // Only use album image if we have one AND no defaultImage was ever provided
          // Otherwise stick with fallback
          if (data.images && data.images.length > 0 && !defaultImage) {
            setHeroImage(data.images[0]);
          }
        } catch (error) {
          console.error('[HeroWithImage] Error fetching hero image:', error);
          // Keep fallback image on error
        }
      }
      fetchImage();
    }
    // Dependencies: defaultImage and albumNames array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultImage, JSON.stringify(albumNames)]);

  const hasImage = Boolean(!loading && heroImage);

  return (
    <HeroContext.Provider value={{ hasImage }}>
      <section className={`relative overflow-hidden ${className}`}>
        {hasImage && heroImage ? (
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
