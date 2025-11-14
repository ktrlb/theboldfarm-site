"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Plus, 
  AlertCircle,
  Leaf,
  RefreshCw,
  Eye,
  Edit
} from "lucide-react";
import { usePasture } from "@/lib/pasture-context";
import { PastureMapWrapper } from "@/components/pasture-map-wrapper";
import { PastureMapEditorWrapper } from "@/components/pasture-map-editor-wrapper";
import { PropertyMapSetup } from "@/components/property-map-setup";
import type { PastureWithDetails } from "@/lib/pasture-types";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PastureManagementSection() {
  const { 
    pastures, 
    rotations,
    observations,
    propertyMap,
    loading, 
    error,
    getCurrentRotations,
    getActiveRestPeriods,
    savePropertyBoundary,
    savePropertyLocation,
    addPasture,
    updatePasture,
    deletePasture
  } = usePasture();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPasture, setSelectedPasture] = useState<PastureWithDetails | null>(null);
  const [redrawPastureId, setRedrawPastureId] = useState<number | null>(null);
  // Status and grazing controls (stored in custom_fields)
  const DEFAULT_STATUS_OPTIONS = ["Available", "Resting", "Grazing", "Needs Maintenance", "Fallow Season", "Off Limits"] as const;
  const [statusOptions, setStatusOptions] = useState<string[]>([...DEFAULT_STATUS_OPTIONS]);
  const [newStatus, setNewStatus] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedGrazers, setSelectedGrazers] = useState<string[]>([]);
  const [fencingType, setFencingType] = useState<string>("");
  const [fencingCondition, setFencingCondition] = useState<string>("");
  const ALLOWED_FENCING_CONDITIONS = ["Excellent","Good","Fair","Poor","Needs Repair"] as const;
  function toFencingCondition(value: string): typeof ALLOWED_FENCING_CONDITIONS[number] | null {
    return (ALLOWED_FENCING_CONDITIONS as readonly string[]).includes(value) ? (value as typeof ALLOWED_FENCING_CONDITIONS[number]) : null;
  }

  function readStringArray(obj: unknown, key: string): string[] {
    if (!obj || typeof obj !== 'object') return [];
    const val = (obj as Record<string, unknown>)[key];
    return Array.isArray(val) && val.every(v => typeof v === 'string') ? (val as string[]) : [];
  }
  
  function projectToMeters([lng, lat]: [number, number]): [number, number] {
    const R = 6378137;
    const x = (lng * Math.PI) / 180 * R;
    const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * R;
    return [x, y];
  }

  function computePolygonAreaAcres(coords: number[][] | undefined): number | null {
    if (!coords || coords.length < 3) return null;
    const pts = coords.map(c => projectToMeters([c[0], c[1]] as [number, number]));
    let sum = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      sum += x1 * y2 - x2 * y1;
    }
    const areaM2 = Math.abs(sum) / 2;
    const acres = areaM2 / 4046.8564224;
    return Math.round(acres * 100) / 100;
  }

  // With hardcoded location, we don't need setup - it auto-initializes
  // But we can still show setup if location hasn't been saved yet
  const needsSetup = !propertyMap?.map_center;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pasture data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error loading pasture data</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const currentRotations = getCurrentRotations();
  const activeRestPeriods = getActiveRestPeriods();
  const pasturesNeedingAttention = pastures.filter(p => 
    p.quality_rating && p.quality_rating < 3
  );

  function toggleInList(value: string, list: string[], setter: (v: string[]) => void) {
    if (list.includes(value)) setter(list.filter(v => v !== value));
    else setter([...list, value]);
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pastures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pastures.length}</div>
            <p className="text-sm text-gray-500 mt-1">
              {pastures.filter(p => p.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Currently Grazing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{currentRotations.length}</div>
            <p className="text-sm text-gray-500 mt-1">
              Active rotations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Resting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeRestPeriods.length}</div>
            <p className="text-sm text-gray-500 mt-1">
              In recovery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Need Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{pasturesNeedingAttention.length}</div>
            <p className="text-sm text-gray-500 mt-1">
              Low quality
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="rotations">Rotations</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">All Pastures</h3>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Pasture
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastures.map((pasture) => (
              <Card 
                key={pasture.id} 
                className={`hover:shadow-lg transition-shadow ${
                  pasture.current_rotation ? 'border-green-300 border-2' : ''
                } ${
                  pasture.rest_period ? 'border-blue-300 border-2' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{pasture.name}</CardTitle>
                      <CardDescription>
                        {pasture.area_size} {pasture.area_unit}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-lg ${
                            i < (pasture.quality_rating || 0) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Status */}
                  {readStringArray(pasture.custom_fields, 'statuses').includes('Off Limits') ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-red-100 text-red-800">Off Limits</Badge>
                    </div>
                  ) : pasture.current_rotation ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-green-100 text-green-800">
                        Currently Grazing
                      </Badge>
                      <span className="text-gray-600">
                        {pasture.current_rotation.animal_type}
                      </span>
                    </div>
                  ) : pasture.rest_period ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">
                        Resting
                      </Badge>
                      <span className="text-gray-600">
                        {pasture.days_resting} days
                      </span>
                    </div>
                  ) : (
                    <Badge variant="outline">Available</Badge>
                  )}

                  {/* Area */}
                  {pasture.shape_data?.coordinates && pasture.shape_data.coordinates.length >= 3 && (
                    <div className="text-sm text-gray-600">
                      Area: {computePolygonAreaAcres(pasture.shape_data.coordinates)} acres
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {pasture.forage_type && (
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span>{pasture.forage_type}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span>
                        {pasture.water_source ? '💧 Water' : 'No water'} • 
                        {pasture.shade_available ? ' 🌳 Shade' : ' No shade'}
                      </span>
                    </div>

                    {pasture.fencing_type && (
                      <div className="text-xs text-gray-500">
                        {pasture.fencing_type} • {pasture.fencing_condition}
                      </div>
                    )}
                  </div>

                  {/* Last Observation */}
                  {pasture.last_observation && (
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Last checked: {new Date(pasture.last_observation.observation_date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Grazing/Status Summary */}
                  <div className="mt-2 p-3 rounded border bg-white/60">
                    {pasture.current_rotation ? (
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">Actively Grazed</Badge>
                          <span className="text-gray-700">{pasture.current_rotation.animal_type}</span>
                        </div>
                        <div className="text-gray-600">
                          Since: {new Date(pasture.current_rotation.start_date).toLocaleDateString()} (
                          {Math.max(0, Math.ceil((Date.now() - new Date(pasture.current_rotation.start_date).getTime()) / (1000 * 60 * 60 * 24)))} days)
                        </div>
                        {Array.isArray((pasture.custom_fields as Record<string, unknown> | null)?.['grazingAnimals']) && (
                          <div className="text-gray-600">
                            Animals: {((pasture.custom_fields as Record<string, unknown>)['grazingAnimals'] as string[]).join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {Array.isArray((pasture.custom_fields as Record<string, unknown> | null)?.['statuses']) && ((pasture.custom_fields as Record<string, unknown>)['statuses'] as string[]).length > 0
                          ? `Status: ${((pasture.custom_fields as Record<string, unknown>)['statuses'] as string[]).join(', ')}`
                          : 'No active grazing'}
                      </div>
                    )}
                    {pasture.last_observation?.notes && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        Note: {pasture.last_observation.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedPasture(pasture)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Attention Needed */}
          {pasturesNeedingAttention.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h4 className="text-lg font-semibold text-gray-900">Pastures Needing Attention</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pasturesNeedingAttention.map(pasture => (
                  <div key={pasture.id} className="bg-white rounded-lg p-4">
                    <div className="font-medium text-gray-900">{pasture.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Quality: {pasture.quality_rating}/5 stars
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      Take Action
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Map View Tab */}
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Property Map</CardTitle>
                  <CardDescription>
                    {needsSetup 
                      ? "Set your property location first, then draw boundaries and pastures."
                      : isEditMode 
                      ? "Draw your property boundary and pasture polygons. Click the polygon tool to start drawing."
                      : "Visual representation of your pastures with real-time status. Switch map layers using the control in the top-right."
                    }
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  variant={isEditMode ? "outline" : "default"}
                  className={isEditMode ? "" : "bg-orange-600 hover:bg-orange-700"}
                >
                  {isEditMode ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View Mode
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Map
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {needsSetup ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
                  <PropertyMapSetup
                    onLocationSet={async (center, zoom) => {
                      try { await savePropertyLocation(center, zoom); } catch {}
                    }}
                    onSkip={async () => {
                      // Use farm location
                      const { FARM_LOCATION } = await import('@/lib/farm-location');
                      await savePropertyLocation(FARM_LOCATION.center, FARM_LOCATION.zoom);
                    }}
                  />
                </div>
              ) : (
                <div
                  className="map-root h-[600px] w-full relative"
                  style={{ isolation: 'isolate', zIndex: 1, display: selectedPasture ? 'none' : 'block' }}
                >
                  {isEditMode ? (
                  <PastureMapEditorWrapper
                    pastures={pastures}
                    propertyMap={propertyMap}
                    onPastureClick={(pasture) => setSelectedPasture(pasture)}
                    onPropertyBoundarySave={async (coordinates) => { try { await savePropertyBoundary(coordinates); } catch {} }}
                    onPastureSave={async (pastureId, coordinates) => { try { await updatePasture(pastureId, { shape_data: { type: 'polygon', coordinates } }); } catch {} }}
                    onPastureCreate={async (name, coordinates) => { try { await addPasture({ name, description: null, area_size: null, area_unit: 'acres', shape_data: { type: 'polygon', coordinates }, quality_rating: null, forage_type: null, water_source: false, shade_available: false, fencing_type: null, fencing_condition: null, notes: null, custom_fields: null, is_active: true }); } catch {} }}
                    mode="edit"
                    redrawPastureId={redrawPastureId}
                  />
                ) : (
                  <PastureMapWrapper 
                    pastures={pastures}
                    propertyMap={propertyMap}
                    onPastureClick={(pasture) => setSelectedPasture(pasture)}
                    mode="view"
                  />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rotations Tab */}
        <TabsContent value="rotations">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Grazing Rotations</h3>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Start New Rotation
              </Button>
            </div>

            {rotations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No rotations recorded yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rotations.slice(0, 10).map((rotation) => {
                  const pasture = pastures.find(p => p.id === rotation.pasture_id);
                  return (
                    <Card key={rotation.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{pasture?.name || 'Unknown Pasture'}</CardTitle>
                            <CardDescription>
                              {rotation.animal_type} • {rotation.animal_count || 'Unknown'} animals
                            </CardDescription>
                          </div>
                          {rotation.is_current && (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Start:</span>
                            <span className="ml-2 font-medium">{new Date(rotation.start_date).toLocaleDateString()}</span>
                          </div>
                          {rotation.end_date && (
                            <div>
                              <span className="text-gray-600">End:</span>
                              <span className="ml-2 font-medium">{new Date(rotation.end_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {rotation.grazing_pressure && (
                            <div>
                              <span className="text-gray-600">Pressure:</span>
                              <span className="ml-2 font-medium">{rotation.grazing_pressure}</span>
                            </div>
                          )}
                          {rotation.pasture_quality_start && (
                            <div>
                              <span className="text-gray-600">Quality Start:</span>
                              <span className="ml-2 font-medium">{rotation.pasture_quality_start}/5</span>
                            </div>
                          )}
                        </div>
                        {rotation.is_current && (
                          <Button size="sm" variant="outline" className="mt-4">
                            End Rotation
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Observations Tab */}
        <TabsContent value="observations">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Pasture Observations</h3>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Observation
              </Button>
            </div>

            {observations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No observations recorded yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {observations.slice(0, 10).map((observation) => {
                  const pasture = pastures.find(p => p.id === observation.pasture_id);
                  return (
                    <Card key={observation.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{pasture?.name || 'Unknown Pasture'}</CardTitle>
                            <CardDescription>
                              {new Date(observation.observation_date).toLocaleDateString()}
                              {observation.observed_by && ` • by ${observation.observed_by}`}
                            </CardDescription>
                          </div>
                          {observation.quality_rating && (
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${
                                    i < observation.quality_rating! 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          {observation.forage_height && (
                            <div>
                              <span className="text-gray-600">Height:</span>
                              <span className="ml-2 font-medium">{observation.forage_height}"</span>
                            </div>
                          )}
                          {observation.moisture_level && (
                            <div>
                              <span className="text-gray-600">Moisture:</span>
                              <span className="ml-2 font-medium">{observation.moisture_level}</span>
                            </div>
                          )}
                          {observation.weed_pressure && (
                            <div>
                              <span className="text-gray-600">Weeds:</span>
                              <span className="ml-2 font-medium">{observation.weed_pressure}</span>
                            </div>
                          )}
                          {observation.bare_spots_percentage && (
                            <div>
                              <span className="text-gray-600">Bare:</span>
                              <span className="ml-2 font-medium">{observation.bare_spots_percentage}%</span>
                            </div>
                          )}
                        </div>

                        {/* Action flags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {observation.needs_reseeding && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                              Needs Reseeding
                            </Badge>
                          )}
                          {observation.needs_mowing && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                              Needs Mowing
                            </Badge>
                          )}
                          {observation.needs_fertilizing && (
                            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                              Needs Fertilizing
                            </Badge>
                          )}
                        </div>

                        {observation.notes && (
                          <p className="text-sm text-gray-600 italic">{observation.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pasture Modal */}
      {selectedPasture && (
        <Dialog open={!!selectedPasture} onOpenChange={(open) => !open && setSelectedPasture(null)}>
          <DialogContent className="p-6 flex flex-col max-h-[90vh]">
            <DialogHeader className="flex-shrink-0 pb-4">
              <DialogTitle>{selectedPasture.name}</DialogTitle>
              <DialogDescription>
                {readStringArray(selectedPasture.custom_fields, 'statuses').includes('Off Limits') ? (
                  <UiBadge className="bg-red-100 text-red-800">Off Limits</UiBadge>
                ) : (!selectedPasture.current_rotation && !selectedPasture.rest_period) ? (
                  <UiBadge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</UiBadge>
                ) : selectedPasture.current_rotation ? (
                  <UiBadge className="bg-green-100 text-green-800">Currently Grazing</UiBadge>
                ) : (
                  <UiBadge className="bg-blue-100 text-blue-800">Resting</UiBadge>
                )}
                {selectedPasture.shape_data?.coordinates && selectedPasture.shape_data.coordinates.length >= 3 && (
                  <span className="block mt-2 text-sm text-gray-600">
                    Area: {computePolygonAreaAcres(selectedPasture.shape_data.coordinates)} acres
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            {/* Status and Grazing Controls - Scrollable */}
            <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-2 -mr-2">
              <div>
                <Label className="text-sm">Statuses</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {statusOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(opt)}
                        onChange={() => toggleInList(opt, selectedStatuses, setSelectedStatuses)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="Add custom status"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const trimmed = newStatus.trim();
                      if (!trimmed) return;
                      if (!statusOptions.includes(trimmed)) setStatusOptions([...statusOptions, trimmed]);
                      if (!selectedStatuses.includes(trimmed)) setSelectedStatuses([...selectedStatuses, trimmed]);
                      setNewStatus("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm">Active Grazing</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["Horses","Cows","Boy Goats","Girl Goats","Chickens"] as string[]).map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedGrazers.includes(opt)}
                        onChange={() => toggleInList(opt, selectedGrazers, setSelectedGrazers)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Fencing inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Fencing Type</Label>
                  <Input
                    value={fencingType}
                    onChange={(e) => setFencingType(e.target.value)}
                    placeholder="e.g., Woven wire, Electric, Barbed"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Fencing Condition</Label>
                  <Input
                    value={fencingCondition}
                    onChange={(e) => setFencingCondition(e.target.value)}
                    placeholder="e.g., Good, Fair, Needs repair"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0 pt-4 mt-4 border-t">
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  if (!isEditMode) {
                    setIsEditMode(true);
                  }
                  setRedrawPastureId(selectedPasture.id);
                  setSelectedPasture(null);
                }}
              >
                Redraw Boundary
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const nextCustom = {
                      ...(selectedPasture!.custom_fields || {}),
                      statuses: selectedStatuses,
                      grazingAnimals: selectedGrazers,
                    } as Record<string, unknown>;
                    await updatePasture(selectedPasture!.id, {
                      custom_fields: nextCustom as unknown as Record<string, string | number | boolean | null>,
                      fencing_type: fencingType || null,
                      fencing_condition: toFencingCondition(fencingCondition),
                    });
                  } catch {
                    // ignore
                  }
                }}
              >
                Save Details
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={async () => {
                  if (confirm(`Delete pasture "${selectedPasture.name}"? This cannot be undone.`)) {
                    try {
                      await deletePasture(selectedPasture.id);
                      setSelectedPasture(null);
                    } catch {
                      alert('Failed to delete pasture');
                    }
                  }
                }}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => setSelectedPasture(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

