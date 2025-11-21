import api from '@shared/api/client';

export type AddMobileBody = {
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  brand: string;
  model: string;
  color?: string | null;
  yearOfPurchase: number;
  sellerId: number;
};

export type AddMobileResponse = {
  code: string;        // "200" in JSON per swagger (HTTP may be 200 or 201)
  message: string;
  mobileId?: number;   // now provided on success
};

export async function addMobile(body: AddMobileBody): Promise<AddMobileResponse> {
  const res = await api.post<AddMobileResponse>('/api/v1/mobiles/add', body);
  return res.data;
}
