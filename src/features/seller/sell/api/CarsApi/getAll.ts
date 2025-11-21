// src/api/CarsApi/getAll.ts
import client from '@shared/api/client';

export type CarStatus = 'ACTIVE' | 'DRAFT' | 'SOLD' | string;

export type CarItem = {
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
  status?: CarStatus;
  sellerId?: number;
  createdAt?: string;
  updatedAt?: string | null;
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
};

export type PageResponse<T> = {
  content: T[];
  pageable?: unknown;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number; // current page
  last?: boolean;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
};

export async function getAllCars(params?: { page?: number; size?: number; sort?: string; sellerId?: number }) {
  const { page = 0, size = 20, sort = 'createdAt,DESC', sellerId } = params || {};
  const queryParams: { page: number; size: number; sort: string; sellerId?: number } = {
    page,
    size,
    sort
  };

  // Only add sellerId if provided (for MyAds seller-specific filtering)
  if (sellerId !== undefined && sellerId !== null) {
    queryParams.sellerId = sellerId;
  }

  const res = await client.get<PageResponse<CarItem>>(
    `/api/v1/cars/getAllCars`,
    { params: queryParams }
  );
  return res.data;
}
