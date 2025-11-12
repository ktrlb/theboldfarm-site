// Page section definitions - safe to import in client components
export interface PageSection {
  id: string;
  name: string;
  description: string;
  page: string;
  section: string;
}

export const PAGE_SECTIONS: PageSection[] = [
  {
    id: 'home-hero',
    name: 'Home Page Hero',
    description: 'Large hero image at the top of the home page. Should be visually striking with good contrast for text overlay.',
    page: 'Home',
    section: 'Hero',
  },
  {
    id: 'home-cta',
    name: 'Home Page CTA',
    description: 'Call-to-action section near the bottom of the home page. Should complement the hero image.',
    page: 'Home',
    section: 'CTA',
  },
  {
    id: 'home-feature-goats',
    name: 'Home - Goats Feature',
    description: 'Image for the Nigerian Dwarf Goats feature card on the home page.',
    page: 'Home',
    section: 'Features',
  },
  {
    id: 'home-feature-cows',
    name: 'Home - Cows Feature',
    description: 'Image for the Family Cows feature card on the home page.',
    page: 'Home',
    section: 'Features',
  },
  {
    id: 'home-feature-chickens',
    name: 'Home - Chickens Feature',
    description: 'Image for the Fresh Eggs feature card on the home page.',
    page: 'Home',
    section: 'Features',
  },
  {
    id: 'home-feature-products',
    name: 'Home - Products Feature',
    description: 'Image for the Homestead Products feature card on the home page.',
    page: 'Home',
    section: 'Features',
  },
  {
    id: 'about-hero',
    name: 'About Page Hero',
    description: 'Hero image for the About page. Should reflect the farm\'s values and story.',
    page: 'About',
    section: 'Hero',
  },
  {
    id: 'about-story',
    name: 'About - Story Section',
    description: 'Image for the "Our Story" section on the About page.',
    page: 'About',
    section: 'Story',
  },
  {
    id: 'goats-hero',
    name: 'Goats Page Hero',
    description: 'Hero image for the Goats for Sale page. Should feature goats prominently.',
    page: 'Goats',
    section: 'Hero',
  },
  {
    id: 'animals-hero',
    name: 'Animals Page Hero',
    description: 'Hero image for the Animals page. Should showcase the farm\'s animals.',
    page: 'Animals',
    section: 'Hero',
  },
  {
    id: 'shop-hero',
    name: 'Shop Page Hero',
    description: 'Hero image for the Shop page. Should feature farm products.',
    page: 'Shop',
    section: 'Hero',
  },
  {
    id: 'contact-hero',
    name: 'Contact Page Hero',
    description: 'Hero image for the Contact page. Should be welcoming and friendly.',
    page: 'Contact',
    section: 'Hero',
  },
];

