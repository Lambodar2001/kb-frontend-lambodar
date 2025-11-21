import api from '@shared/api/client';

export type AddBikeBody = {
  prize: number;
  brand: string;
  model: string;
  variant: string;
  manufactureYear: number;
  engineCC?: number;
  kilometersDriven?: number;
  fuelType: string;
  color: string;
  registrationNumber: string;
  description: string;
  sellerId: number;
  status: string;
};

type BackendBikeResponse = {
  status: string;
  message: string;
  bikeId: number;
  timestamp: string;
};

export type AddBikeResponse = {
  code: string;
  message: string;
  bikeId?: number;
};

export async function addBike(body: AddBikeBody): Promise<AddBikeResponse> {
  const res = await api.post<BackendBikeResponse>('/bikes/post', body);
  const backendData = res.data;

  // Return normalized response format
  return {
    code: backendData.status || '200',
    message: backendData.message || 'Bike created successfully',
    bikeId: backendData.bikeId,
  };
}
