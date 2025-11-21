import api from '@shared/api/client';

export type UpdateBikeDTO = {
  prize?: number;
  brand?: string;
  model?: string;
  variant?: string;
  manufactureYear?: number;
  engineCC?: number;
  kilometersDriven?: number;
  fuelType?: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'CNG' | string;
  color?: string;
  registrationNumber?: string;
  description?: string;
  sellerId?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'SOLD' | string;
};

export async function updateBike(bikeId: number, payload: UpdateBikeDTO) {
  const { data } = await api.patch(`/bikes/patch/${bikeId}`, payload);
  return data;
}
