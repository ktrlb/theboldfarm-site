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
import { useDatabase } from "@/lib/database-context";
import { Database } from "@/lib/database-types";
import { PhotoUpload } from "@/components/photo-upload";

interface AdminPanelProps {
  onLogout?: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const { goats, products, addGoat, updateGoat, deleteGoat, addProduct, updateProduct, deleteProduct, loading, error } = useDatabase();

  const [editingGoat, setEditingGoat] = useState<GoatRow | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showAddGoat, setShowAddGoat] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAddGoat = async (goat: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>) => {
    // Convert to new Animal format with required fields
    await addGoat({
      ...goat,
      animal_type: 'Goat',
      custom_fields: {}, // GoatRow doesn't have custom_fields, use empty object
      price: String(goat.price || 0), // Convert number to string for Animal type
    });
    setShowAddGoat(false);
  };

  const handleUpdateGoat = async (id: number, updates: Partial<Database['public']['Tables']['goats']['Update']>) => {
    // Convert updates to Animal format if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const animalUpdates: Partial<any> = {
      ...updates,
      ...(updates.price !== undefined && { price: String(updates.price) }),
    };
    await updateGoat(id, animalUpdates);
    setEditingGoat(null);
  };

  const handleDeleteGoat = async (id: number) => {
    await deleteGoat(id);
  };

  const handleAddProduct = async (product: Omit<ProductRow, 'id' | 'created_at'>) => {
    await addProduct(product);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = async (id: number, updates: Partial<Database['public']['Tables']['products']['Update']>) => {
    await updateProduct(id, updates);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">


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
              <DialogContent className="max-w-2xl max-h-[90vh] bg-white border-2 border-gray-200 shadow-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Add New Goat</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Enter the details for the new goat.
                  </DialogDescription>
                </DialogHeader>
                <AddGoatForm onSubmit={handleAddGoat} onClose={() => setShowAddGoat(false)} />
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
                      {goat.type} • {getGoatAge(goat)} • {goat.horn_status} • {goat.is_for_sale ? `$${goat.price}` : 'Not for Sale'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGoat({
                        ...goat,
                        price: Number(goat.price || 0),
                        created_at: goat.created_at instanceof Date ? goat.created_at.toISOString() : String(goat.created_at),
                        updated_at: goat.updated_at instanceof Date ? goat.updated_at.toISOString() : String(goat.updated_at),
                      } as unknown as GoatRow)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGoat(goat.id)}
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
              <DialogContent className="max-w-2xl max-h-[90vh] bg-white border-2 border-gray-200 shadow-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Add New Product</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Enter the details for the new product.
                  </DialogDescription>
                </DialogHeader>
                <AddProductForm onSubmit={handleAddProduct} onClose={() => setShowAddProduct(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {/* Product Icon */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl">🛍️</span>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category} • ${product.price}</p>
                    <p className="text-xs text-gray-500">{product.description.substring(0, 60)}...</p>
                    <div className="flex gap-2 mt-1">
                      {product.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.in_stock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
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
                    onClick={() => handleDeleteProduct(product.id)}
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
          <DialogContent className="max-w-2xl max-h-[90vh] bg-white border-2 border-gray-200 shadow-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Goat</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the goat's information.
              </DialogDescription>
            </DialogHeader>
            <EditGoatForm goat={editingGoat} onSubmit={(updates) => handleUpdateGoat(editingGoat!.id, updates)} onClose={() => setEditingGoat(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] bg-white border-2 border-gray-200 shadow-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Edit Product</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the product's information.
              </DialogDescription>
            </DialogHeader>
            <EditProductForm product={editingProduct} onSubmit={(updates) => handleUpdateProduct(editingProduct!.id, updates)} onClose={() => setEditingProduct(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function AddGoatForm({ onSubmit, onClose }: { onSubmit: (goat: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    birth_date: new Date().toISOString().split('T')[0], // Today's date as default
    birth_type: "exact" as 'exact' | 'year',
    price: 0,
    is_for_sale: false,
    registered: false,
    horn_status: "Horned",
    dam: "",
    sire: "",
    bio: "",
    status: "Available",
    photos: [] as string[]
  } as {
    name: string;
    type: string;
    birth_date: string;
    birth_type: 'exact' | 'year';
    price: number;
    is_for_sale: boolean;
    registered: boolean;
    horn_status: string;
    dam: string;
    sire: string;
    bio: string;
    status: string;
    photos: string[];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      birth_date: formData.birth_date && formData.birth_date.trim() !== '' 
        ? (formData.birth_type === 'year' 
          ? `${String(formData.birth_date)}-01-01` // Convert year to full date
          : String(formData.birth_date))
        : null,
      birth_type: formData.birth_type,
      price: Number(formData.price) || 0,
      is_for_sale: formData.is_for_sale,
      registered: formData.registered,
      horn_status: formData.horn_status,
      dam: formData.dam && formData.dam.trim() !== '' ? String(formData.dam) : null,
      sire: formData.sire && formData.sire.trim() !== '' ? String(formData.sire) : null,
      bio: formData.bio,
      status: formData.status,
      photos: Array.isArray(formData.photos) ? formData.photos : []
    });
    setFormData({
      name: "",
      type: "",
      birth_date: new Date().toISOString().split('T')[0], // Today's date as default
      birth_type: "exact" as 'exact' | 'year',
      price: 0,
      is_for_sale: false,
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
              <SelectItem value="Doeling Kid">Doeling Kid</SelectItem>
              <SelectItem value="Buckling Kid">Buckling Kid</SelectItem>
              <SelectItem value="Wether">Wether</SelectItem>
              <SelectItem value="Pet Only Doe">Pet Only Doe</SelectItem>
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
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value.toString() })}
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
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
          placeholder="Enter price"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_for_sale"
          checked={Boolean(formData.is_for_sale)}
          onChange={(e) => {
            console.log('Checkbox changed:', e.target.checked);
            setFormData({ ...formData, is_for_sale: e.target.checked });
          }}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <Label htmlFor="is_for_sale" className="text-sm font-medium text-gray-700">
          This goat is for sale
        </Label>
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
        <PhotoUpload 
          photos={formData.photos}
          onPhotosChange={(photos) => setFormData({ ...formData, photos })}
          maxPhotos={10}
        />
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

export function EditGoatForm({ goat, onSubmit, onClose }: { goat: GoatRow; onSubmit: (goat: Database['public']['Tables']['goats']['Update']) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: goat.name,
    type: goat.type,
    birth_date: goat.birth_date 
      ? (goat.birth_type === 'year' 
        ? goat.birth_date.substring(0, 4) // Extract year from date
        : goat.birth_date)
      : "",
    birth_type: goat.birth_type,
    price: goat.price || 0,
    is_for_sale: goat.is_for_sale || false,
    registered: goat.registered,
    horn_status: goat.horn_status,
    dam: goat.dam || "",
    sire: goat.sire || "",
    bio: goat.bio,
    status: goat.status,
    photos: goat.photos
  } as {
    name: string;
    type: string;
    birth_date: string | null;
    birth_type: 'exact' | 'year';
    price: number;
    is_for_sale: boolean;
    registered: boolean;
    horn_status: string;
    dam: string | null;
    sire: string | null;
    bio: string;
    status: string;
    photos: string[];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      birth_date: formData.birth_date && formData.birth_date.trim() !== '' 
        ? (formData.birth_type === 'year' 
          ? `${String(formData.birth_date)}-01-01` // Convert year to full date
          : String(formData.birth_date))
        : null,
      birth_type: formData.birth_type,
      price: Number(formData.price) || 0,
      is_for_sale: formData.is_for_sale,
      registered: formData.registered,
      horn_status: formData.horn_status,
      dam: formData.dam && formData.dam.trim() !== '' ? String(formData.dam) : null,
      sire: formData.sire && formData.sire.trim() !== '' ? String(formData.sire) : null,
      bio: formData.bio,
      status: formData.status,
      photos: Array.isArray(formData.photos) ? formData.photos : []
    });
    setFormData({
      name: "",
      type: "",
      birth_date: new Date().toISOString().split('T')[0], // Today's date as default
      birth_type: "exact" as 'exact' | 'year',
      price: 0,
      is_for_sale: false,
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
              <SelectItem value="Doeling Kid">Doeling Kid</SelectItem>
              <SelectItem value="Buckling Kid">Buckling Kid</SelectItem>
              <SelectItem value="Wether">Wether</SelectItem>
              <SelectItem value="Pet Only Doe">Pet Only Doe</SelectItem>
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
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
          placeholder="Enter price"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="edit-is_for_sale"
          checked={Boolean(formData.is_for_sale)}
          onChange={(e) => {
            console.log('Edit checkbox changed:', e.target.checked);
            setFormData({ ...formData, is_for_sale: e.target.checked });
          }}
          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <Label htmlFor="edit-is_for_sale" className="text-sm font-medium text-gray-700">
          This goat is for sale
        </Label>
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
        />
      </div>

      <div>
        <Label>Photos</Label>
        <PhotoUpload 
          photos={formData.photos}
          onPhotosChange={(photos) => setFormData({ ...formData, photos })}
          maxPhotos={10}
        />
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

export function AddProductForm({ onSubmit, onClose }: { onSubmit: (product: Omit<ProductRow, 'id' | 'created_at'>) => void; onClose: () => void }) {
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
      price: Number(formData.price) || 0,
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
    onClose();
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
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              <SelectItem value="Jewelry">Jewelry</SelectItem>
              <SelectItem value="Candles">Candles</SelectItem>
              <SelectItem value="Bath & Body">Bath & Body</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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

export function EditProductForm({ product, onSubmit, onClose }: { product: ProductRow; onSubmit: (product: Database['public']['Tables']['products']['Update']) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    in_stock: product.in_stock,
    featured: product.featured
  } as {
    name: string;
    category: string;
    price: number;
    description: string;
    in_stock: boolean;
    featured: boolean;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price) || 0,
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
    onClose();
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
              <SelectItem value="Home & Garden">Home & Garden</SelectItem>
              <SelectItem value="Jewelry">Jewelry</SelectItem>
              <SelectItem value="Candles">Candles</SelectItem>
              <SelectItem value="Bath & Body">Bath & Body</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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
