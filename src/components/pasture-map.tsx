"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus } from "lucide-react";
import type { Pasture, PastureWithDetails } from "@/lib/pasture-types";

// Fix for default marker icons in Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PastureMapProps {
  pastures: PastureWithDetails[];
  onPastureClick?: (pasture: PastureWithDetails) => void;
  mode?: 'view' | 'edit';
  onAddPasture?: () => void;
}

// Component to center map when pastures change
function MapCenter({ pastures }: { pastures: Pasture[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (pastures.length === 0) {
      map.setView([40.7128, -74.0060], 13); // Default center
      return;
    }

    // Calculate bounds of all pastures
    const bounds = L.latLngBounds([]);
    let hasCoordinates = false;

    pastures.forEach(pasture => {
      if (pasture.shape_data?.coordinates && pasture.shape_data.coordinates.length > 0) {
        pasture.shape_data.coordinates.forEach(coord => {
          if (coord && coord.length >= 2) {
            bounds.extend([coord[1], coord[0]] as [number, number]); // Leaflet uses [lat, lng]
            hasCoordinates = true;
          }
        });
      }
    });

    if (hasCoordinates) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([40.7128, -74.0060], 13);
    }
  }, [pastures, map]);

  return null;
}

// Color mapping for pasture status
function getPastureColor(pasture: PastureWithDetails): string {
  if (pasture.current_rotation) {
    return '#16a34a'; // Green - currently grazing
  }
  if (pasture.rest_period) {
    return '#2563eb'; // Blue - resting
  }
  if (pasture.quality_rating && pasture.quality_rating < 3) {
    return '#dc2626'; // Red - needs attention
  }
  return '#eab308'; // Yellow - available
}

function getPastureOpacity(_pasture: PastureWithDetails): number {
  return 0.5;
}

export function PastureMap({ pastures, onPastureClick, mode = 'view', onAddPasture }: PastureMapProps) {
  const handlePolygonClick = (pasture: PastureWithDetails) => {
    if (onPastureClick) {
      onPastureClick(pasture);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenter pastures={pastures} />

        {pastures.map((pasture) => {
          if (!pasture.shape_data?.coordinates || pasture.shape_data.coordinates.length === 0) {
            return null;
          }

          // Convert coordinates for Leaflet (Leaflet uses [lat, lng])
          const leafletCoordinates = pasture.shape_data.coordinates.map(
            coord => [coord[1], coord[0]] as [number, number]
          );

          return (
            <Polygon
              key={pasture.id}
              positions={[leafletCoordinates]}
              pathOptions={{
                color: getPastureColor(pasture),
                fillColor: getPastureColor(pasture),
                fillOpacity: getPastureOpacity(pasture),
                weight: 2
              }}
              eventHandlers={{
                click: () => handlePolygonClick(pasture)
              }}
            >
              <Popup>
                <div className="pasture-popup min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{pasture.name}</h3>
                  
                  {pasture.current_rotation && (
                    <Badge className="bg-green-100 text-green-800 mb-2">
                      Currently Grazing ({pasture.current_rotation.animal_type})
                    </Badge>
                  )}
                  
                  {pasture.rest_period && (
                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                      Resting ({pasture.rest_period.reason || 'Recovery'})
                    </Badge>
                  )}
                  
                  {!pasture.current_rotation && !pasture.rest_period && (
                    <Badge variant="outline" className="mb-2">
                      Available
                    </Badge>
                  )}

                  {pasture.quality_rating && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Quality: </span>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < pasture.quality_rating! ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}

                  {pasture.area_size && (
                    <p className="text-sm text-gray-600 mt-1">
                      {pasture.area_size} {pasture.area_unit}
                    </p>
                  )}

                  {pasture.forage_type && (
                    <p className="text-sm text-gray-600 mt-1">
                      Forage: {pasture.forage_type}
                    </p>
                  )}
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

      {mode === 'edit' && onAddPasture && (
        <Button
          onClick={onAddPasture}
          className="absolute top-4 right-4 z-[1000] bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pasture
        </Button>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] border border-gray-200">
        <h4 className="font-semibold text-sm mb-2">Status Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded opacity-50"></div>
            <span>Currently Grazing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded opacity-50"></div>
            <span>Resting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded opacity-50"></div>
            <span>Needs Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded opacity-50"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

