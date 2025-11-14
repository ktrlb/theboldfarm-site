"use client";

import { useState, useEffect } from "react";
import { HeroWithImage } from "./hero-with-image";
import { FarmLogo } from "./farm-logo";

export function GoatsHero() {
  const [assignedImage, setAssignedImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch assigned image from API
    async function fetchAssignedImage() {
      try {
        const res = await fetch('/api/image-placements/goats-hero');
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

        <p className="text-xl max-w-3xl mx-auto drop-shadow-lg">
          Quality Nigerian Dwarf goats available for your homestead.
          <br />
          <br />
          We prioritize our goats&apos; health &amp; socialization, and will be available for questions before and after you bring your new goats home.
        </p>
      </div>
    </HeroWithImage>
  );
}
