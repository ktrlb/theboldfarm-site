"use client";

import { useState, useEffect } from "react";
import { HeroWithImage } from "./hero-with-image";
import { FarmLogo } from "./farm-logo";

export function BeefHero() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch('/api/image-placements/beef-hero');
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            setHeroImage(data.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <HeroWithImage
      albumNames={heroImage ? [] : []}
      defaultImage={heroImage || undefined}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <FarmLogo variant="auto" full={true} size="lg" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
          Farm-Fresh Beef, Raised with Care
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Experience the difference of knowing exactly where your beef comes from. Our cattle are raised on pasture with care and attention, resulting in high-quality beef that you can feel good about serving your family.
        </p>
      </div>
    </HeroWithImage>
  );
}

