// src/features/buyer/home/api/mobilesApi.ts
import client from '@shared/api/client';
import { MobileItem, PageResponse } from '@features/seller/sell/api/MobilesApi/getAll';
import { MobileDetail } from '@features/seller/sell/api/MobilesApi/getById';

/**
 * Fetch all active mobiles for buyers
 * Filters only ACTIVE status ads
 */
export async function getBuyerMobiles(params?: { page?: number; size?: number; sort?: string }) {
  const { page = 0, size = 20, sort = 'createdAt,DESC' } = params || {};

  const res = await client.get<PageResponse<MobileItem>>(
    `/api/v1/mobiles/getAllMobiles`,
    {
      params: { page, size, sort }
    }
  );

  // Filter only ACTIVE status mobiles
  const activeMobiles = res.data.content.filter(mobile => mobile.status === 'ACTIVE');

  return {
    ...res.data,
    content: activeMobiles,
    numberOfElements: activeMobiles.length,
  };
}

/**
 * Get mobile details by ID for buyers
 */
export async function getBuyerMobileById(mobileId: number) {
  const res = await client.get<MobileDetail>(`/api/v1/mobiles/${mobileId}`);
  return res.data;
}
