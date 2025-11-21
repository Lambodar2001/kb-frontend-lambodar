import client from '@shared/api/client';

export type CarDetail = {
  carId: number;
  title: string;
  description?: string;
  price: number;
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
  status?: string;
  sellerId?: number;
  createdAt?: string;
  updatedAt?: string | null;
  images?: string[];
  airbag?: boolean;
  buttonStart?: boolean;
  sunroof?: boolean;
  childSafetyLocks?: boolean;
  acFeature?: boolean;
  musicFeature?: boolean;
  powerWindowFeature?: boolean;
  rearParkingCameraFeature?: boolean;
  abs?: boolean;
};

export async function getCarById(carId: number): Promise<CarDetail> {
  const { data } = await client.get<CarDetail>(`/api/v1/cars/${carId}`);
  return data;
}
