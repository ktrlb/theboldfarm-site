"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MapPin } from "lucide-react";

interface PropertyMapSetupProps {
  onLocationSet: (center: [number, number], zoom: number) => void;
  onSkip?: () => void;
}

export function PropertyMapSetup({ onLocationSet, onSkip }: PropertyMapSetupProps) {
  const [address, setAddress] = useState("7101 Colony Rd, Tolar, TX 76476");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auto-set farm location on mount
  useEffect(() => {
    const initializeFarmLocation = async () => {
      const { FARM_LOCATION } = await import('@/lib/farm-location');
      onLocationSet(FARM_LOCATION.center, FARM_LOCATION.zoom);
    };
    initializeFarmLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const geocodeAddress = async (addressInput: string) => {
    if (!addressInput.trim()) {
      setError("Please enter an address");
      return;
    }

    setSearching(true);
    setError(null);

    try {
      // Use OpenStreetMap Nominatim API (free, no API key needed)
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const encodedAddress = encodeURIComponent(addressInput.trim());
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TheBoldFarm/1.0 (Contact: admin@theboldfarm.com)',
          'Accept': 'application/json',
          'Referer': typeof window !== 'undefined' ? window.location.origin : ''
        }
      });

      if (!response.ok) {
        throw new Error(`Geocoding failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setError(
          "Address not found. Try:\n" +
          "• Full address with city and state\n" +
          "• City, State format\n" +
          "• ZIP code\n" +
          "• Or click 'Skip' to manually center the map"
        );
        return;
      }

      // Use the first result (most relevant)
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      if (isNaN(lat) || isNaN(lng)) {
        setError("Invalid coordinates returned. Please try again.");
        return;
      }

      // Determine zoom level based on address type or importance
      let zoom = 15; // Default zoom
      
      // Check importance (higher = more specific location)
      if (result.importance && result.importance > 0.8) {
        zoom = 17; // Very specific (building, house)
      } else if (result.importance && result.importance > 0.6) {
        zoom = 15; // Specific (street, neighborhood)
      } else if (result.importance && result.importance > 0.4) {
        zoom = 13; // City/town level
      } else {
        zoom = 11; // Regional
      }

      // Also check type
      if (result.type === 'house' || result.type === 'building' || result.type === 'residential') {
        zoom = 18;
      } else if (result.type === 'road' || result.type === 'street') {
        zoom = 16;
      } else if (result.type === 'city' || result.type === 'town' || result.type === 'village') {
        zoom = 12;
      }

      onLocationSet([lng, lat], zoom);
    } catch (err) {
      console.error('Geocoding error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(
        `Failed to find location: ${errorMessage}\n\n` +
        "You can:\n" +
        "• Try a different address format\n" +
        "• Use just city, state\n" +
        "• Click 'Skip' to center the map manually"
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    geocodeAddress(address);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-600" />
          Set Property Location
        </CardTitle>
        <CardDescription>
          Your farm location is already set. Click "Set Location" to confirm, or skip to proceed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Property Address or Location</Label>
            <Input
              id="address"
              type="text"
              placeholder="e.g., City, State or 123 Main St, City, State ZIP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !searching && address.trim()) {
                  handleSubmit(e);
                }
              }}
              disabled={searching}
            />
            <p className="text-xs text-gray-500">
              Try: City, State format works well. You can also use ZIP codes or skip to center manually.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 whitespace-pre-line">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={async () => {
                const { FARM_LOCATION } = await import('@/lib/farm-location');
                onLocationSet(FARM_LOCATION.center, FARM_LOCATION.zoom);
              }}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Confirm Location
            </Button>
            {onSkip && (
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                disabled={searching}
                className="flex-1"
              >
                Skip
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

