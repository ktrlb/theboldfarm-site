"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Heart, Calendar } from "lucide-react";
import { useAnimals } from "@/lib/animal-context";
import { Animal } from "@/lib/db/schema";
import { getAnimalTypes } from "@/lib/animal-types";
import { AddAnimalForm, EditAnimalForm, AnimalHealthRecords, AnimalGrazingHistory } from "./animal-forms";

export function AnimalManagementSection() {
  const { loading, getAnimalsByType, addAnimal, updateAnimal, deleteAnimal, refreshData } = useAnimals();
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>("Goat");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [showHealthRecords, setShowHealthRecords] = useState(false);
  const [showGrazingHistory, setShowGrazingHistory] = useState(false);

  const animalTypes = getAnimalTypes();
  const filteredAnimals = getAnimalsByType(selectedAnimalType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Animal Management</h2>
          <p className="text-gray-600 mt-1">Manage all your farm animals - goats, cows, horses, and more</p>
        </div>
        <Dialog open={showAddAnimal} onOpenChange={setShowAddAnimal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-growth hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Animal</DialogTitle>
              <DialogDescription>Add a new animal to your farm</DialogDescription>
            </DialogHeader>
            <AddAnimalForm 
              defaultAnimalType={selectedAnimalType}
              onSubmit={async (animal) => {
                await addAnimal(animal);
                await refreshData();
                setShowAddAnimal(false);
              }} 
              onClose={() => setShowAddAnimal(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Animal Type Tabs */}
      <Tabs value={selectedAnimalType} onValueChange={setSelectedAnimalType}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {animalTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.name}
              <Badge className="ml-2 bg-gradient-growth text-white">
                {getAnimalsByType(type.id).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {animalTypes.map((animalType) => (
          <TabsContent key={animalType.id} value={animalType.id}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fresh-sprout-green mx-auto mb-4"></div>
                <p className="text-gray-600">Loading {animalType.name.toLowerCase()}s...</p>
              </div>
            ) : filteredAnimals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600">No {animalType.name.toLowerCase()}s added yet. Click "Add New Animal" to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <AnimalGrid 
                animals={filteredAnimals}
                animalType={animalType}
                onSelectAnimal={setSelectedAnimal}
                onShowHealthRecords={(animal) => {
                  setSelectedAnimal(animal);
                  setShowHealthRecords(true);
                }}
                onShowGrazingHistory={(animal) => {
                  setSelectedAnimal(animal);
                  setShowGrazingHistory(true);
                }}
                onDeleteAnimal={async (animal) => {
                  await deleteAnimal(animal.id);
                  await refreshData();
                }}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Health Records Dialog */}
      {selectedAnimal && showHealthRecords && (
        <Dialog open={showHealthRecords} onOpenChange={setShowHealthRecords}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Health Records - {selectedAnimal.name}</DialogTitle>
              <DialogDescription>View and manage health records for this animal</DialogDescription>
            </DialogHeader>
            <AnimalHealthRecords animalId={selectedAnimal.id} />
          </DialogContent>
        </Dialog>
      )}

      {/* Grazing History Dialog */}
      {selectedAnimal && showGrazingHistory && (
        <Dialog open={showGrazingHistory} onOpenChange={setShowGrazingHistory}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Grazing History - {selectedAnimal.name}</DialogTitle>
              <DialogDescription>View grazing history for this animal</DialogDescription>
            </DialogHeader>
            <AnimalGrazingHistory animalId={selectedAnimal.id} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Animal Dialog */}
      {selectedAnimal && !showHealthRecords && !showGrazingHistory && (
        <Dialog open={!!selectedAnimal} onOpenChange={(open) => !open && setSelectedAnimal(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Animal</DialogTitle>
              <DialogDescription>Update animal information</DialogDescription>
            </DialogHeader>
            <EditAnimalForm 
              animal={selectedAnimal} 
              onSubmit={async (updates) => {
                await updateAnimal(selectedAnimal.id, updates);
                await refreshData();
                setSelectedAnimal(null);
              }} 
              onClose={() => setSelectedAnimal(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AnimalGrid({
  animals,
  animalType: _animalType,
  onSelectAnimal,
  onShowHealthRecords,
  onShowGrazingHistory,
  onDeleteAnimal,
}: {
  animals: Animal[];
  animalType: { id: string; name: string };
  onSelectAnimal: (animal: Animal) => void;
  onShowHealthRecords: (animal: Animal) => void;
  onShowGrazingHistory: (animal: Animal) => void;
  onDeleteAnimal: (animal: Animal) => Promise<void>;
}) {

  const handleDelete = async (animal: Animal) => {
    if (confirm(`Are you sure you want to delete ${animal.name}?`)) {
      await onDeleteAnimal(animal);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {animals.map((animal) => (
        <Card key={animal.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{animal.name}</CardTitle>
                <CardDescription>{animal.type}</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowHealthRecords(animal)}
                  title="Health Records"
                >
                  <Heart className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowGrazingHistory(animal)}
                  title="Grazing History"
                >
                  <Calendar className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectAnimal(animal)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(animal)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {animal.photos && animal.photos.length > 0 ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={animal.photos[0]}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-lg mb-4 bg-gradient-golden-hour border border-gray-200 flex items-center justify-center text-6xl">
                {getAnimalPlaceholder(animal)}
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{animal.status}</Badge>
                {animal.is_for_sale && (
                  <Badge className="bg-gradient-growth text-white">
                    ${Number(animal.price || 0).toFixed(2)}
                  </Badge>
                )}
              </div>
              {animal.bio && (
                <p className="text-gray-600 line-clamp-3">{animal.bio}</p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowHealthRecords(animal)}
                  className="flex-1"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Health
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowGrazingHistory(animal)}
                  className="flex-1"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getAnimalPlaceholder(animal: Animal): string {
  switch (animal.animal_type) {
    case 'Goat':
      return '🐐';
    case 'Cow':
      return '🐄';
    case 'Horse':
      return '🐴';
    case 'Chicken':
      return '🐔';
    default:
      return '🐾';
  }
}

