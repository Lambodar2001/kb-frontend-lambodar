import api from './client';

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  mobileNumber: number;
  emailVerified: boolean;
  deleted: boolean;
  deletedAt: string | null;
}

export interface BuyerProfileResponse {
  buyerId: number;
  user: UserProfile;
  deleted: boolean;
  deletedAt: string | null;
}

export interface SellerProfileResponse {
  sellerId: number;
  user: UserProfile;
  deleted: boolean;
  deletedAt: string | null;
}

export const fetchBuyerProfile = async (userId: number): Promise<BuyerProfileResponse> => {
  const response = await api.get(`/api/v1/buyers/${userId}`);
  return response.data;
};

export const fetchSellerProfile = async (userId: number): Promise<SellerProfileResponse> => {
  const response = await api.get(`/api/v1/sellers/${userId}`);
  return response.data;
};
