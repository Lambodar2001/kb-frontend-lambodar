// src/api/MobilesApi/getAllMobiles.ts
import client from '@shared/api/client';

export type MobileStatus = 'ACTIVE' | 'DRAFT' | 'SOLD' | string;

export type MobileImage = {
  imageId: number;
  imageUrl: string;
};

export type MobileItem = {
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
  status?: MobileStatus;
  createdAt?: string;
  updatedAt?: string | null;
  sellerId?: number;
  images?: MobileImage[];
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

export async function getAllMobiles(params?: { page?: number; size?: number; sort?: string; sellerId?: number }) {
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

  const res = await client.get<PageResponse<MobileItem>>(
    `/api/v1/mobiles/getAllMobiles`,
    { params: queryParams }
  );
  return res.data;
}
