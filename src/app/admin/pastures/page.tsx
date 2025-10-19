"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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
  Eye
} from "lucide-react";
import { PastureProvider, usePasture } from "@/lib/pasture-context";

function PastureManagementContent() {
  const { 
    pastures, 
    rotations,
    observations,
    loading, 
    error,
    getCurrentRotations,
    getActiveRestPeriods
  } = usePasture();

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
                  {pasture.current_rotation && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-green-100 text-green-800">
                        Currently Grazing
                      </Badge>
                      <span className="text-gray-600">
                        {pasture.current_rotation.animal_type}
                      </span>
                    </div>
                  )}

                  {pasture.rest_period && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-blue-100 text-blue-800">
                        Resting
                      </Badge>
                      <span className="text-gray-600">
                        {pasture.days_resting} days
                      </span>
                    </div>
                  )}

                  {!pasture.current_rotation && !pasture.rest_period && (
                    <Badge variant="outline">Available</Badge>
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

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    {!pasture.current_rotation && (
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        Start Grazing
                      </Button>
                    )}
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
              <CardTitle>Property Map</CardTitle>
              <CardDescription>
                Visual representation of your pastures (Coming soon: Interactive map editor)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map view coming soon!</p>
                  <p className="text-sm mt-2">You'll be able to draw your pastures and see real-time status</p>
                </div>
              </div>
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
    </div>
  );
}

export default function PastureManagementPage() {
  return (
    <PastureProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pasture Management</h1>
            <p className="text-lg text-gray-600">
              Track grazing rotations, monitor pasture health, and optimize your land management
            </p>
          </div>

          <PastureManagementContent />
        </div>

        <Footer />
      </div>
    </PastureProvider>
  );
}


