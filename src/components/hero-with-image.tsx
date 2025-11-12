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
        // If no album names provided, skip album fetching
        // Assigned images should be passed via defaultImage prop
        if (albumNames.length === 0) {
          // Use fallback image if no album names provided
          setHeroImage(DEFAULT_FALLBACK_IMAGE);
          setLoading(false);
          return;
        }
        // Only fetch from albums if no defaultImage was provided
        // This is a fallback for components that haven't migrated to image placements yet
        const params = new URLSearchParams();
        albumNames.forEach(name => params.append('albumNames', name));
        const res = await fetch(`/api/images?${params.toString()}`);
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          setHeroImage(data.images[0]);
        } else {
          // Use fallback image if no images found from albums
          setHeroImage(DEFAULT_FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error('[HeroWithImage] Error fetching hero image:', error);
        // Use fallback image on error
        setHeroImage(DEFAULT_FALLBACK_IMAGE);
      } finally {
        setLoading(false);
      }
    }

    if (albumNames.length > 0) {
      fetchImage();
    } else {
      // Use fallback image if no album names provided
      setHeroImage(DEFAULT_FALLBACK_IMAGE);
      setLoading(false);
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
