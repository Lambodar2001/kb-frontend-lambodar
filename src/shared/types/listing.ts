// src/types/listing.ts

/**
 * Base listing status type
 */
export type ListingStatus = 'ACTIVE' | 'DRAFT' | 'SOLD' | string;

/**
 * Common listing properties shared across all product types
 */
export interface BaseListing {
  status?: ListingStatus;
  createdAt?: string;
  updatedAt?: string | null;
  sellerId?: number;
}

/**
 * Car listing type for My Ads list
 */
export interface CarListing extends BaseListing {
  carId: number;
  title: string;
  description?: string;
  price: number;
  negotiable?: boolean;
  condition?: string;
  brand?: string;
  model?: string;
  variant?: string;
  color?: string;
  yearOfPurchase?: number;
  fuelType?: string;
  transmission?: string;
  carInsurance?: boolean;
  carInsuranceDate?: string;
  carInsuranceType?: string;
  kmDriven?: number;
  numberOfOwners?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  images?: string[];
  airbag?: boolean;
  buttonStart?: boolean;
  sunroof?: boolean;
  childSafetyLocks?: boolean;
  acFeature?: boolean;
  musicFeature?: boolean;
  powerWindowFeature?: boolean;
  rearParkingCameraFeature?: boolean;
  abs?: boolean;
}

/**
 * Mobile listing type for My Ads list
 */
export interface MobileListing extends BaseListing {
  mobileId: number;
  title: string;
  description?: string;
  price: number;
  negotiable?: boolean;
  condition?: string;
  brand?: string;
  model?: string;
  color?: string;
  yearOfPurchase?: number;
  images?: string[];
}
