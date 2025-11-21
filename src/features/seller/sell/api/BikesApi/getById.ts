import client from '@shared/api/client';

export type BikeImage = {
  imageId: number;
  image_link: string;
  publicId: string;
};

export type BikeDetail = {
  bikeId?: number;
  title?: string;
  prize: number;
  negotiable?: boolean;
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
  condition?: string;
  numberOfOwners?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  sellerId?: number;
  status?: string;
  images?: BikeImage[];
  createdAt?: string;
  updatedAt?: string | null;
};

export async function getBikeById(bikeId: number): Promise<BikeDetail> {
  const { data } = await client.get<BikeDetail>(`/bikes/get/${bikeId}`);
  return data;
}
