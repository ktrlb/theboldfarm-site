"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Map } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Pasture, PastureWithDetails, PropertyMap } from "@/lib/pasture-types";
import { MAP_LAYERS, DEFAULT_LAYER_ID } from "@/lib/map-layers";

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
  propertyMap?: PropertyMap | null;
  onPastureClick?: (pasture: PastureWithDetails) => void;
  mode?: 'view' | 'edit';
  onAddPasture?: () => void;
}

// Component to center map when pastures change
function MapCenter({ pastures }: { pastures: Pasture[] }) {
  const map = useMap();
  
  useEffect(() => {
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
      // Use farm location as default
      import('@/lib/farm-location').then(({ FARM_LOCATION }) => {
        map.setView([FARM_LOCATION.center[1], FARM_LOCATION.center[0]], FARM_LOCATION.zoom);
      });
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

export function PastureMap({ pastures, propertyMap, onPastureClick, mode = 'view', onAddPasture }: PastureMapProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(DEFAULT_LAYER_ID);
  const selectedLayer = MAP_LAYERS.find(l => l.id === selectedLayerId) || MAP_LAYERS[0];

  const handlePolygonClick = (pasture: PastureWithDetails) => {
    if (onPastureClick) {
      onPastureClick(pasture);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={propertyMap?.map_center ? [propertyMap.map_center[1], propertyMap.map_center[0]] : [32.42041750212495, -97.89525682461269]}
        zoom={propertyMap?.map_zoom || 15}
        maxZoom={22}
        zoomSnap={0.5}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          key={selectedLayerId}
          url={selectedLayer.url}
          attribution={selectedLayer.attribution}
          maxZoom={22}
          maxNativeZoom={19}
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

      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2 min-w-[200px]">
        {/* Map Layer Selector */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Map className="h-3 w-3" />
            Map Style
          </label>
          <Select value={selectedLayerId} onValueChange={setSelectedLayerId}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAP_LAYERS.map((layer) => (
                <SelectItem key={layer.id} value={layer.id}>
                  {layer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mode === 'edit' && onAddPasture && (
          <Button
            onClick={onAddPasture}
            className="mt-2 w-full bg-orange-600 hover:bg-orange-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pasture
          </Button>
        )}
      </div>

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

