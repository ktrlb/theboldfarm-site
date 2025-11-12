"use client";

import { useState, useEffect } from "react";
import { HeroWithImage } from "./hero-with-image";
import { FarmLogo } from "./farm-logo";

export function AnimalsHero() {
  const [assignedImage, setAssignedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignedImage() {
      try {
        const res = await fetch('/api/image-placements/animals-hero');
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
      albumNames={assignedImage ? [] : ['animals', 'farm', 'goats', 'general', 'site']}
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

        <p className="text-xl max-w-3xl mx-auto drop-shadow-lg">
          Get to know the wonderful animals that call The Bold Farm home. Each one has a unique 
          personality and story to share.
        </p>
      </div>
    </HeroWithImage>
  );
}
