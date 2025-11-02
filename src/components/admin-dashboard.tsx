"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useSupabase } from "@/lib/database-context";
import { getGoatAge, getGoatPlaceholder, GoatRow, ProductRow } from "@/lib/data";
import { Database } from "@/lib/supabase";
import { PhotoUpload } from "@/components/photo-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddGoatForm, EditGoatForm, AddProductForm, EditProductForm } from "@/components/admin-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ImageAlbum } from "@/lib/db/schema";

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("goats");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your farm's content and operations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="goats">
            Goat Management
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

        <TabsContent value="goats">
          <GoatManagementSection />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagementSection />
        </TabsContent>

        <TabsContent value="pastures">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Pasture Management</p>
            <Button asChild>
              <a href="/admin/pastures">Open Pasture Management</a>
            </Button>
          </div>
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

// Goat Management Section - extract from existing admin-panel.tsx
function GoatManagementSection() {
  const { goats, addGoat, updateGoat, deleteGoat, loading } = useSupabase();
  const [editingGoat, setEditingGoat] = useState<GoatRow | null>(null);
  const [showAddGoat, setShowAddGoat] = useState(false);

  const handleAddGoat = async (goat: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>) => {
    await addGoat(goat);
    setShowAddGoat(false);
  };

  const handleUpdateGoat = async (id: number, updates: Partial<Database['public']['Tables']['goats']['Update']>) => {
    await updateGoat(id, updates);
    setEditingGoat(null);
  };

  const handleDeleteGoat = async (id: number) => {
    if (confirm('Are you sure you want to delete this goat?')) {
      await deleteGoat(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goat Management</h2>
          <p className="text-gray-600 mt-1">Manage your goat listings and information</p>
        </div>
        <Dialog open={showAddGoat} onOpenChange={setShowAddGoat}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Goat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Goat</DialogTitle>
              <DialogDescription>Add a new goat to your farm listings</DialogDescription>
            </DialogHeader>
            <AddGoatForm onSubmit={handleAddGoat} onClose={() => setShowAddGoat(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goats...</p>
        </div>
      ) : goats.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No goats added yet. Click "Add New Goat" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goats.map((goat) => (
            <Card key={goat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{goat.name || 'Unnamed Goat'}</CardTitle>
                    <CardDescription>{goat.type}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingGoat(goat)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteGoat(goat.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {goat.photos && goat.photos.length > 0 ? (
                  <img src={goat.photos[0]} alt={goat.name || 'Goat'} className="w-full h-48 object-cover rounded-lg mb-4" />
                ) : (
                  <img src={getGoatPlaceholder(goat)} alt={goat.name || 'Goat'} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{getGoatAge(goat)}</p>
                  {goat.is_for_sale && <p className="text-orange-600 font-semibold">${Number(goat.price).toFixed(2)}</p>}
                  {goat.bio && <p className="text-gray-600 line-clamp-3">{goat.bio}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingGoat && (
        <Dialog open={!!editingGoat} onOpenChange={(open) => !open && setEditingGoat(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Goat</DialogTitle>
              <DialogDescription>Update goat information</DialogDescription>
            </DialogHeader>
            <EditGoatForm goat={editingGoat} onSubmit={(updates) => handleUpdateGoat(editingGoat.id, updates)} onClose={() => setEditingGoat(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Product Management Section
function ProductManagementSection() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useSupabase();
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
            <Button className="bg-orange-600 hover:bg-orange-700">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
                  <p className="text-orange-600 font-semibold">${Number(product.price).toFixed(2)}</p>
                  {product.description && <p className="text-gray-600 line-clamp-3">{product.description}</p>}
                  <div className="flex gap-2">
                    {product.in_stock && <span className="text-green-600 text-xs">In Stock</span>}
                    {product.featured && <span className="text-orange-600 text-xs">Featured</span>}
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
    } catch (err) {
      alert('Failed to copy URL');
    }
  };

  const handleCreateAlbum = async (name: string, description?: string) => {
    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, images: [] }),
      });
      if (res.ok) {
        await fetchAlbums();
        setShowAddAlbum(false);
      }
    } catch (err) {
      console.error('Error creating album:', err);
      alert('Failed to create album');
    }
  };

  const handleAddImagesToAlbum = async (newImages: string[]) => {
    if (!selectedAlbum) return;

    try {
      const res = await fetch(`/api/albums/${selectedAlbum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: [...selectedAlbum.images, ...newImages]
        }),
      });
      if (res.ok) {
        await fetchAlbums();
      }
    } catch (err) {
      console.error('Error adding images:', err);
      alert('Failed to add images to album');
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
        <Button onClick={() => setShowAddAlbum(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Album
        </Button>
      </div>

      {/* Album Selection */}
      {albums.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {albums.map((album) => (
            <Button
              key={album.id}
              variant={selectedAlbum?.id === album.id ? 'default' : 'outline'}
              onClick={() => setSelectedAlbum(album)}
              className={selectedAlbum?.id === album.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              {album.name}
              {album.images && album.images.length > 0 && (
                <Badge className="ml-2 bg-white text-orange-600">
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
                <div key={index} className="relative group">
                  <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white"
                      onClick={() => handleCopyUrl(url)}
                    >
                      {copiedUrl === url ? 'Copied!' : 'Copy URL'}
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
      {showAddAlbum && (
        <CreateAlbumDialog
          onSubmit={(name, description) => handleCreateAlbum(name, description)}
          onClose={() => setShowAddAlbum(false)}
        />
      )}
    </div>
  );
}

function CreateAlbumDialog({ onSubmit, onClose }: { 
  onSubmit: (name: string, description?: string) => void; 
  onClose: () => void;
}) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Album</CardTitle>
          <CardDescription>Create an album to organize your images</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="album-name">Album Name</Label>
              <Input
                id="album-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., General Site Images"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Create Album
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

