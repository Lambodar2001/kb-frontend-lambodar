import client from '@shared/api/client';

export type BikeStatus = 'ACTIVE' | 'DRAFT' | 'SOLD' | string;

export type BikeItem = {
  bike_id: number;
  prize: number;
  brand?: string;
  model?: string;
  variant?: string;
  manufactureYear?: number;
  engineCC?: number;
  kilometersDriven?: number;
  fuelType?: string;
  color?: string;
  registrationNumber?: string;
  description?: string;
  sellerId?: number;
  status?: BikeStatus;
  createdAt?: string;
  images?: Array<{
    imageId: number;
    image_link: string;
    publicId: string;
  }>;
};

export type BikeResponse = BikeItem[];

export async function getAllBikes(params?: { page?: number; size?: number; sort?: string; sellerId?: number }) {
  // If sellerId is provided, use the seller-specific endpoint with pagination
  if (params?.sellerId !== undefined && params.sellerId !== null) {
    const { page = 0, size = 20, sellerId } = params;

    try {
      const res = await client.get<BikeResponse>(
        `/bikes/seller/${sellerId}/status/ACTIVE/page/${page}/size/${size}`
      );

      const items = Array.isArray(res.data) ? res.data : [];
      const hasMore = items.length === size; // If we got full page, there might be more

      return {
        content: items,
        last: !hasMore,
        first: page === 0,
        totalPages: hasMore ? page + 2 : page + 1,
        totalElements: items.length,
        size: items.length,
        number: page,
        numberOfElements: items.length,
        empty: items.length === 0,
      };
    } catch (error: any) {
      // Handle 404 error when no bikes found for seller - return empty response instead of throwing
      if (error?.response?.status === 404 || error?.statusCode === 404) {
        if (__DEV__) {
          console.log('[getAllBikes] No bikes found for seller, returning empty list');
        }
        return {
          content: [],
          last: true,
          first: true,
          totalPages: 0,
          totalElements: 0,
          size: 0,
          number: page,
          numberOfElements: 0,
          empty: true,
        };
      }
      // Re-throw other errors
      throw error;
    }
  }

  // Original behavior for general fetching (without sellerId)
  const res = await client.get<BikeResponse>('/bikes/get');

  // Transform response to match PageResponse format for compatibility
  return {
    content: res.data || [],
    last: true,
    first: true,
    totalPages: 1,
    totalElements: res.data?.length || 0,
    size: res.data?.length || 0,
    number: 0,
    numberOfElements: res.data?.length || 0,
    empty: !res.data || res.data.length === 0,
  };
}
