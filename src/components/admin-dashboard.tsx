"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { useDatabase } from "@/lib/database-context";
import { ProductRow } from "@/lib/data";
import { Database } from "@/lib/database-types";
import { PhotoUpload } from "@/components/photo-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimalManagementSection } from "@/components/animal-management-section";
import { AnimalProvider } from "@/lib/animal-context";
import { PastureManagementSection } from "@/components/pasture-management-section";
import { PastureProvider } from "@/lib/pasture-context";
import { AddProductForm, EditProductForm } from "@/components/admin-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ImageAlbum } from "@/lib/db/schema";
import { ImagePlacementHelper } from "./image-placement-helper";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout: _onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("animals");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your farm's content and operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="animals">
            Animal Management
          </TabsTrigger>
          <TabsTrigger value="products">
            Product Management
          </TabsTrigger>
          <TabsTrigger value="pastures">
            Pasture Management
          </TabsTrigger>
          <TabsTrigger value="chores">
            Chore Management
          </TabsTrigger>
          <TabsTrigger value="images">
            Image Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="animals">
          <AnimalProvider>
            <AnimalManagementSection />
          </AnimalProvider>
        </TabsContent>

        <TabsContent value="products">
          <ProductManagementSection />
        </TabsContent>

        <TabsContent value="pastures">
          <PastureProvider>
            <PastureManagementSection />
          </PastureProvider>
        </TabsContent>

        <TabsContent value="chores">
          <ChoreManagementSection />
        </TabsContent>

        <TabsContent value="images">
          <ImageManagementSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Product Management Section
function ProductManagementSection() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useDatabase();
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAddProduct = async (product: Omit<ProductRow, 'id' | 'created_at'>) => {
    await addProduct(product);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = async (id: number, updates: Partial<Database['public']['Tables']['products']['Update']>) => {
    await updateProduct(id, updates);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage products like goat soap, t-shirts, etc.</p>
        </div>
        <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-growth hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your shop</DialogDescription>
            </DialogHeader>
            <AddProductForm onSubmit={handleAddProduct} onClose={() => setShowAddProduct(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fresh-sprout-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No products added yet. Click "Add New Product" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-fresh-sprout-green font-semibold">${Number(product.price).toFixed(2)}</p>
                  {product.description && <p className="text-gray-600 line-clamp-3">{product.description}</p>}
                  <div className="flex gap-2">
                    {product.in_stock && <span className="text-green-600 text-xs">In Stock</span>}
                    {product.featured && <span className="text-fresh-sprout-green text-xs">Featured</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            <EditProductForm product={editingProduct} onSubmit={(updates) => handleUpdateProduct(editingProduct.id, updates)} onClose={() => setEditingProduct(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Chore Management Section
function ChoreManagementSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chore Management</h2>
          <p className="text-gray-600 mt-1">Track maintenance chores and tasks</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Chore
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-600 mb-4">Chore management coming soon!</p>
          <p className="text-sm text-gray-500">This section will allow you to track and manage farm maintenance chores.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Image Management Section with Albums
function ImageManagementSection() {
  const [albums, setAlbums] = useState<ImageAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<ImageAlbum | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPlacementHelper, setShowPlacementHelper] = useState(false);

  // Fetch albums on mount
  useEffect(() => {
    fetchAlbums();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/albums');
      if (res.ok) {
        const data = await res.json();
        setAlbums(data);
        if (data.length > 0 && !selectedAlbum) {
          setSelectedAlbum(data[0]);
        }
      }
    } catch {
      // Error logged, continue without crashing
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      alert('Failed to copy URL');
    }
  };

  const handleCreateAlbum = async (name: string, description?: string) => {
    try {
      if (!name.trim()) {
        alert('Please enter an album name');
        return;
      }

      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description?.trim() || null, images: [] }),
      });
      
      if (res.ok) {
        await fetchAlbums();
        setShowAddAlbum(false);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      alert(error instanceof Error ? error.message : 'Failed to create album');
    }
  };

  const handleAddImagesToAlbum = async (newImages: string[]) => {
    if (!selectedAlbum) return;

    try {
      const res = await fetch(`/api/albums/${selectedAlbum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [...(selectedAlbum.images || []), ...newImages]
        }),
      });
      if (res.ok) {
        await fetchAlbums();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add images');
      }
    } catch (error) {
      console.error('Error adding images:', error);
      alert(error instanceof Error ? error.message : 'Failed to add images to album');
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!selectedAlbum) return;
    
    if (!confirm('Are you sure you want to delete this image? This will remove it from the album and delete it from storage.')) {
      return;
    }

    console.log('Deleting image:', imageUrl);
    console.log('Current album images:', selectedAlbum.images);

    try {
      // Delete from blob storage
      try {
        const deleteRes = await fetch(`/api/upload-photo?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        });
        if (!deleteRes.ok) {
          console.warn('Failed to delete from blob storage, but continuing with album update');
        }
      } catch (error) {
        console.error('Error deleting from blob:', error);
        // Continue even if blob deletion fails
      }

      // Fetch fresh album data to ensure we have the latest state
      const albumRes = await fetch(`/api/albums/${selectedAlbum.id}`);
      if (!albumRes.ok) {
        throw new Error('Failed to fetch album data');
      }
      const freshAlbum = await albumRes.json();

      // Remove from album using exact URL match
      // Normalize URLs for comparison (remove trailing slashes, decode)
      const normalizeUrl = (url: string) => decodeURIComponent(url.trim());
      const targetUrl = normalizeUrl(imageUrl);
      
      const updatedImages = (freshAlbum.images || []).filter((url: string) => {
        const normalized = normalizeUrl(url);
        const matches = normalized === targetUrl;
        console.log(`Comparing: "${normalized}" === "${targetUrl}" = ${matches}`);
        return !matches;
      });

      console.log('Updated images after filter:', updatedImages);
      console.log('Removed count:', (freshAlbum.images || []).length - updatedImages.length);

      const res = await fetch(`/api/albums/${selectedAlbum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: updatedImages
        }),
      });
      
      if (res.ok) {
        await fetchAlbums();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to remove image from album');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete image');
    }
  };


  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading albums...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Management</h2>
          <p className="text-gray-600 mt-1">Organize images into albums for easy access</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPlacementHelper(!showPlacementHelper)} 
            variant={showPlacementHelper ? "default" : "outline"}
              className={showPlacementHelper ? "bg-gradient-growth hover:opacity-90" : ""}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showPlacementHelper ? 'Hide' : 'Show'} Placement Helper
          </Button>
          <Button onClick={() => setShowAddAlbum(true)} className="bg-gradient-growth hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Create Album
          </Button>
        </div>
      </div>

      {showPlacementHelper && (
        <div className="border-t pt-6">
          <ImagePlacementHelper albums={albums} />
        </div>
      )}

      {/* Album Selection */}
      {albums.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {albums.map((album) => (
            <Button
              key={album.id}
              variant={selectedAlbum?.id === album.id ? 'default' : 'outline'}
              onClick={() => setSelectedAlbum(album)}
              className={selectedAlbum?.id === album.id ? 'bg-gradient-growth hover:opacity-90' : ''}
            >
              {album.name}
              {album.images && album.images.length > 0 && (
                <Badge className="ml-2 bg-white text-fresh-sprout-green">
                  {album.images.length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Image Upload for Selected Album */}
      {selectedAlbum && (
        <Card>
          <CardHeader>
            <CardTitle>Upload to {selectedAlbum.name}</CardTitle>
            <CardDescription>Add images to this album. Images are uploaded to Vercel Blob storage.</CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUpload 
              photos={selectedAlbum.images || []}
              onPhotosChange={handleAddImagesToAlbum}
              maxPhotos={100}
            />
          </CardContent>
        </Card>
      )}

      {/* Display Images in Selected Album */}
      {selectedAlbum && selectedAlbum.images && selectedAlbum.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedAlbum.name} Images</CardTitle>
            <CardDescription>{selectedAlbum.images.length} images in this album</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedAlbum.images.map((url: string, index: number) => (
                <div key={`${url}-${index}`} className="relative group">
                  <img 
                    src={url} 
                    alt={`Image ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      console.error('Failed to load image:', url);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white hover:bg-gray-50"
                      onClick={() => handleCopyUrl(url)}
                      title="Copy image URL"
                    >
                      {copiedUrl === url ? '✓' : '📋'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-red-300"
                      onClick={() => handleDeleteImage(url)}
                      title="Delete image"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Click "Copy URL" on any image to get the direct link to use in your content, 
                blog posts, or anywhere on the website.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {albums.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">No albums yet. Create your first album to get started!</p>
          </CardContent>
        </Card>
      )}

      {/* Create Album Dialog */}
      <Dialog open={showAddAlbum} onOpenChange={setShowAddAlbum}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
            <DialogDescription>Create an album to organize your images</DialogDescription>
          </DialogHeader>
          <CreateAlbumDialog
            onSubmit={(name, description) => handleCreateAlbum(name, description)}
            onClose={() => setShowAddAlbum(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateAlbumDialog({ onSubmit, onClose }: { 
  onSubmit: (name: string, description?: string) => void; 
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), description.trim() || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="album-name">Album Name *</Label>
        <Input
          id="album-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., General Site Images"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="album-description">Description (Optional)</Label>
        <Input
          id="album-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this album"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1 bg-gradient-growth hover:opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Album'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

