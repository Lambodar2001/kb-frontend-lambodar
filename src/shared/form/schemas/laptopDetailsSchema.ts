// src/form/schemas/laptopDetailsSchema.ts
import { z } from 'zod';

const numericString = z
  .string()
  .min(1, 'Please enter a valid numeric value')
  .refine((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed);
  }, 'Please enter a valid numeric value');

const requiredString = z.string().min(1, 'This field is required').max(200, 'Value is too long');

export const laptopDetailsSchema = z.object({
  serialNumber: z.string().min(1, 'Please enter Serial Number'),
  dealer: requiredString,
  brand: z.string().min(1, 'Please enter Brand'),
  model: z.string().min(1, 'Please enter Model'),
  price: numericString.refine(
    (value) => /^\d{1,6}$/.test(value.trim()),
    'Price must be a numeric value with up to 6 digits',
  ),
  warrantyInYear: z.number().int().min(0).max(10),
  processor: requiredString,
  processorBrand: requiredString,
  ram: requiredString,
  storage: requiredString,
  colour: requiredString,
  screenSize: requiredString,
  memoryType: requiredString,
  battery: requiredString,
  batteryLife: requiredString,
  graphicsCard: requiredString,
  graphicBrand: requiredString,
  weight: requiredString
    .refine((value) => /^\d+(\.\d+)?\s*kg$/.test(value.trim()), 'Weight must end with "kg" and contain only numbers before it')
    .refine((value) => {
      const numericPart = value.trim().replace(/\s*kg$/, '');
      const weightValue = Number(numericPart);
      return weightValue >= 0.5 && weightValue <= 5;
    }, 'Weight must be between 0.5 kg and 5 kg'),
  manufacturer: requiredString,
  usbPorts: z
    .string()
    .min(1, 'Please enter number of USB ports')
    .refine((value) => {
      return /^\d+$/.test(value.trim());
    }, 'Please enter a numeric value'),
});

export type LaptopDetailsFormValues = z.infer<typeof laptopDetailsSchema>;

export const getDefaultLaptopDetailsValues = (): LaptopDetailsFormValues => ({
   serialNumber: 'SNX12345AB67',
   dealer: 'Tech World Computers',
   brand: 'HP',
   model: 'Pavilion 15-eg2005TU',
   price: '62999',
   warrantyInYear: 1,
   processor: 'Intel Core i5-1240P',
   processorBrand: 'Intel',
   ram: '16GB DDR4',
   storage: '512GB SSD',
   colour: 'Silver',
   screenSize: '15.6 inch',
   memoryType: 'SSD',
   battery: '3-cell, 41 Wh Li-ion',
   batteryLife: 'Up to 8 hours',
   graphicsCard: 'Intel Iris Xe',
   graphicBrand: 'Intel',
   weight: '1.75 kg',
   manufacturer: 'HP Inc.',
   usbPorts: '2 x USB-A, 1 x USB-C',
});


// serialNumber: 'SNX12345AB67',
//   dealer: 'Tech World Computers',
//   brand: 'HP',
//   model: 'Pavilion 15-eg2005TU',
//   price: '62999',
//   warrantyInYear: 1,
//   processor: 'Intel Core i5-1240P',
//   processorBrand: 'Intel',
//   ram: '16GB DDR4',
//   storage: '512GB SSD',
//   colour: 'Silver',
//   screenSize: '15.6 inch',
//   memoryType: 'SSD',
//   battery: '3-cell, 41 Wh Li-ion',
//   batteryLife: 'Up to 8 hours',
//   graphicsCard: 'Intel Iris Xe',
//   graphicBrand: 'Intel',
//   weight: '1.75 kg',
//   manufacturer: 'HP Inc.',
//   usbPorts: '2 x USB-A, 1 x USB-C',
