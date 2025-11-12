"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, X, Plus } from "lucide-react";
import { Animal, AnimalHealthRecord } from "@/lib/db/schema";
import { ANIMAL_TYPES, getSubtypesForAnimalType } from "@/lib/animal-types";
import { PhotoUpload } from "./photo-upload";
import { useAnimals } from "@/lib/animal-context";

interface AddAnimalFormProps {
  defaultAnimalType?: string;
  onSubmit: (animal: Omit<Animal, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}

export function AddAnimalForm({ defaultAnimalType = 'Goat', onSubmit, onClose }: AddAnimalFormProps) {
  const [animalType, setAnimalType] = useState<string>(defaultAnimalType);
  const [formData, setFormData] = useState({
    name: "",
    animal_type: defaultAnimalType,
    type: "",
    birth_date: new Date().toISOString().split('T')[0],
    birth_type: "exact" as 'exact' | 'year',
    price: 0,
    is_for_sale: false,
    registered: false,
    horn_status: "",
    dam: "",
    sire: "",
    bio: "",
    status: "Active",
    photos: [] as string[],
    custom_fields: {} as Record<string, string | number | boolean | null>,
  });

  const animalTypeDef = ANIMAL_TYPES[animalType];
  const subtypes = getSubtypesForAnimalType(animalType);

  // Reset subtype when animal type changes
  useEffect(() => {
    if (subtypes.length > 0 && !subtypes.includes(formData.type)) {
      setFormData({ ...formData, type: subtypes[0] });
    }
  }, [animalType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate subtype if subtypes exist
    if (subtypes.length > 0 && !formData.type) {
      return; // Don't submit if subtype is required but not selected
    }
    
    const animalData: Omit<Animal, 'id' | 'created_at' | 'updated_at'> = {
      name: formData.name,
      animal_type: animalType,
      type: subtypes.length > 0 ? formData.type : "", // Use empty string if no subtypes
      birth_date: formData.birth_date || null,
      birth_type: formData.birth_type,
      price: String(formData.price),
      is_for_sale: formData.is_for_sale,
      registered: formData.registered,
      horn_status: animalType === 'Goat' ? (formData.horn_status || 'Horned') : null,
      dam: formData.dam || null,
      sire: formData.sire || null,
      bio: formData.bio,
      status: formData.status,
      photos: formData.photos,
      custom_fields: Object.keys(formData.custom_fields).length > 0 ? formData.custom_fields : null,
    };

    onSubmit(animalData);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="animal_type">Animal Type *</Label>
          <Select value={animalType} onValueChange={(value) => {
            setAnimalType(value);
            setFormData({ ...formData, animal_type: value, type: "" });
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ANIMAL_TYPES).map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {subtypes.length > 0 && (
          <div>
            <Label htmlFor="type">Subtype *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subtype" />
              </SelectTrigger>
              <SelectContent>
                {subtypes.map((subtype) => (
                  <SelectItem key={subtype} value={subtype}>
                    {subtype}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Animal name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birth_date">Birth Date</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="birth_type">Birth Type</Label>
          <Select
            value={formData.birth_type}
            onValueChange={(value: 'exact' | 'year') => setFormData({ ...formData, birth_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exact">Exact Date</SelectItem>
              <SelectItem value="year">Year Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {animalType === 'Goat' && (
        <div>
          <Label htmlFor="horn_status">Horn Status</Label>
          <Select
            value={formData.horn_status}
            onValueChange={(value) => setFormData({ ...formData, horn_status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select horn status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Horned">Horned</SelectItem>
              <SelectItem value="Polled">Polled</SelectItem>
              <SelectItem value="Disbudded">Disbudded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom fields based on animal type */}
      {animalTypeDef?.customFields && animalTypeDef.customFields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === 'text' && (
            <Input
              id={field.name}
              value={String(formData.custom_fields[field.name] || '')}
              onChange={(e) => setFormData({
                ...formData,
                custom_fields: { ...formData.custom_fields, [field.name]: e.target.value }
              })}
            />
          )}
          {field.type === 'number' && (
            <Input
              id={field.name}
              type="number"
              value={formData.custom_fields[field.name] != null ? String(formData.custom_fields[field.name]) : ''}
              onChange={(e) => setFormData({
                ...formData,
                custom_fields: { ...formData.custom_fields, [field.name]: parseFloat(e.target.value) || 0 }
              })}
            />
          )}
          {field.type === 'date' && (
            <Input
              id={field.name}
              type="date"
              value={formData.custom_fields[field.name] != null ? String(formData.custom_fields[field.name]) : ''}
              onChange={(e) => setFormData({
                ...formData,
                custom_fields: { ...formData.custom_fields, [field.name]: e.target.value }
              })}
            />
          )}
          {field.type === 'boolean' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={field.name}
                checked={Boolean(formData.custom_fields[field.name])}
                onChange={(e) => setFormData({
                  ...formData,
                  custom_fields: { ...formData.custom_fields, [field.name]: e.target.checked }
                })}
                className="h-4 w-4 text-fresh-sprout-green focus:ring-fresh-sprout-green border-gray-300 rounded"
              />
              <Label htmlFor={field.name}>{field.label}</Label>
            </div>
          )}
        </div>
      ))}

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
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          placeholder="Enter price"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_for_sale"
            checked={formData.is_for_sale}
            onChange={(e) => setFormData({ ...formData, is_for_sale: e.target.checked })}
            className="h-4 w-4 text-fresh-sprout-green focus:ring-fresh-sprout-green border-gray-300 rounded"
          />
          <Label htmlFor="is_for_sale">This animal is for sale</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="registered"
            checked={formData.registered}
            onChange={(e) => setFormData({ ...formData, registered: e.target.checked })}
            className="h-4 w-4 text-fresh-sprout-green focus:ring-fresh-sprout-green border-gray-300 rounded"
          />
          <Label htmlFor="registered">Registered</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
            <SelectItem value="Deceased">Deceased</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
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
        <Button type="submit" className="flex-1 bg-gradient-growth hover:opacity-90">
          <Save className="h-4 w-4 mr-2" />
          Add Animal
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
    </div>
  );
}

export function EditAnimalForm({
  animal,
  onSubmit,
  onClose,
}: {
  animal: Animal;
  onSubmit: (updates: Partial<Animal>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: animal.name,
    animal_type: animal.animal_type,
    type: animal.type,
    birth_date: animal.birth_date || new Date().toISOString().split('T')[0],
    birth_type: animal.birth_type,
    price: Number(animal.price || 0),
    is_for_sale: animal.is_for_sale,
    registered: animal.registered,
    horn_status: animal.horn_status || '',
    dam: animal.dam || '',
    sire: animal.sire || '',
    bio: animal.bio,
    status: animal.status,
    photos: animal.photos || [],
    custom_fields: (animal.custom_fields as Record<string, string | number | boolean | null>) || {},
  });

  const animalTypeDef = ANIMAL_TYPES[animal.animal_type];
  const subtypes = getSubtypesForAnimalType(animal.animal_type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      animal_type: formData.animal_type,
      type: formData.type,
      birth_date: formData.birth_date || null,
      birth_type: formData.birth_type,
      price: String(formData.price),
      is_for_sale: formData.is_for_sale,
      registered: formData.registered,
      horn_status: formData.animal_type === 'Goat' ? (formData.horn_status || null) : null,
      dam: formData.dam || null,
      sire: formData.sire || null,
      bio: formData.bio,
      status: formData.status,
      photos: formData.photos,
      custom_fields: Object.keys(formData.custom_fields).length > 0 ? formData.custom_fields : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Similar form fields as AddAnimalForm but with existing values */}
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Subtype *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subtypes.map((subtype) => (
              <SelectItem key={subtype} value={subtype}>
                {subtype}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birth_date">Birth Date</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="birth_type">Birth Type</Label>
          <Select
            value={formData.birth_type}
            onValueChange={(value: 'exact' | 'year') => setFormData({ ...formData, birth_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exact">Exact Date</SelectItem>
              <SelectItem value="year">Year Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.animal_type === 'Goat' && (
        <div>
          <Label htmlFor="horn_status">Horn Status</Label>
          <Select
            value={formData.horn_status}
            onValueChange={(value) => setFormData({ ...formData, horn_status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Horned">Horned</SelectItem>
              <SelectItem value="Polled">Polled</SelectItem>
              <SelectItem value="Disbudded">Disbudded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom fields */}
      {animalTypeDef?.customFields && animalTypeDef.customFields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === 'text' && (
            <Input
              id={field.name}
              value={String(formData.custom_fields[field.name] || '')}
              onChange={(e) => setFormData({
                ...formData,
                custom_fields: { ...formData.custom_fields, [field.name]: e.target.value }
              })}
            />
          )}
          {field.type === 'number' && (
            <Input
              id={field.name}
              type="number"
              value={formData.custom_fields[field.name] != null ? String(formData.custom_fields[field.name]) : ''}
              onChange={(e) => setFormData({
                ...formData,
                custom_fields: { ...formData.custom_fields, [field.name]: parseFloat(e.target.value) || 0 }
              })}
            />
          )}
          {field.type === 'date' && (
            <Input
              id={field.name}
              type="date"
              value={formData.custom_fields[field.name] != null ? String(formData.custom_fields[field.name]) : ''}
              onChange={(e) => setFormData({
                ...formData,
                custom_fields: { ...formData.custom_fields, [field.name]: e.target.value }
              })}
            />
          )}
          {field.type === 'boolean' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={field.name}
                checked={Boolean(formData.custom_fields[field.name])}
                onChange={(e) => setFormData({
                  ...formData,
                  custom_fields: { ...formData.custom_fields, [field.name]: e.target.checked }
                })}
                className="h-4 w-4 text-fresh-sprout-green focus:ring-fresh-sprout-green border-gray-300 rounded"
              />
              <Label htmlFor={field.name}>{field.label}</Label>
            </div>
          )}
        </div>
      ))}

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
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_for_sale"
            checked={formData.is_for_sale}
            onChange={(e) => setFormData({ ...formData, is_for_sale: e.target.checked })}
            className="h-4 w-4 text-fresh-sprout-green focus:ring-fresh-sprout-green border-gray-300 rounded"
          />
          <Label htmlFor="is_for_sale">This animal is for sale</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="registered"
            checked={formData.registered}
            onChange={(e) => setFormData({ ...formData, registered: e.target.checked })}
            className="h-4 w-4 text-fresh-sprout-green focus:ring-fresh-sprout-green border-gray-300 rounded"
          />
          <Label htmlFor="registered">Registered</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
            <SelectItem value="Deceased">Deceased</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
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
        <Button type="submit" className="flex-1 bg-gradient-growth hover:opacity-90">
          <Save className="h-4 w-4 mr-2" />
          Update Animal
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function AnimalHealthRecords({ animalId }: { animalId: number }) {
  const animalContext = useAnimals();
  const [records, setRecords] = useState<AnimalHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [animalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRecords = async () => {
    setLoading(true);
    const healthRecords = await animalContext.getAnimalHealthRecords(animalId);
    setRecords(healthRecords);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading health records...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Health Records</h3>
        <Button onClick={() => setShowAddRecord(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {showAddRecord && (
        <AddHealthRecordForm
          animalId={animalId}
          onSubmit={async () => {
            await loadRecords();
            setShowAddRecord(false);
          }}
          onClose={() => setShowAddRecord(false)}
        />
      )}

      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No health records yet. Click "Add Record" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <CardDescription>
                      {new Date(record.record_date).toLocaleDateString()} • {record.record_type}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{record.record_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {record.description && <p className="text-gray-600 mb-2">{record.description}</p>}
                {record.veterinarian && (
                  <p className="text-sm text-gray-500 mb-2">Veterinarian: {record.veterinarian}</p>
                )}
                {record.medications && record.medications.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Medications:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {record.medications.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.cost && (
                  <p className="text-sm text-gray-600">Cost: ${Number(record.cost).toFixed(2)}</p>
                )}
                {record.next_due_date && (
                  <p className="text-sm text-fresh-sprout-green">
                    Next due: {new Date(record.next_due_date).toLocaleDateString()}
                  </p>
                )}
                {record.notes && (
                  <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddHealthRecordForm({
  animalId,
  onSubmit,
  onClose,
}: {
  animalId: number;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    record_date: new Date().toISOString().split('T')[0],
    record_type: 'Health Check',
    title: '',
    description: '',
    veterinarian: '',
    medications: [] as string[],
    cost: '',
    next_due_date: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/animals/${animalId}/health-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          next_due_date: formData.next_due_date || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create health record');
      }

      onSubmit();
    } catch (error) {
      console.error('Error creating health record:', error);
      alert('Failed to create health record');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Health Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="record_date">Record Date *</Label>
            <Input
              id="record_date"
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="record_type">Record Type *</Label>
            <Select
              value={formData.record_type}
              onValueChange={(value) => setFormData({ ...formData, record_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vaccination">Vaccination</SelectItem>
                <SelectItem value="Health Check">Health Check</SelectItem>
                <SelectItem value="Treatment">Treatment</SelectItem>
                <SelectItem value="Injury">Injury</SelectItem>
                <SelectItem value="Illness">Illness</SelectItem>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="De-worming">De-worming</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Annual vaccination"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="veterinarian">Veterinarian</Label>
            <Input
              id="veterinarian"
              value={formData.veterinarian}
              onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
              placeholder="Vet name or clinic"
            />
          </div>

          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="next_due_date">Next Due Date</Label>
            <Input
              id="next_due_date"
              type="date"
              value={formData.next_due_date}
              onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Add Record
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function AnimalGrazingHistory({ animalId }: { animalId: number }) {
  const animalContext = useAnimals();
  const [history, setHistory] = useState<Array<{
    id: number;
    pasture_id: number;
    pasture_name: string | null;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    animal_type: string;
    animal_count: number | null;
    grazing_pressure: string | null;
    pasture_quality_start: number | null;
    pasture_quality_end: number | null;
    notes: string | null;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [animalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistory = async () => {
    setLoading(true);
    const grazingHistory = await animalContext.getAnimalGrazingHistory(animalId);
    // Map API response to include pasture_name (which may not be in the response)
    setHistory(grazingHistory.map((item: any) => ({
      ...item,
      pasture_name: item.pasture_name || null,
      created_at: item.created_at instanceof Date ? item.created_at.toISOString() : String(item.created_at || ''),
    })));
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading grazing history...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Grazing History</h3>

      {history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No grazing history recorded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((rotation) => (
            <Card key={rotation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{rotation.pasture_name || 'Unknown Pasture'}</CardTitle>
                    <CardDescription>
                      {new Date(rotation.start_date).toLocaleDateString()}
                      {rotation.end_date && ` - ${new Date(rotation.end_date).toLocaleDateString()}`}
                      {rotation.is_current && <Badge className="ml-2">Current</Badge>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {rotation.notes && <p className="text-gray-600">{rotation.notes}</p>}
                {rotation.grazing_pressure && (
                  <p className="text-sm text-gray-500">Grazing Pressure: {rotation.grazing_pressure}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

