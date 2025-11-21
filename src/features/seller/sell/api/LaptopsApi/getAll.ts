// src/api/LaptopsApi/getAllLaptops.ts
import client from '@shared/api/client';
import { extractLaptopPhotos, LaptopPhoto } from './photoNormalizer';

export type LaptopStatus =
  | 'ACTIVE'
  | 'AVAILABLE'
  | 'DRAFT'
  | 'DEACTIVATE'
  | 'DELETED'
  | 'PENDING'
  | 'SOLD'
  | string;

export type LaptopItem = {
  id: number;                // backend uses "id"
  serialNumber?: string;
  dealer?: string;
  model?: string;
  brand?: string;
  price?: number;
  warrantyInYear?: number;
  processor?: string;
  processorBrand?: string;
  memoryType?: string;
  screenSize?: string;
  colour?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  batteryLife?: string;
  graphicsCard?: string;
  graphicBrand?: string;
  weight?: string;
  manufacturer?: string;
  usbPorts?: number;
  status?: LaptopStatus;
  laptopPhotos?: LaptopPhoto[];
  deleted?: boolean;
  deletedAt?: string | null;
};

// PageResponse type for laptops with pagination
export type LaptopPageResponse = {
  content: LaptopItem[];
  pageable?: unknown;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  last?: boolean;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
};

// Seller-specific fetch with pagination (for MyAds)
export async function getLaptopsBySeller(params: {
  sellerId: number;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
}): Promise<LaptopPageResponse> {
  const { sellerId, status = 'ACTIVE', page = 0, size = 20, sortBy = 'id' } = params;

  const res = await client.get<LaptopPageResponse>('/api/laptops/getByDealerIdAndStatus', {
    params: {
      sellerId,
      status,
      page,
      size,
      sortBy,
    },
  });

  const payload = res.data;
  const content = Array.isArray(payload.content) ? payload.content : [];

  const normalizedContent = content.map((item) => {
    const normalizedPhotos = extractLaptopPhotos(item);
    return {
      ...item,
      laptopPhotos:
        normalizedPhotos.length > 0 ? normalizedPhotos : item.laptopPhotos ?? [],
    };
  });

  return {
    ...payload,
    content: normalizedContent,
  };
}

// Plain array response (based on your Postman example) - Original function for general use
export async function getAllLaptops(params?: { sellerId?: number }): Promise<LaptopItem[]> {
  // If sellerId is provided, use the seller-specific endpoint
  if (params?.sellerId !== undefined && params.sellerId !== null) {
    const response = await getLaptopsBySeller({
      sellerId: params.sellerId,
      status: 'ACTIVE',
      page: 0,
      size: 100, // Get all for backward compatibility
    });
    return response.content;
  }

  // Original behavior for general fetching
  const res = await client.get<LaptopItem[]>('/api/laptops/getAll');
  const payload = Array.isArray(res.data) ? res.data : [];

  return payload.map((item) => {
    const normalizedPhotos = extractLaptopPhotos(item);

    return {
      ...item,
      laptopPhotos:
        normalizedPhotos.length > 0 ? normalizedPhotos : item.laptopPhotos ?? [],
    };
  });
}
