"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
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
  const statuses = Array.isArray((pasture.custom_fields as Record<string, unknown> | null)?.['statuses'])
    ? (((pasture.custom_fields as Record<string, unknown>)['statuses']) as string[])
    : [];
  if (statuses.includes('Off Limits')) return '#6b7280'; // Gray
  if (pasture.current_rotation) return '#16a34a'; // Green - actively grazed
  if (statuses.includes('Needs Maintenance')) return '#dc2626'; // Red
  if (pasture.rest_period || statuses.includes('Resting')) return '#eab308'; // Yellow
  return '#eab308'; // default available
}

function getPastureOpacity(_pasture: PastureWithDetails): number {
  return 0.5;
}

export function PastureMap({ pastures, propertyMap, onPastureClick, mode = 'view', onAddPasture }: PastureMapProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(DEFAULT_LAYER_ID);
  const selectedLayer = MAP_LAYERS.find(l => l.id === selectedLayerId) || MAP_LAYERS[0];

  function prefetchTiles(map: L.Map) {
    if (!propertyMap?.boundary_data?.coordinates) return;
    const coords = propertyMap.boundary_data.coordinates as number[][];
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    const south = Math.min(...lats);
    const north = Math.max(...lats);
    const west = Math.min(...lngs);
    const east = Math.max(...lngs);
    const z = Math.round(map.getZoom());
    function lng2tile(lng: number, zoom: number) { return Math.floor(((lng + 180) / 360) * Math.pow(2, zoom)); }
    function lat2tile(lat: number, zoom: number) {
      const rad = lat * Math.PI / 180;
      return Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * Math.pow(2, zoom));
    }
    const xMin = lng2tile(west, z), xMax = lng2tile(east, z);
    const yMin = lat2tile(north, z), yMax = lat2tile(south, z);
    const urls: string[] = [];
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        const url = selectedLayer.url
          .replace('{z}', String(z))
          .replace('{x}', String(x))
          .replace('{y}', String(y))
          .replace('{r}', '')
          .replace('{s}', 'a');
        urls.push(url);
      }
    }
    // Fire image requests to warm cache
    urls.slice(0, 400).forEach(u => { const img = new Image(); img.src = u; });
  }

  const handlePolygonClick = (pasture: PastureWithDetails) => {
    if (onPastureClick) {
      onPastureClick(pasture);
    }
  };

  return (
    <div className="map-root relative z-0 w-full h-full">
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
        {/* Prefetch current layer tiles within property boundary */}
        <Prefetcher enabled={Boolean(propertyMap?.boundary_data)} onPrefetch={prefetchTiles} />

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
            />
          );
        })}
      </MapContainer>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-40 bg-white rounded-lg shadow-lg p-2 min-w-[200px]">
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
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-40 border border-gray-200">
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

function Prefetcher({ enabled, onPrefetch }: { enabled: boolean; onPrefetch: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled) return;
    // Prefetch on mount and when zoom ends
    onPrefetch(map);
    const handler = () => onPrefetch(map);
    map.on('zoomend', handler);
    return () => { map.off('zoomend', handler); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  return null;
}

