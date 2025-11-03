"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet-draw';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Layers, Eye, Map } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { PastureWithDetails, PropertyMap } from "@/lib/pasture-types";
import { MAP_LAYERS, DEFAULT_LAYER_ID } from "@/lib/map-layers";
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PastureMapEditorProps {
  pastures: PastureWithDetails[];
  propertyMap: PropertyMap | null;
  onPastureClick?: (pasture: PastureWithDetails) => void;
  onPropertyBoundarySave?: (coordinates: number[][]) => void;
  onPastureSave?: (pastureId: number, coordinates: number[][]) => void;
  onPastureCreate?: (name: string, coordinates: number[][]) => void;
  mode?: 'view' | 'edit';
  redrawPastureId?: number | null;
}

// Component to center map and set up drawing
function MapEditorSetup({ 
  pastures, 
  propertyMap, 
  onPropertyBoundarySave,
  onPastureSave,
  onPastureCreate,
  mode = 'view',
  requestedDrawMode,
  onDrawStarted,
  canEditBoundary,
  redrawPastureId
}: {
  pastures: PastureWithDetails[];
  propertyMap: PropertyMap | null;
  onPropertyBoundarySave?: (coordinates: number[][]) => void;
  onPastureSave?: (pastureId: number, coordinates: number[][]) => void;
  onPastureCreate?: (name: string, coordinates: number[][]) => void;
  mode?: 'view' | 'edit';
  requestedDrawMode?: 'property' | 'pasture' | null;
  onDrawStarted?: () => void;
  canEditBoundary?: boolean;
  redrawPastureId?: number | null;
}) {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const currentDrawModeRef = useRef<'property' | 'pasture' | 'pasture-redraw' | null>(null);
  const drawToolRef = useRef<L.Draw.Polygon | null>(null);

  useEffect(() => {
    if (mode === 'edit' && !drawControlRef.current) {
      // Create feature group to hold drawn items
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);

      // Create draw control
      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            metric: true,
          },
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
          polyline: false,
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: true,
        },
      });

      map.addControl(drawControl);
      drawControlRef.current = drawControl;

      // Handle drawing events
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on(L.Draw.Event.CREATED as any, (e: any) => {
        const { layer } = e;
        if (drawnItemsRef.current) {
          drawnItemsRef.current.addLayer(layer);
        }

        const layerType = layer instanceof L.Polygon ? 'polygon' : null;
        if (layerType === 'polygon') {
          const polygon = layer as L.Polygon;
          const latlngs = polygon.getLatLngs()[0] as L.LatLng[];
          // Convert to [lng, lat] format for database
          const coordinates = latlngs.map(latlng => [latlng.lng, latlng.lat]);

          // If a draw mode was requested, use it to route the save
          if (currentDrawModeRef.current === 'property') {
            if (canEditBoundary && onPropertyBoundarySave) onPropertyBoundarySave(coordinates);
            currentDrawModeRef.current = null;
            return;
          }
          if (currentDrawModeRef.current === 'pasture') {
            const pastureName = window.prompt('Enter pasture name:');
            if (pastureName && onPastureCreate) onPastureCreate(pastureName, coordinates);
            currentDrawModeRef.current = null;
            return;
          }

          if (currentDrawModeRef.current === 'pasture-redraw' && redrawPastureId && onPastureSave) {
            onPastureSave(redrawPastureId, coordinates);
            currentDrawModeRef.current = null;
            return;
          }

          // Fallback legacy flow
          const isPropertyBoundary = window.confirm('Is this the property boundary? Click OK for property boundary, Cancel for a new pasture.');
          if (isPropertyBoundary) {
            if (onPropertyBoundarySave) onPropertyBoundarySave(coordinates);
          } else {
            const pastureName = window.prompt('Enter pasture name:');
            if (pastureName && onPastureCreate) onPastureCreate(pastureName, coordinates);
          }
        }
      });

      // Handle edit events
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on(L.Draw.Event.EDITED as any, (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.Polygon) {
            const polygon = layer as L.Polygon;
            const latlngs = polygon.getLatLngs()[0] as L.LatLng[];
            const coordinates = latlngs.map(latlng => [latlng.lng, latlng.lat]);

            // Find which pasture this belongs to (check if it matches existing)
            const matchingPasture = pastures.find(p => {
              if (!p.shape_data?.coordinates) return false;
              // Simple check - in production, use a better matching algorithm
              return p.shape_data.coordinates.length === coordinates.length;
            });

            if (matchingPasture && onPastureSave) {
              onPastureSave(matchingPasture.id, coordinates);
            }
          }
        });
      });

      // Cleanup on unmount
      return () => {
        if (drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null;
        }
        if (drawnItemsRef.current) {
          map.removeLayer(drawnItemsRef.current);
          drawnItemsRef.current = null;
        }
      };
    } else if (mode === 'view' && drawControlRef.current) {
      // Remove draw control when switching to view mode
      map.removeControl(drawControlRef.current);
      drawControlRef.current = null;
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
        drawnItemsRef.current = null;
      }
    }
  }, [map, mode, pastures, onPropertyBoundarySave, onPastureSave, onPastureCreate]);

  // Programmatically start polygon drawing when requested
  useEffect(() => {
    if (!requestedDrawMode || mode !== 'edit') return;
    // Initialize a polygon draw tool and enable it
    if (drawToolRef.current) {
      // ensure previous tool disabled
      try { (drawToolRef.current as unknown as { disable: () => void }).disable(); } catch {}
      drawToolRef.current = null;
    }
    // Type-safe constructor for Draw.Polygon without using 'any'
    type PolygonCtor = new (map: unknown, opts: unknown) => L.Draw.Polygon;
    const DrawPolygon = (L as unknown as { Draw: { Polygon: PolygonCtor } }).Draw.Polygon;
    const tool = new DrawPolygon(map as unknown, {
      showArea: true,
      allowIntersection: false,
    } as unknown);
    currentDrawModeRef.current = requestedDrawMode;
    tool.enable();
    drawToolRef.current = tool;
    if (onDrawStarted) onDrawStarted();
  }, [requestedDrawMode, mode, map, onDrawStarted]);

  // Start redraw flow when a pasture id is provided
  useEffect(() => {
    if (!redrawPastureId || mode !== 'edit') return;
    if (drawToolRef.current) {
      try { (drawToolRef.current as unknown as { disable: () => void }).disable(); } catch {}
      drawToolRef.current = null;
    }
    type PolygonCtor2 = new (map: unknown, opts: unknown) => L.Draw.Polygon;
    const DrawPolygon2 = (L as unknown as { Draw: { Polygon: PolygonCtor2 } }).Draw.Polygon;
    const tool = new DrawPolygon2(map as unknown, {
      showArea: true,
      allowIntersection: false,
    } as unknown);
    currentDrawModeRef.current = 'pasture-redraw';
    tool.enable();
    drawToolRef.current = tool;
    if (onDrawStarted) onDrawStarted();
  }, [redrawPastureId, mode, map, onDrawStarted]);

  // Center map on property or pastures
  useEffect(() => {
    const bounds = L.latLngBounds([]);
    let hasCoordinates = false;

    // Add property boundary if exists
    if (propertyMap?.boundary_data?.coordinates) {
      propertyMap.boundary_data.coordinates.forEach(coord => {
        if (coord && coord.length >= 2) {
          bounds.extend([coord[1], coord[0]] as [number, number]);
          hasCoordinates = true;
        }
      });
    }

    // Add pasture polygons
    pastures.forEach(pasture => {
      if (pasture.shape_data?.coordinates && pasture.shape_data.coordinates.length > 0) {
        pasture.shape_data.coordinates.forEach(coord => {
          if (coord && coord.length >= 2) {
            bounds.extend([coord[1], coord[0]] as [number, number]);
            hasCoordinates = true;
          }
        });
      }
    });

    if (hasCoordinates) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (propertyMap?.map_center && propertyMap.map_zoom) {
      // Use saved map center and zoom
      map.setView([propertyMap.map_center[1], propertyMap.map_center[0]], propertyMap.map_zoom);
    } else {
      // Use farm location as default
      import('@/lib/farm-location').then(({ FARM_LOCATION }) => {
        map.setView([FARM_LOCATION.center[1], FARM_LOCATION.center[0]], FARM_LOCATION.zoom);
      });
    }
  }, [pastures, propertyMap, map]);

  return null;
}

// Color mapping for pasture status
function getPastureColor(pasture: PastureWithDetails): string {
  if (pasture.current_rotation) {
    return '#16a34a'; // Green
  }
  if (pasture.rest_period) {
    return '#2563eb'; // Blue
  }
  if (pasture.quality_rating && pasture.quality_rating < 3) {
    return '#dc2626'; // Red
  }
  return '#eab308'; // Yellow
}

export function PastureMapEditor({ 
  pastures, 
  propertyMap,
  onPastureClick, 
  onPropertyBoundarySave,
  onPastureSave,
  onPastureCreate,
  mode = 'view',
  redrawPastureId
}: PastureMapEditorProps) {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(DEFAULT_LAYER_ID);
  const selectedLayer = MAP_LAYERS.find(l => l.id === selectedLayerId) || MAP_LAYERS[0];
  const [requestedDrawMode, setRequestedDrawMode] = useState<'property' | 'pasture' | null>(null);
  const [isBoundaryLocked, setIsBoundaryLocked] = useState<boolean>(Boolean(propertyMap?.boundary_data?.coordinates));

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
        
        <MapEditorSetup 
          pastures={pastures}
          propertyMap={propertyMap}
          onPropertyBoundarySave={onPropertyBoundarySave}
          onPastureSave={onPastureSave}
          onPastureCreate={onPastureCreate}
          mode={mode}
          requestedDrawMode={requestedDrawMode}
          onDrawStarted={() => setRequestedDrawMode(null)}
          canEditBoundary={!isBoundaryLocked}
          redrawPastureId={redrawPastureId || null}
        />

        {/* Property Boundary */}
        {propertyMap?.boundary_data?.coordinates && (
          <Polygon
            positions={propertyMap.boundary_data.coordinates.map(
              coord => [coord[1], coord[0]] as [number, number]
            )}
            pathOptions={{
              color: '#6366f1',
              fillColor: '#6366f1',
              fillOpacity: 0.1,
              weight: 3,
              dashArray: '10, 5'
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{propertyMap.name}</h3>
                {propertyMap.total_area && (
                  <p className="text-sm text-gray-600">
                    {propertyMap.total_area} {propertyMap.area_unit}
                  </p>
                )}
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Pasture Polygons */}
        {pastures.map((pasture) => {
          if (!pasture.shape_data?.coordinates || pasture.shape_data.coordinates.length === 0) {
            return null;
          }

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
                fillOpacity: 0.3,
                weight: 2
              }}
              eventHandlers={{
                click: () => onPastureClick && onPastureClick(pasture)
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
                      Resting
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
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Drawing Controls - added via MapEditorSetup */}
      </MapContainer>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2 space-y-2 min-w-[220px]">
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

        {/* Quick Satellite Toggle */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedLayerId(prev => prev === 'esri-imagery' ? DEFAULT_LAYER_ID : 'esri-imagery')}
          className="w-full"
        >
          {selectedLayerId === 'esri-imagery' ? 'Switch to Street' : 'Satellite View'}
        </Button>

        {/* Edit/View Mode Toggle */}
        {mode === 'view' && (
          <Button
            onClick={() => window.location.href = window.location.href + '?mode=edit'}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 w-full"
          >
            <Layers className="h-4 w-4 mr-2" />
            Edit Map
          </Button>
        )}
        
        {mode === 'edit' && (
          <Button
            onClick={() => window.location.href = window.location.href.replace('?mode=edit', '')}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Mode
          </Button>
        )}

        {mode === 'edit' && (
          <div className="space-y-2 pt-2 border-t">
            <Button
              size="sm"
              variant={isBoundaryLocked ? 'outline' : 'default'}
              className="w-full"
              onClick={() => setIsBoundaryLocked(!isBoundaryLocked)}
            >
              {isBoundaryLocked ? 'Unlock Property Boundary' : 'Lock Property Boundary'}
            </Button>
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                if (isBoundaryLocked) {
                  setIsBoundaryLocked(false);
                  return; // require a second click to actually draw
                }
                setRequestedDrawMode('property');
              }}
            >
              Draw Property Boundary
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setRequestedDrawMode('pasture')}
            >
              Create Pasture
            </Button>
          </div>
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
          {propertyMap && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
              <div className="w-4 h-4 border-2 border-indigo-500 bg-indigo-100"></div>
              <span>Property Boundary</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

