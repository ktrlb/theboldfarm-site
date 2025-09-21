// Shared data for the farm website
import { Database } from './supabase';

type GoatRow = Database['public']['Tables']['goats']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];

// Initial goats data using Supabase types
export const initialGoats: Omit<GoatRow, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: "Bella",
    type: "Dairy Doe",
    birth_date: "2022-03-15",
    birth_type: "exact",
    price: 800,
    is_for_sale: true,
    registered: true,
    horn_status: "Horned",
    dam: "Luna",
    sire: "Thunder",
    bio: "Bella is a beautiful registered Nigerian Dwarf doe with excellent milk production. She's friendly, easy to handle, and has a sweet temperament. Perfect for a family looking to start their dairy goat journey.",
    status: "Available",
    photos: []
  },
  {
    name: "Shadow",
    type: "Breeding Buck",
    birth_date: "2021",
    birth_type: "year",
    price: 600,
    is_for_sale: true,
    registered: false,
    horn_status: "Dehorned",
    dam: "Unknown",
    sire: "Unknown",
    bio: "Shadow is a handsome unregistered buck with great genetics. He's proven and has sired healthy, friendly kids. Great addition to any herd.",
    status: "Available",
    photos: []
  },
  {
    name: "Peanut",
    type: "Doeling Kid",
    birth_date: "2024-09-15",
    birth_type: "exact",
    price: 400,
    is_for_sale: true,
    registered: false,
    horn_status: "Horned",
    dam: "Bella",
    sire: "Shadow",
    bio: "Peanut is an adorable doeling kid with a playful personality. She's been handled since birth and is very friendly. Great starter goat for families.",
    status: "Reserved",
    photos: []
  },
  {
    name: "Moon",
    type: "Dairy Doe",
    birth_date: "2023-06-20",
    birth_type: "exact",
    price: 750,
    is_for_sale: true,
    registered: true,
    horn_status: "Polled",
    dam: "Stella",
    sire: "Shadow",
    bio: "Moon is a young registered doe with excellent conformation. She's just starting her milking career and shows great promise. Very gentle and easy to work with.",
    status: "Available",
    photos: []
  },
  {
    name: "Chip",
    type: "Wether",
    birth_date: "2023-04-10",
    birth_type: "exact",
    price: 300,
    is_for_sale: true,
    registered: false,
    horn_status: "Polled",
    dam: "Luna",
    sire: "Shadow",
    bio: "Chip is a sweet, gentle wether perfect for pet homes. He's great with kids and other animals. Very friendly and loves attention.",
    status: "Available",
    photos: []
  },
  {
    name: "Storm",
    type: "Buckling Kid",
    birth_date: "2024-08-20",
    birth_type: "exact",
    price: 350,
    is_for_sale: true,
    registered: false,
    horn_status: "Horned",
    dam: "Moon",
    sire: "Shadow",
    bio: "Storm is a handsome buckling kid with great conformation. He's playful and friendly, perfect for someone looking to start their own breeding program.",
    status: "Available",
    photos: []
  },
  {
    name: "Princess",
    type: "Pet Only Doe",
    birth_date: "2022-11-05",
    birth_type: "exact",
    price: 450,
    is_for_sale: true,
    registered: false,
    horn_status: "Dehorned",
    dam: "Luna",
    sire: "Shadow",
    bio: "Princess is a sweet, gentle doe perfect for pet homes. She's very friendly, loves attention, and gets along well with children and other animals.",
    status: "Available",
    photos: []
  }
];

// Initial products data using Supabase types
export const initialProducts: Omit<ProductRow, 'id' | 'created_at'>[] = [
  {
    name: "Lavender Goat Milk Soap",
    category: "Soap",
    price: 6.50,
    description: "Handmade goat milk soap with lavender essential oil.",
    in_stock: true,
    featured: true,
    photos: []
  }
];

// Helper function to calculate goat age using Supabase types
export function getGoatAge(goat: GoatRow): string {
  if (goat.birth_type === 'exact' && goat.birth_date) {
    const birthDate = new Date(goat.birth_date);
    
    // Validate the date
    if (isNaN(birthDate.getTime())) {
      return "Age unknown";
    }
    
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
    const birthYear = parseInt(goat.birth_date || currentYear.toString());
    
    // Validate the year
    if (isNaN(birthYear) || birthYear > currentYear) {
      return "Age unknown";
    }
    
    const ageInYears = currentYear - birthYear;
    if (ageInYears === 0) {
      return "Less than 1 year old (approx)";
    } else if (ageInYears === 1) {
      return "1 year old (approx)";
    } else {
      return `${ageInYears} years old (approx)`;
    }
  }
}

// Helper function to generate cute placeholder images
export function getGoatPlaceholder(goat: GoatRow): string {
  const placeholders = [
    "🐐", "🐑", "🦙", "🦌", "🐄", "🐖", "🐎", "🐓", "🦆", "🦢"
  ];
  // Use goat's name to consistently generate the same placeholder
  const index = goat.name.charCodeAt(0) % placeholders.length;
  return placeholders[index];
}

// Helper function to check if a goat is for sale
export function isGoatForSale(goat: GoatRow): boolean {
  // Since we've updated the schema, all goats should have is_for_sale
  return goat.is_for_sale;
}

// Helper function to get goats for sale
export function getGoatsForSale(goats: GoatRow[]): GoatRow[] {
  return goats.filter(isGoatForSale);
}

// Helper function to get all goats (for sale or not)
export function getAllGoats(goats: GoatRow[]): GoatRow[] {
  return goats;
}

// Export the Supabase types for use in other components
export type { GoatRow, ProductRow };
