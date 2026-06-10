/**
 * Types and Interfaces for Wavelength Luxury Salon Website
 */

export interface ServiceItem {
  id: string;
  title: string;
  category: 'hair' | 'skin' | 'makeup' | 'grooming';
  price?: string; // e.g. "Starting at ₹499" for luxury pricing transparency
  duration?: string;
  description: string;
  image: string;
  iconName: string;
  benefits?: string[];
}

export interface Testimony {
  id: string;
  name: string;
  rating: number;
  review: string;
  date: string;
  service: string;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  category: 'hair' | 'beauty' | 'bridal' | 'makeup' | 'interior' | 'clients';
  title: string;
  description?: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  accent?: string;
}

export interface SalonStats {
  happyClients: string;
  rating: number;
  totalReviews: string;
  beautyExperts: number;
  premiumServices: number;
}
