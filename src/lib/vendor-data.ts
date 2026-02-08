
import { PlaceHolderImages, ImagePlaceholder } from './placeholder-images';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  location: string;
  rating: number;
  price: '$$$' | '$$' | '$';
  image?: ImagePlaceholder;
  phone?: string;
  website?: string;
}
