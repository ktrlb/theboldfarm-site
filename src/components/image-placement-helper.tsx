"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Image as ImageIcon, AlertCircle, Wand2 } from "lucide-react";
import { PAGE_SECTIONS } from "@/lib/page-sections";
import Image from "next/image";

interface ImagePlacementHelperProps {
  albums: Array<{ id: number; name: string; images: string[] }>;
}

interface Placement {
  page_section: string;
  image_url: string;
  priority: number;
  description: string | null;
}

export function ImagePlacementHelper({ albums }: ImagePlacementHelperProps) {
  const [selectedPage, setSelectedPage] = useState<string>("Home");
  const [placements, setPlacements] = useState<Record<string, Placement>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [analysisSuggestions, setAnalysisSuggestions] = useState<Record<string, string[]>>({});

  const pages = Array.from(new Set(PAGE_SECTIONS.map(s => s.page)));
  const pageSections = PAGE_SECTIONS.filter(s => s.page === selectedPage);
  const allImages = albums.flatMap(album => album.images.map(img => ({ url: img, album: album.name })));

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await fetch('/api/image-placements');
      if (res.ok) {
        const data: Placement[] = await res.json();
        const placementMap: Record<string, Placement> = {};
        data.forEach(p => {
          placementMap[p.page_section] = p;
        });
        setPlacements(placementMap);
      }
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignImage = async (sectionId: string, imageUrl: string, description?: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/image-placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_section: sectionId,
          image_url: imageUrl,
          priority: 1,
          description: description || null,
        }),
      });

      if (res.ok) {
        await fetchPlacements();
        setSelectedSection(null);
      }
    } catch (error) {
      console.error('Error assigning image:', error);
      alert('Failed to assign image');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlacement = async (sectionId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/image-placements?page_section=${sectionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchPlacements();
      }
    } catch (error) {
      console.error('Error removing placement:', error);
      alert('Failed to remove placement');
    } finally {
      setSaving(false);
    }
  };

  const analyzeImages = async () => {
    // This would use AI to analyze images and suggest placements
    // For now, we'll do a simple keyword-based analysis
    const suggestions: Record<string, string[]> = {};
    
    for (const section of pageSections) {
      const sectionImages: string[] = [];
      const keywords = section.name.toLowerCase().split(' ');
      
      for (const img of allImages) {
        // Simple matching - in a real implementation, this would use AI
        const urlLower = img.url.toLowerCase();
        const albumLower = img.album.toLowerCase();
        
        // Match based on keywords
        const matches = keywords.some(keyword => 
          urlLower.includes(keyword) || albumLower.includes(keyword)
        );
        
        if (matches) {
          sectionImages.push(img.url);
        }
      }
      
      // Also include images from albums that match the section name
      const matchingAlbums = albums.filter(album => {
        const albumLower = album.name.toLowerCase();
        return keywords.some(keyword => albumLower.includes(keyword));
      });
      
      matchingAlbums.forEach(album => {
        album.images.forEach(img => {
          if (!sectionImages.includes(img)) {
            sectionImages.push(img);
          }
        });
      });
      
      if (sectionImages.length > 0) {
        suggestions[section.id] = sectionImages.slice(0, 5); // Limit to 5 suggestions
      }
    }
    
    setAnalysisSuggestions(suggestions);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fresh-sprout-green mx-auto mb-4"></div>
        <p className="text-gray-600">Loading image placements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Placement Helper</h2>
          <p className="text-gray-600 mt-1">
            Assign images to specific page sections for better visual control
          </p>
        </div>
        <Button onClick={analyzeImages} className="bg-gradient-growth hover:opacity-90">
          <Wand2 className="h-4 w-4 mr-2" />
          Analyze & Suggest
        </Button>
      </div>

      {/* Page Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pages.map(page => (
              <Button
                key={page}
                variant={selectedPage === page ? 'default' : 'outline'}
                onClick={() => setSelectedPage(page)}
                className={selectedPage === page ? 'bg-gradient-growth hover:opacity-90' : ''}
              >
                {page}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Sections */}
      <div className="space-y-4">
        {pageSections.map(section => {
          const placement = placements[section.id];
          const suggestions = analysisSuggestions[section.id] || [];
          const isSelected = selectedSection === section.id;

          return (
            <Card key={section.id} className={placement ? 'border-green-200 bg-green-50/50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{section.name}</CardTitle>
                      {placement && (
                        <Badge className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Assigned
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">{section.description}</CardDescription>
                  </div>
                  {placement && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePlacement(section.id)}
                      disabled={saving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {placement ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-green-300">
                      <Image
                        src={placement.image_url}
                        alt={section.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {placement.description && (
                      <p className="text-sm text-gray-600">Note: {placement.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Suggested Images:
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {suggestions.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-fresh-sprout-green transition-colors"
                              onClick={() => handleAssignImage(section.id, imgUrl)}
                            >
                              <Image
                                src={imgUrl}
                                alt={`Suggestion ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setSelectedSection(isSelected ? null : section.id)}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {isSelected ? 'Cancel' : 'Assign Image'}
                    </Button>

                    {isSelected && (
                      <ImageSelector
                        images={allImages}
                        onSelect={(imgUrl) => {
                          const description = prompt('Add a note about why you chose this image (optional):');
                          handleAssignImage(section.id, imgUrl, description || undefined);
                        }}
                        onCancel={() => setSelectedSection(null)}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pageSections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No sections found for this page</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ImageSelector({
  images,
  onSelect,
  onCancel: _onCancel,
}: {
  images: Array<{ url: string; album: string }>;
  onSelect: (url: string) => void;
  onCancel: () => void;
}) {
  const [search, setSearch] = useState("");

  const filteredImages = images.filter(img =>
    img.url.toLowerCase().includes(search.toLowerCase()) ||
    img.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 border-t pt-4">
      <div>
        <Label>Search Images</Label>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by album name or URL..."
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {filteredImages.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-orange-400 transition-colors group"
            onClick={() => onSelect(img.url)}
          >
            <Image
              src={img.url}
              alt={`Image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {img.album}
            </div>
          </div>
        ))}
      </div>
      {filteredImages.length === 0 && (
        <p className="text-center text-gray-500 py-4">No images found</p>
      )}
    </div>
  );
}

