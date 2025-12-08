export type EntityType = 'mobile' | 'car'; // Future: Add | 'laptop' | 'bike'

export interface BookableEntity {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  status: 'ACTIVE' | 'SOLD' | 'DRAFT' | 'DELETED';
  sellerId: number;
}

// ========================================
// MOBILE BOOKING BLOCK
// ========================================
export interface MobileEntity extends BookableEntity {
  mobileId: number;
  brand: string;
  model: string;
  condition: string;
  year: number;
  color: string;
  description: string;
  isNegotiable: boolean;
  images: string[];
  userId: number;
}

// ========================================
// CAR BOOKING BLOCK
// ========================================
export interface CarEntity extends BookableEntity {
  carId: number;
  brand: string;
  model: string;
  condition: string;
  year: number;
  color: string;
  description: string;
  isNegotiable: boolean;
  images: string[];
  userId: number;
}

// Future: Add bike, laptop entity interfaces here
