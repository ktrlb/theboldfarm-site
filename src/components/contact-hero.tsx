"use client";

import { useState, useEffect } from "react";
import { HeroWithImage } from "./hero-with-image";
import { FarmLogo } from "./farm-logo";

export function ContactHero() {
  const [assignedImage, setAssignedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignedImage() {
      try {
        const res = await fetch('/api/image-placements/contact-hero');
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          Contact
        </h1>
        <div className="flex justify-center mb-6">
          <FarmLogo 
            variant="auto" 
            full={true} 
            size="lg" 
            className="drop-shadow-lg"
            priority 
          />
        </div>
      </div>
    </HeroWithImage>
  );
}
