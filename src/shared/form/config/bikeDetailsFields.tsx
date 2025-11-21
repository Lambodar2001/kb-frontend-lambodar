// src/form/config/bikeDetailsFields.tsx
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { FormFieldConfig } from './types';
import { BikeDetailsFormValues, BikeFuelType } from '../schemas/bikeDetailsSchema';
import { DropdownOption } from '@shared/components';
import { colors } from '@theme/tokens';

interface BikeFieldConfigOptions {
  onOpenYearPicker: () => void;
}

const fuelTypeOptions: DropdownOption<BikeFuelType>[] = [
  { label: 'Petrol', value: 'PETROL' },
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'Electric', value: 'ELECTRIC' },
  { label: 'CNG', value: 'CNG' },
];

export const getBikeDetailsFieldConfig = ({
  onOpenYearPicker,
}: BikeFieldConfigOptions): Array<FormFieldConfig<BikeDetailsFormValues>> => [
  {
    field: 'brand',
    label: 'Brand',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., Honda, Yamaha, Royal Enfield',
      autoCapitalize: 'words' as const,
      autoCorrect: false,
      maxLength: 40,
    },
  },
  {
    field: 'model',
    label: 'Model',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., CB Shine, FZ-S, Classic 350',
      autoCapitalize: 'words' as const,
      autoCorrect: false,
      maxLength: 40,
    },
  },
  {
    field: 'variant',
    label: 'Variant',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., Drum Brake BS6, ABS, Standard',
      autoCapitalize: 'words' as const,
      maxLength: 60,
    },
  },
  {
    field: 'manufactureYear',
    label: 'Manufacture Year',
    component: 'readonlyPicker',
    required: true,
    props: {
      placeholder: 'Select year',
      onPress: onOpenYearPicker,
    },
  },
  {
    field: 'engineCC',
    label: 'Engine CC',
    component: 'text',
    required: false,
    props: {
      placeholder: 'e.g., 125, 150, 350',
      keyboardType: 'numeric' as const,
      maxLength: 6,
    },
    transform: (value: string) => value.replace(/[^0-9]/g, ''),
  },
  {
    field: 'kilometersDriven',
    label: 'Kilometers Driven',
    component: 'text',
    required: false,
    props: {
      placeholder: 'e.g., 18500',
      keyboardType: 'numeric' as const,
      maxLength: 10,
    },
    transform: (value: string) => value.replace(/[^0-9]/g, ''),
  },
  {
    field: 'fuelType',
    label: 'Fuel Type',
    component: 'dropdown',
    required: true,
    props: {
      data: fuelTypeOptions,
    },
  },
  {
    field: 'color',
    label: 'Color',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., Black, Red, Blue',
      autoCapitalize: 'words' as const,
      maxLength: 40,
    },
  },
  {
    field: 'registrationNumber',
    label: 'Registration Number',
    component: 'text',
    required: true,
    props: {
      placeholder: 'e.g., MH15AB3456',
      autoCapitalize: 'characters' as const,
      autoCorrect: false,
      maxLength: 20,
    },
  },
  {
    field: 'prize',
    label: 'Price',
    component: 'text',
    required: true,
    props: {
      placeholder: 'Enter price in ¹',
      keyboardType: 'numeric' as const,
      maxLength: 10,
    },
    transform: (value: string) => value.replace(/[^0-9]/g, ''),
  },
  {
    field: 'description',
    label: 'Description',
    component: 'textarea',
    required: true,
    props: {
      placeholder: "Describe your bike's condition, service history, and accessories...",
      autoCapitalize: 'sentences' as const,
      maxLength: 400,
    },
    getLabelAccessory: ({ values }) => (
      <Text style={styles.charCount}>{values.description.length}/400</Text>
    ),
  },
];

const styles = StyleSheet.create({
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
