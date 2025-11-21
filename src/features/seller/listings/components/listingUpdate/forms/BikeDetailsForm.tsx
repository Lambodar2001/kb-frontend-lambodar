import React from 'react';
import { View } from 'react-native';

import {
  ListingFormInput,
  ListingFormDropdown,
  ListingFormTextArea,
  ListingYearPickerField,
} from '@shared/components';
import { LISTING_UPDATE_SPACING as SPACING } from '@theme/listingUpdate';
import { ListingFormErrors, ListingFormTouched } from '../../../hooks/useListingUpdateForm';

export type BikeFormData = {
  brand: string;
  model: string;
  variant: string;
  manufactureYear: string;
  engineCC: string;
  kilometersDriven: string;
  fuelType: string | null;
  color: string;
  registrationNumber: string;
  prize: string;
  description: string;
};

type Props = {
  values: BikeFormData;
  errors: ListingFormErrors<BikeFormData>;
  touched: ListingFormTouched<BikeFormData>;
  onChange: <K extends keyof BikeFormData>(field: K, value: BikeFormData[K]) => void;
  onBlur: <K extends keyof BikeFormData>(field: K, value?: BikeFormData[K]) => void;
  yearOptions: string[];
  fuelTypeOptions: Array<{ label: string; value: string }>;
};

const BikeDetailsForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  yearOptions,
  fuelTypeOptions,
}) => (
  <>
    <ListingFormInput
      label="Brand"
      placeholder="e.g., Honda, Yamaha, Royal Enfield"
      value={values.brand}
      onChangeText={(v) => onChange('brand', v)}
      onBlur={() => onBlur('brand')}
      error={touched.brand ? errors.brand : undefined}
      autoCapitalize="words"
      autoCorrect={false}
      maxLength={40}
      required
    />

    <ListingFormInput
      label="Model"
      placeholder="e.g., CB Shine 125, FZ-S"
      value={values.model}
      onChangeText={(v) => onChange('model', v)}
      onBlur={() => onBlur('model')}
      error={touched.model ? errors.model : undefined}
      autoCapitalize="words"
      autoCorrect={false}
      maxLength={40}
      required
    />

    <ListingFormInput
      label="Variant"
      placeholder="e.g., Drum Brake BS6, ABS, Standard"
      value={values.variant}
      onChangeText={(v) => onChange('variant', v)}
      onBlur={() => onBlur('variant')}
      error={touched.variant ? errors.variant : undefined}
      autoCapitalize="words"
      maxLength={60}
      required
    />

    <ListingYearPickerField
      label="Manufacture Year"
      value={values.manufactureYear}
      years={yearOptions}
      onChange={(year) => {
        onChange('manufactureYear', year);
        onBlur('manufactureYear', year);
      }}
      required
      error={touched.manufactureYear ? errors.manufactureYear : undefined}
    />

    <ListingFormInput
      label="Engine CC"
      placeholder="e.g., 125, 150, 350"
      value={values.engineCC}
      onChangeText={(v) => onChange('engineCC', v.replace(/[^0-9]/g, ''))}
      onBlur={() => onBlur('engineCC')}
      error={touched.engineCC ? errors.engineCC : undefined}
      keyboardType="numeric"
      maxLength={6}
    />

    <ListingFormInput
      label="Kilometers Driven"
      placeholder="e.g., 18500"
      value={values.kilometersDriven}
      onChangeText={(v) => onChange('kilometersDriven', v.replace(/[^0-9]/g, ''))}
      onBlur={() => onBlur('kilometersDriven')}
      error={touched.kilometersDriven ? errors.kilometersDriven : undefined}
      keyboardType="numeric"
      maxLength={10}
    />

    <ListingFormDropdown
      label="Fuel Type"
      data={fuelTypeOptions}
      value={values.fuelType}
      onChange={(item) => {
        onChange('fuelType', item.value);
        onBlur('fuelType', item.value);
      }}
      error={touched.fuelType ? errors.fuelType : undefined}
      required
    />

    <ListingFormInput
      label="Color"
      placeholder="e.g., Black, Red, Blue"
      value={values.color}
      onChangeText={(v) => onChange('color', v)}
      onBlur={() => onBlur('color')}
      error={touched.color ? errors.color : undefined}
      autoCapitalize="words"
      maxLength={40}
      required
    />

    <ListingFormInput
      label="Registration Number"
      placeholder="e.g., MH15AB3456"
      value={values.registrationNumber}
      onChangeText={(v) => onChange('registrationNumber', v.toUpperCase())}
      onBlur={() => onBlur('registrationNumber')}
      error={touched.registrationNumber ? errors.registrationNumber : undefined}
      autoCapitalize="characters"
      autoCorrect={false}
      maxLength={20}
      required
    />

    <ListingFormInput
      label="Price"
      placeholder="Enter price"
      value={values.prize}
      onChangeText={(v) => onChange('prize', v.replace(/[^0-9]/g, ''))}
      onBlur={() => onBlur('prize')}
      error={touched.prize ? errors.prize : undefined}
      keyboardType="numeric"
      maxLength={10}
      required
    />

    <ListingFormTextArea
      label="Description"
      value={values.description}
      onChangeText={(v) => onChange('description', v)}
      onBlur={() => onBlur('description')}
      error={touched.description ? errors.description : undefined}
      autoCapitalize="sentences"
      maxLength={400}
      required
      placeholder="Describe your bike's condition, service history, and accessories..."
    />

    <View style={{ height: SPACING.xxxl }} />
  </>
);

export default BikeDetailsForm;
