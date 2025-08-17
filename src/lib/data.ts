// Shared data for the farm website
export interface Goat {
  id: number;
  name: string;
  type: string;
  birthDate: string; // ISO date string or just year
  birthType: 'exact' | 'year'; // whether we have exact date or just year
  price: number;
  registered: boolean;
  hornStatus: string;
  dam?: string;
  sire?: string;
  bio: string;
  status: string;
  photos: string[]; // Array of photo URLs or base64 strings
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  featured: boolean;
}

// Initial goats data
export const initialGoats: Goat[] = [
  {
    id: 1,
    name: "Bella",
    type: "Dairy Doe",
    birthDate: "2022-03-15",
    birthType: "exact",
    price: 800,
    registered: true,
    hornStatus: "Horned",
    dam: "Luna",
    sire: "Thunder",
    bio: "Bella is a beautiful registered Nigerian Dwarf doe with excellent milk production. She's friendly, easy to handle, and has a sweet temperament. Perfect for a family looking to start their dairy goat journey.",
    status: "Available",
    photos: []
  },
  {
    id: 2,
    name: "Shadow",
    type: "Breeding Buck",
    birthDate: "2021",
    birthType: "year",
    price: 600,
    registered: false,
    hornStatus: "Dehorned",
    dam: "Unknown",
    sire: "Unknown",
    bio: "Shadow is a handsome unregistered buck with great genetics. He's proven and has sired healthy, friendly kids. Great addition to any herd.",
    status: "Available",
    photos: []
  },
  {
    id: 3,
    name: "Peanut",
    type: "Kid",
    birthDate: "2024-09-15",
    birthType: "exact",
    price: 400,
    registered: false,
    hornStatus: "Horned",
    dam: "Bella",
    sire: "Shadow",
    bio: "Peanut is an adorable kid with a playful personality. She's been handled since birth and is very friendly. Great starter goat for families.",
    status: "Reserved",
    photos: []
  },
  {
    id: 4,
    name: "Moon",
    type: "Dairy Doe",
    birthDate: "2023-06-20",
    birthType: "exact",
    price: 750,
    registered: true,
    hornStatus: "Polled",
    dam: "Stella",
    sire: "Shadow",
    bio: "Moon is a young registered doe with excellent conformation. She's just starting her milking career and shows great promise. Very gentle and easy to work with.",
    status: "Available",
    photos: []
  }
];

// Initial products data
export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Lavender Goat Milk Soap",
    category: "Soap",
    price: 6.50,
    description: "Handmade goat milk soap with lavender essential oil.",
    inStock: true,
    featured: true
  }
];

// Helper function to calculate goat age
export function getGoatAge(goat: Goat): string {
  if (goat.birthType === 'exact') {
    const birthDate = new Date(goat.birthDate);
    const today = new Date();
    let ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      ageInYears--;
    }
    
    if (ageInYears === 0) {
      const ageInMonths = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      return `${ageInMonths} months old`;
    }
    
    return `${ageInYears} years old`;
  } else {
    // Just year - calculate approximate age
    const currentYear = new Date().getFullYear();
    const ageInYears = currentYear - parseInt(goat.birthDate);
    return `${ageInYears} years old (approx)`;
  }
}

// Helper function to generate cute placeholder images
export function getGoatPlaceholder(goat: Goat): string {
  const placeholders = [
    "🐐", "🐑", "🦙", "🦌", "🐄", "🐖", "🐎", "🐓", "🦆", "🦢"
  ];
  // Use goat's name to consistently generate the same placeholder
  const index = goat.name.charCodeAt(0) % placeholders.length;
  return placeholders[index];
}
