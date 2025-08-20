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
    type: "Kid",
    birth_date: "2024-09-15",
    birth_type: "exact",
    price: 400,
    registered: false,
    horn_status: "Horned",
    dam: "Bella",
    sire: "Shadow",
    bio: "Peanut is an adorable kid with a playful personality. She's been handled since birth and is very friendly. Great starter goat for families.",
    status: "Reserved",
    photos: []
  },
  {
    name: "Moon",
    type: "Dairy Doe",
    birth_date: "2023-06-20",
    birth_type: "exact",
    price: 750,
    registered: true,
    horn_status: "Polled",
    dam: "Stella",
    sire: "Shadow",
    bio: "Moon is a young registered doe with excellent conformation. She's just starting her milking career and shows great promise. Very gentle and easy to work with.",
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
    const ageInYears = currentYear - parseInt(goat.birth_date || currentYear.toString());
    return `${ageInYears} years old (approx)`;
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

// Export the Supabase types for use in other components
export type { GoatRow, ProductRow };
