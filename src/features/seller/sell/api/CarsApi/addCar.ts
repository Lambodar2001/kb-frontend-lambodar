// src/api/CarsApi/addCar.ts
import client from '@shared/api/client';
import { Condition } from '../../types/listings';
import { CarFuelType, CarTransmissionType } from '../../form/schemas/carDetailsSchema';

export interface AddCarPayload {
  title: string;
  description: string;
  airbag: boolean;
  abs: boolean;
  buttonStart: boolean;
  sunroof: boolean;
  childSafetyLocks: boolean;
  acFeature: boolean;
  musicFeature: boolean;
  price: number;
  negotiable: boolean;
  condition: Condition;
  brand: string;
  model: string;
  variant: string;
  color: string;
  yearOfPurchase: number;
  fuelType: CarFuelType;
  carInsurance: boolean;
  carInsuranceDate?: string;
  carInsuranceType?: string;
  transmission: CarTransmissionType;
  powerWindowFeature: boolean;
  rearParkingCameraFeature: boolean;
  kmDriven: number;
  numberOfOwners: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  sellerId: number;
}

export type AddCarResponse = {
  code?: string | number;
  message?: string;
  status?: string;
  statusCode?: string | number;
  carId?: number;
  data?: { carId?: number; id?: number };
  [key: string]: unknown;
};

export async function addCar(payload: AddCarPayload): Promise<AddCarResponse> {
  const { data } = await client.post<AddCarResponse>('/api/v1/cars/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return data;
}
