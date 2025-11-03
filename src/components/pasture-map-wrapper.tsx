"use client";

import dynamic from 'next/dynamic';
import { PastureWithDetails, PropertyMap } from '@/lib/pasture-types';

// Dynamically import PastureMap to avoid SSR issues with Leaflet
const PastureMapComponent = dynamic(() => import('./pasture-map').then(mod => ({ default: mod.PastureMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

interface PastureMapWrapperProps {
  pastures: PastureWithDetails[];
  propertyMap?: PropertyMap | null;
  onPastureClick?: (pasture: PastureWithDetails) => void;
  mode?: 'view' | 'edit';
  onAddPasture?: () => void;
}

export function PastureMapWrapper(props: PastureMapWrapperProps) {
  return <PastureMapComponent {...props} />;
}

