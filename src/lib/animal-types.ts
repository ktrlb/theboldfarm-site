// Animal type definitions and subtypes
export interface AnimalTypeDefinition {
  id: string;
  name: string;
  subtypes: string[];
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean';
    label: string;
    required?: boolean;
  }>;
}

export const ANIMAL_TYPES: Record<string, AnimalTypeDefinition> = {
  Goat: {
    id: 'Goat',
    name: 'Goat',
    subtypes: [
      'Dairy Doe',
      'Breeding Buck',
      'Doeling Kid',
      'Buckling Kid',
      'Wether',
      'Pet Only Doe',
    ],
    customFields: [
      { name: 'breed', type: 'text', label: 'Breed', required: false },
      { name: 'coat_color', type: 'text', label: 'Coat Color', required: false },
      { name: 'weight', type: 'number', label: 'Weight (lbs)', required: false },
    ],
  },
  Cow: {
    id: 'Cow',
    name: 'Cow',
    subtypes: [
      'Dairy Cow',
      'Beef Cow',
      'Heifer',
      'Bull',
      'Steer',
      'Calf',
    ],
    customFields: [
      { name: 'breed', type: 'text', label: 'Breed', required: false },
      { name: 'weight', type: 'number', label: 'Weight (lbs)', required: false },
      { name: 'ear_tag', type: 'text', label: 'Ear Tag Number', required: false },
    ],
  },
  Horse: {
    id: 'Horse',
    name: 'Horse',
    subtypes: [
      'Mare',
      'Stallion',
      'Gelding',
      'Foal',
      'Yearling',
    ],
    customFields: [
      { name: 'breed', type: 'text', label: 'Breed', required: false },
      { name: 'color', type: 'text', label: 'Color', required: false },
      { name: 'height', type: 'number', label: 'Height (hands)', required: false },
      { name: 'weight', type: 'number', label: 'Weight (lbs)', required: false },
    ],
  },
  Chicken: {
    id: 'Chicken',
    name: 'Chicken',
    subtypes: [
      'Laying Hen',
      'Rooster',
      'Pullet',
      'Cockerel',
      'Chick',
    ],
    customFields: [
      { name: 'breed', type: 'text', label: 'Breed', required: false },
      { name: 'egg_color', type: 'text', label: 'Egg Color', required: false },
    ],
  },
  Dog: {
    id: 'Dog',
    name: 'Dog',
    subtypes: [
      'Adult Dog',
      'Puppy',
      'Senior Dog',
      'Working Dog',
      'Pet Dog',
    ],
    customFields: [
      { name: 'breed', type: 'text', label: 'Breed', required: false },
      { name: 'weight', type: 'number', label: 'Weight (lbs)', required: false },
      { name: 'color', type: 'text', label: 'Color/Markings', required: false },
    ],
  },
  Cat: {
    id: 'Cat',
    name: 'Cat',
    subtypes: [
      'Adult Cat',
      'Kitten',
      'Senior Cat',
      'Indoor Cat',
      'Outdoor Cat',
    ],
    customFields: [
      { name: 'breed', type: 'text', label: 'Breed', required: false },
      { name: 'weight', type: 'number', label: 'Weight (lbs)', required: false },
      { name: 'color', type: 'text', label: 'Color/Markings', required: false },
    ],
  },
};

export function getAnimalTypes(): AnimalTypeDefinition[] {
  return Object.values(ANIMAL_TYPES);
}

export function getAnimalType(typeId: string): AnimalTypeDefinition | undefined {
  return ANIMAL_TYPES[typeId];
}

export function getSubtypesForAnimalType(animalType: string): string[] {
  return ANIMAL_TYPES[animalType]?.subtypes || [];
}

