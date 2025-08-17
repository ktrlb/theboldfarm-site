"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { getGoatAge, getGoatPlaceholder, GoatRow, ProductRow } from "@/lib/data";
import { useSupabase } from "@/lib/supabase-context";
import { Database } from "@/lib/supabase";

interface AdminPanelProps {
  onLogout?: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const { goats, products, addGoat: addGoatToSupabase, updateGoat: updateGoatInSupabase, deleteGoat: deleteGoatFromSupabase, addProduct: addProductToSupabase, updateProduct: updateProductInSupabase, deleteProduct: deleteProductFromSupabase, loading, error } = useSupabase();

  const [editingGoat, setEditingGoat] = useState<GoatRow | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showAddGoat, setShowAddGoat] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const addGoat = async (goat: Omit<Database['public']['Tables']['goats']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
    await addGoatToSupabase(goat);
    setShowAddGoat(false);
  };

  const updateGoat = async (id: number, updates: Partial<Database['public']['Tables']['goats']['Update']>) => {
    await updateGoatInSupabase(id, updates);
    setEditingGoat(null);
  };

  const deleteGoat = async (id: number) => {
    await deleteGoatFromSupabase(id);
  };

  const addProduct = async (product: Omit<Database['public']['Tables']['products']['Insert'], 'id' | 'created_at'>) => {
    await addProductToSupabase(product);
    setShowAddProduct(false);
  };

  const updateProduct = async (id: number, updates: Partial<Database['public']['Tables']['products']['Update']>) => {
    await updateProductInSupabase(id, updates);
    setEditingProduct(null);
  };

  const deleteProduct = async (id: number) => {
    await deleteProductFromSupabase(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        <p className="text-lg text-gray-600">
          Manage your farm's content, animals, and products.
        </p>
        {onLogout && (
          <div className="mt-4">
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farm data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Not Configured Notice */}
      {!loading && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Running in Demo Mode</h3>
              <p className="text-sm text-blue-700 mt-1">
                Supabase is not configured yet. You're seeing sample data. 
                <a href="https://vercel.com/docs/integrations/supabase" target="_blank" rel="noopener noreferrer" className="font-medium underline ml-1">
                  Set up Supabase through Vercel
                </a>
                to persist your data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Debug Information</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Supabase URL:</span>
            <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Supabase Anon Key:</span>
            <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Supabase Service Key:</span>
            <span className={process.env.SUPABASE_SERVICE_ROLE_KEY ? 'text-green-600' : 'text-red-600'}>
              {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Service Key Length:</span>
            <span className="text-gray-600">
              {process.env.SUPABASE_SERVICE_ROLE_KEY ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.length} characters` : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Service Key Preview:</span>
            <span className="text-gray-600 font-mono text-xs">
              {process.env.SUPABASE_SERVICE_ROLE_KEY ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...` : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <strong>Note:</strong> Environment variables are loaded at build time. If you've added new ones, restart your dev server.
        </div>
      </div>

      {/* Goats Management */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Goats Management</CardTitle>
              <CardDescription>
                Add, edit, and remove goats from your inventory.
              </CardDescription>
            </div>
            <Dialog open={showAddGoat} onOpenChange={setShowAddGoat}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-2 border-gray-200 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Add New Goat</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Enter the details for the new goat.
                  </DialogDescription>
                </DialogHeader>
                <AddGoatForm onSubmit={addGoat} onClose={() => setShowAddGoat(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goats.map((goat) => (
              <div key={goat.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{goat.name}</h3>
                    <p className="text-sm text-gray-600">
                      {goat.type} • {getGoatAge(goat)} • {goat.horn_status} • ${goat.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGoat(goat)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteGoat(goat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Photo Preview */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {goat.photos.length > 0 ? (
                    goat.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${goat.name} photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                      />
                    ))
                  ) : (
                    <div className="w-16 h-16 bg-orange-100 rounded border border-gray-200 flex items-center justify-center text-2xl">
                      {getGoatPlaceholder(goat)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Products Management</CardTitle>
              <CardDescription>
                Manage your shop inventory and products.
              </CardDescription>
            </div>
            <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-2 border-gray-200 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Add New Product</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Enter the details for the new product.
                  </DialogDescription>
                </DialogHeader>
                <AddProductForm onSubmit={addProduct} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category} • ${product.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Goat Dialog */}
      {editingGoat && (
        <Dialog open={!!editingGoat} onOpenChange={() => setEditingGoat(null)}>
          <DialogContent className="max-w-2xl bg-white border-2 border-gray-200 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Goat</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the goat's information.
              </DialogDescription>
            </DialogHeader>
            <EditGoatForm goat={editingGoat} onSubmit={(updates) => updateGoat(editingGoat!.id, updates)} onClose={() => setEditingGoat(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl bg-white border-2 border-gray-200 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Product</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the product's information.
              </DialogDescription>
            </DialogHeader>
            <EditProductForm product={editingProduct} onSubmit={(updates) => updateProduct(editingProduct!.id, updates)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddGoatForm({ onSubmit, onClose }: { onSubmit: (goat: Omit<Database['public']['Tables']['goats']['Insert'], 'id' | 'created_at' | 'updated_at'>) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    birth_date: new Date().toISOString().split('T')[0], // Today's date as default
    birth_type: "exact" as 'exact' | 'year',
    price: 0,
    registered: false,
    horn_status: "Horned",
    dam: "",
    sire: "",
    bio: "",
    status: "Available",
    photos: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      birth_date: formData.birth_date || null,
      birth_type: formData.birth_type,
      price: formData.price,
      registered: formData.registered,
      horn_status: formData.horn_status,
      dam: formData.dam || null,
      sire: formData.sire || null,
      bio: formData.bio,
      status: formData.status,
      photos: formData.photos
    });
    setFormData({
      name: "",
      type: "",
      birth_date: new Date().toISOString().split('T')[0], // Today's date as default
      birth_type: "exact" as 'exact' | 'year',
      price: 0,
      registered: false,
      horn_status: "Horned",
      dam: "",
      sire: "",
      bio: "",
      status: "Available",
      photos: [] as string[]
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dairy Doe">Dairy Doe</SelectItem>
              <SelectItem value="Breeding Buck">Breeding Buck</SelectItem>
              <SelectItem value="Kid">Kid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="horn_status">Horn Status</Label>
          <Select value={formData.horn_status} onValueChange={(value) => setFormData({ ...formData, horn_status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Horned">Horned</SelectItem>
              <SelectItem value="Dehorned">Dehorned</SelectItem>
              <SelectItem value="Polled">Polled (Naturally Hornless)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="registered">Registration Status</Label>
          <Select 
            value={formData.registered ? "Registered" : "Unregistered"} 
            onValueChange={(value) => setFormData({ ...formData, registered: value === "Registered" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Registered">Registered</SelectItem>
              <SelectItem value="Unregistered">Unregistered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birth_type">Birth Type</Label>
          <Select value={formData.birth_type} onValueChange={(value: 'exact' | 'year') => setFormData({ ...formData, birth_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exact">Exact Date (Born on Farm)</SelectItem>
              <SelectItem value="year">Birth Year Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="birth_date">
            {formData.birth_type === 'exact' ? 'Birth Date' : 'Birth Year'}
          </Label>
          {formData.birth_type === 'exact' ? (
            <Input
              id="birth_date"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              required
            />
          ) : (
            <Input
              id="birth_date"
              type="number"
              min="1990"
              max={new Date().getFullYear()}
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              required
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dam">Dam (Mother)</Label>
          <Input
            id="dam"
            value={formData.dam}
            onChange={(e) => setFormData({ ...formData, dam: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="sire">Sire (Father)</Label>
          <Input
            id="sire"
            value={formData.sire}
            onChange={(e) => setFormData({ ...formData, sire: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div>
        <Label>Photos</Label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const photoPromises = files.map(file => {
                  return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                  });
                });
                
                Promise.all(photoPromises).then(photos => {
                  setFormData({ ...formData, photos: [...formData.photos, ...photos] });
                });
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>
          
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`${formData.name} photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                  </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Upload multiple photos of your goat. If no photos are uploaded, cute placeholder images will be used.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Add Goat
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

function EditGoatForm({ goat, onSubmit, onClose }: { goat: GoatRow; onSubmit: (goat: Database['public']['Tables']['goats']['Update']) => void; onClose: () => void }) {
  const [formData, setFormData] = useState(goat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      birth_date: formData.birth_date || null,
      birth_type: formData.birth_type,
      price: formData.price,
      registered: formData.registered,
      horn_status: formData.horn_status,
      dam: formData.dam || null,
      sire: formData.sire || null,
      bio: formData.bio,
      status: formData.status,
      photos: formData.photos
    });
    setFormData({
      name: "",
      type: "",
      birth_date: new Date().toISOString().split('T')[0], // Today's date as default
      birth_type: "exact" as 'exact' | 'year',
      price: 0,
      registered: false,
      horn_status: "Horned",
      dam: "",
      sire: "",
      bio: "",
      status: "Available",
      photos: [] as string[]
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dairy Doe">Dairy Doe</SelectItem>
              <SelectItem value="Breeding Buck">Breeding Buck</SelectItem>
              <SelectItem value="Kid">Kid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-hornStatus">Horn Status</Label>
          <Select value={formData.horn_status} onValueChange={(value) => setFormData({ ...formData, horn_status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Horned">Horned</SelectItem>
              <SelectItem value="Dehorned">Dehorned</SelectItem>
              <SelectItem value="Polled">Polled (Naturally Hornless)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-registered">Registration Status</Label>
          <Select 
            value={formData.registered ? "Registered" : "Unregistered"} 
            onValueChange={(value) => setFormData({ ...formData, registered: value === "Registered" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Registered">Registered</SelectItem>
              <SelectItem value="Unregistered">Unregistered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-birthType">Birth Type</Label>
          <Select value={formData.birth_type} onValueChange={(value: 'exact' | 'year') => setFormData({ ...formData, birth_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exact">Exact Date (Born on Farm)</SelectItem>
              <SelectItem value="year">Birth Year Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-birthDate">
            {formData.birth_type === 'exact' ? 'Birth Date' : 'Birth Year'}
          </Label>
          {formData.birth_type === 'exact' ? (
            <Input
              id="edit-birthDate"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={formData.birth_date || ''}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value || null })}
              required
            />
          ) : (
            <Input
              id="edit-birthDate"
              type="number"
              min="1990"
              max={new Date().getFullYear()}
              value={formData.birth_date || ''}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value || null })}
              required
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="edit-price">Price</Label>
        <Input
          id="edit-price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-dam">Dam (Mother)</Label>
          <Input
            id="edit-dam"
            value={formData.dam || ''}
            onChange={(e) => setFormData({ ...formData, dam: e.target.value || null })}
          />
        </div>
        <div>
          <Label htmlFor="edit-sire">Sire (Father)</Label>
          <Input
            id="edit-sire"
            value={formData.sire || ''}
            onChange={(e) => setFormData({ ...formData, sire: e.target.value || null })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-bio">Bio</Label>
        <Textarea
          id="edit-bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div>
        <Label>Photos</Label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const photoPromises = files.map(file => {
                  return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                  });
                });
                
                Promise.all(photoPromises).then(photos => {
                  setFormData({ ...formData, photos: [...formData.photos, ...photos] });
                });
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>
          
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`${formData.name} photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Upload multiple photos of your goat. If no photos are uploaded, cute placeholder images will be used.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Update Goat
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

function AddProductForm({ onSubmit }: { onSubmit: (product: Omit<Database['public']['Tables']['products']['Insert'], 'id' | 'created_at'>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    in_stock: true,
    featured: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      in_stock: formData.in_stock,
      featured: formData.featured
    });
    setFormData({
      name: "",
      category: "",
      price: 0,
      description: "",
      in_stock: true,
      featured: false
    });
    setShowAddProduct(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-name">Name</Label>
          <Input
            id="product-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="product-category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Soap">Soap</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Skincare">Skincare</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="product-price">Price</Label>
        <Input
          id="product-price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

function EditProductForm({ product, onSubmit }: { product: ProductRow; onSubmit: (product: Database['public']['Tables']['products']['Update']) => void }) {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      in_stock: formData.in_stock,
      featured: formData.featured
    });
    setFormData({
      name: "",
      category: "",
      price: 0,
      description: "",
      in_stock: true,
      featured: false
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-product-name">Name</Label>
          <Input
            id="edit-product-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-product-category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Soap">Soap</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Skincare">Skincare</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="edit-product-price">Price</Label>
        <Input
          id="edit-product-price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-product-description">Description</Label>
        <Textarea
          id="edit-product-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Update Product
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
