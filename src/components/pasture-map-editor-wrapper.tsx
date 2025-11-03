"use client";

import dynamic from 'next/dynamic';

// Dynamically import PastureMapEditor to avoid SSR issues with Leaflet
const PastureMapEditorComponent = dynamic(() => import('./pasture-map-editor').then(mod => ({ default: mod.PastureMapEditor })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map editor...</p>
      </div>
    </div>
  )
});

export const PastureMapEditorWrapper = PastureMapEditorComponent;

