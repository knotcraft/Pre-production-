import { PlaceHolderImages, ImagePlaceholder } from './placeholder-images';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  location: string;
  rating: number;
  price: '$$$' | '$$' | '$';
  image: ImagePlaceholder | undefined;
  phone?: string;
  website?: string;
}

export const allVendors: Vendor[] = [
  // Venues
  {
    id: 'vendor-1',
    name: 'Grand Palace Gardens',
    category: 'Venues',
    categorySlug: 'venues',
    location: 'Napa Valley, CA',
    rating: 4.9,
    price: '$$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-venue-1'),
    phone: '555-123-4567',
    website: 'grandpalace.com',
  },
  {
    id: 'vendor-4',
    name: 'The Rustic Barn',
    category: 'Venues',
    categorySlug: 'venues',
    location: 'Sonoma, CA',
    rating: 4.7,
    price: '$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-venue-2'),
     phone: '555-123-4568',
    website: 'rusticbarn.com',
  },
  // Catering
  {
    id: 'vendor-2',
    name: 'Elite Catering Co.',
    category: 'Catering',
    categorySlug: 'catering',
    location: 'San Francisco, CA',
    rating: 4.8,
    price: '$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-catering-1'),
    phone: '555-234-5678',
    website: 'elitecatering.com',
  },
  {
    id: 'vendor-5',
    name: 'Gourmet Gatherings',
    category: 'Catering',
    categorySlug: 'catering',
    location: 'Oakland, CA',
    rating: 4.9,
    price: '$$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-catering-2'),
    phone: '555-234-5679',
    website: 'gourmetgatherings.com',
  },
  // Photography
  {
    id: 'vendor-3',
    name: 'Bloom & Lens Studio',
    category: 'Photography',
    categorySlug: 'photography',
    location: 'Los Angeles, CA',
    rating: 5.0,
    price: '$$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-photographer-1'),
    phone: '555-345-6789',
    website: 'bloomandlens.com',
  },
  {
    id: 'vendor-6',
    name: 'Captured Moments',
    category: 'Photography',
    categorySlug: 'photography',
    location: 'San Diego, CA',
    rating: 4.8,
    price: '$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-photographer-2'),
    phone: '555-345-6790',
    website: 'capturedmoments.com',
  },
    // Music & DJ
  {
    id: 'vendor-7',
    name: 'Groove Masters',
    category: 'Music & DJ',
    categorySlug: 'music-dj',
    location: 'San Francisco, CA',
    rating: 4.9,
    price: '$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-music-1'),
    phone: '555-456-7890',
    website: 'groovemasters.com',
  },
    // Decoration
  {
    id: 'vendor-8',
    name: 'Elegant Designs',
    category: 'Decoration',
    categorySlug: 'decoration',
    location: 'Beverly Hills, CA',
    rating: 4.9,
    price: '$$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-decoration-1'),
    phone: '555-567-8901',
    website: 'elegantdesigns.com',
  },
    // Florist
  {
    id: 'vendor-9',
    name: 'Petal Perfect',
    category: 'Florist',
    categorySlug: 'florist',
    location: 'Pasadena, CA',
    rating: 4.8,
    price: '$$',
    image: PlaceHolderImages.find(img => img.id === 'vendor-florist-1'),
    phone: '555-678-9012',
    website: 'petalperfect.com',
  },
];
