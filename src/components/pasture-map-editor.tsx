"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet-draw';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Layers, Eye, Map } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { PastureWithDetails, PropertyMap, Gate } from "@/lib/pasture-types";
import { usePasture } from "@/lib/pasture-context";
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
  redrawPastureId,
  onMapClickForGate
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
  onMapClickForGate?: (lngLat: [number, number]) => void;
}) {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const currentDrawModeRef = useRef<'property' | 'pasture' | 'pasture-redraw' | null>(null);
  const drawToolRef = useRef<L.Draw.Polygon | null>(null);
  const handlingCreateRef = useRef<boolean>(false);

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
        if (handlingCreateRef.current) return;
        handlingCreateRef.current = true;
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
            setTimeout(() => { handlingCreateRef.current = false; }, 0);
            return;
          }
          if (currentDrawModeRef.current === 'pasture') {
            const pastureName = window.prompt('Enter pasture name:');
            if (pastureName && onPastureCreate) onPastureCreate(pastureName, coordinates);
            currentDrawModeRef.current = null;
            setTimeout(() => { handlingCreateRef.current = false; }, 0);
            return;
          }

          if (currentDrawModeRef.current === 'pasture-redraw' && redrawPastureId && onPastureSave) {
            onPastureSave(redrawPastureId, coordinates);
            currentDrawModeRef.current = null;
            setTimeout(() => { handlingCreateRef.current = false; }, 0);
            return;
          }

          // No mode set: ignore to avoid accidental duplicate prompts/creates
          setTimeout(() => { handlingCreateRef.current = false; }, 0);
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

  // Gate placement
  useEffect(() => {
    if (!onMapClickForGate) return;
    const handler = (e: L.LeafletMouseEvent) => {
      onMapClickForGate([e.latlng.lng, e.latlng.lat]);
    };
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, onMapClickForGate]);

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
  return '#eab308';
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
  const { gates, addGate, updateGate } = usePasture();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(DEFAULT_LAYER_ID);
  const selectedLayer = MAP_LAYERS.find(l => l.id === selectedLayerId) || MAP_LAYERS[0];
  const [requestedDrawMode, setRequestedDrawMode] = useState<'property' | 'pasture' | null>(null);
  const [isBoundaryLocked, setIsBoundaryLocked] = useState<boolean>(Boolean(propertyMap?.boundary_data?.coordinates));
  const [isAddingGate, setIsAddingGate] = useState<boolean>(false);

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
          onMapClickForGate={isAddingGate ? async ([lng, lat]) => {
            setIsAddingGate(false);
            const name = window.prompt('Gate name:');
            if (!name) return;
            const type = window.confirm('Temporary gate? OK = Temporary, Cancel = Permanent') ? 'temporary' : 'permanent';
            try { await addGate({ name, type: type as 'permanent' | 'temporary', lng, lat, is_open: false, connected_pasture_ids: null, notes: null }); } catch {}
          } : undefined}
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
            />
          );
        })}

        {/* Gates Markers */}
        {gates.map((gate: Gate) => (
          <Marker
            key={gate.id}
            position={[Number(gate.lat), Number(gate.lng)] as [number, number]}
            eventHandlers={{
              click: async () => {
                if (mode !== 'edit') return;
                try { await updateGate(gate.id, { is_open: !gate.is_open }); } catch {}
              }
            }}
            icon={L.divIcon({
              className: 'gate-marker',
              html: `<div style="width:12px;height:12px;border-radius:50%;background:${gate.is_open ? '#16a34a' : '#dc2626'};border:2px solid white;box-shadow:0 0 0 1px #111"></div>`
            })}
          />
        ))}

        {/* Drawing Controls - added via MapEditorSetup */}
      </MapContainer>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-40 bg-white rounded-lg shadow-lg p-2 space-y-2 min-w-[220px]">
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
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={() => setIsAddingGate(true)}
            >
              Add Gate (click map)
            </Button>
          </div>
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

