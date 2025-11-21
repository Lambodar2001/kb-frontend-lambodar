import api from '@shared/api/client';

export type UpdateCarDTO = {
  title?: string;
  description?: string;
  price?: number;
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
  airbag?: boolean;
  abs?: boolean;
  buttonStart?: boolean;
  sunroof?: boolean;
  childSafetyLocks?: boolean;
  acFeature?: boolean;
  musicFeature?: boolean;
  powerWindowFeature?: boolean;
  rearParkingCameraFeature?: boolean;
  images?: string[];
  status?: 'ACTIVE' | 'DRAFT' | 'SOLD' | string;
  sellerId?: number;
};

export async function updateCar(carId: number, payload: UpdateCarDTO) {
  const { data } = await api.patch(`/api/v1/cars/update/${carId}`, payload);
  return data;
}
