// src/form/schemas/bikeDetailsSchema.ts
import { z } from 'zod';

export const MIN_BIKE_YEAR = 1990;
export const CURRENT_YEAR = new Date().getFullYear();

export type BikeFuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'CNG';

const priceValidator = z
  .string()
  .min(1, 'Please enter a valid price')
  .refine((value) => {
    if (!value) return false;
    const price = Number(value);
    return Number.isFinite(price) && price > 0 && price <= 10_000_000;
  }, 'Please enter a valid price between 1 and 10000000');

const optionalNumberValidator = z
  .string()
  .refine((value) => {
    if (!value || value.trim() === '') return true;
    const num = Number(value);
    return Number.isFinite(num) && num >= 0;
  }, 'Please enter a valid number');

const fuelTypeSchema = z
  .union([
    z.literal<BikeFuelType>('PETROL'),
    z.literal<BikeFuelType>('DIESEL'),
    z.literal<BikeFuelType>('ELECTRIC'),
    z.literal<BikeFuelType>('CNG'),
  ])
  .nullable()
  .refine(
    (val) => val === 'PETROL' || val === 'DIESEL' || val === 'ELECTRIC' || val === 'CNG',
    'Please select fuel type'
  );

export const bikeDetailsSchema = z.object({
  prize: priceValidator,
  brand: z.string().min(2, 'Brand name is required'),
  model: z.string().min(1, 'Model name is required'),
  variant: z.string().min(1, 'Variant is required'),
  manufactureYear: z
    .string()
    .min(4, 'Please select manufacture year')
    .refine((value) => {
      const year = Number(value);
      return (
        Number.isFinite(year) &&
        year.toString().length === 4 &&
        year >= MIN_BIKE_YEAR &&
        year <= CURRENT_YEAR
      );
    }, `Please select a valid year between ${MIN_BIKE_YEAR} and ${CURRENT_YEAR}`),
  engineCC: optionalNumberValidator,
  kilometersDriven: optionalNumberValidator,
  fuelType: fuelTypeSchema,
  color: z.string().min(2, 'Color is required'),
  registrationNumber: z.string().min(5, 'Registration number is required'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(400, 'Description must not exceed 400 characters'),
});

export type BikeDetailsFormValues = z.infer<typeof bikeDetailsSchema>;

export const getDefaultBikeDetailsValues = (): BikeDetailsFormValues => ({
  prize: '85000',
  brand: 'Honda',
  model: 'CB Shine 125',
  variant: 'Drum Brake',
  manufactureYear: '2023',
  engineCC: '125',
  kilometersDriven: '12500',
  fuelType: 'PETROL',
  color: 'Black',
  registrationNumber: 'MH12AB1234',
  description: 'Well maintained bike, single owner, all service records available. Regular servicing done at authorized Honda service center. Good condition with minor scratches.',
});
