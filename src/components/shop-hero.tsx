"use client";

import { useState, useEffect } from "react";
import { HeroWithImage } from "./hero-with-image";
import { FarmLogo } from "./farm-logo";

export function ShopHero() {
  const [assignedImage, setAssignedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignedImage() {
      try {
        const res = await fetch('/api/image-placements/shop-hero');
        if (res.ok) {
          const data = await res.json();
          setAssignedImage(data.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching assigned image:', error);
      }
    }

    fetchAssignedImage();
  }, []);

  return (
    <HeroWithImage 
      albumNames={[]}
      className="py-20"
      defaultImage={assignedImage || undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="flex justify-center">
            <FarmLogo 
              variant="auto" 
              full={true} 
              size="lg" 
              className="drop-shadow-lg"
              priority 
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
          Farm Products & Merchandise
        </h1>
        
        <p className="text-xl max-w-3xl mx-auto drop-shadow-lg">
          Handcrafted products from our farm to yours. From goat milk soap to farm-themed clothing, 
          we create quality items that celebrate the homestead lifestyle.
        </p>
      </div>
    </HeroWithImage>
  );
}
