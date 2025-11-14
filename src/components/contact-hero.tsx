"use client";

import { useState, useEffect } from "react";
import { HeroWithImage } from "./hero-with-image";

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
        <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
          Contact Us
        </h1>
        <p className="text-xl max-w-3xl mx-auto drop-shadow-lg">
          Have questions about our goats, want to visit the farm, or interested in our products? 
          We'd love to hear from you!
        </p>
      </div>
    </HeroWithImage>
  );
}
