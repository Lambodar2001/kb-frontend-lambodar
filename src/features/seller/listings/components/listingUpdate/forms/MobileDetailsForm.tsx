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

export type MobileFormData = {
  title: string;
  description: string;
  price: string;
  negotiable: boolean | null;
  condition: string | null;
  brand: string;
  model: string;
  color: string;
  yearOfPurchase: string;
};

type Props = {
  values: MobileFormData;
  errors: ListingFormErrors<MobileFormData>;
  touched: ListingFormTouched<MobileFormData>;
  onChange: <K extends keyof MobileFormData>(field: K, value: MobileFormData[K]) => void;
  onBlur: <K extends keyof MobileFormData>(field: K, value?: MobileFormData[K]) => void;
  yearOptions: string[];
  conditionOptions: Array<{ label: string; value: string }>;
  negotiableOptions: Array<{ label: string; value: boolean }>;
};

const MobileDetailsForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  yearOptions,
  conditionOptions,
  negotiableOptions,
}) => {
  return (
    <>
      <ListingFormInput
        label="Title"
        placeholder="e.g., iPhone 15 Pro - Excellent Condition"
        value={values.title}
        onChangeText={(v) => onChange('title', v)}
        onBlur={() => onBlur('title')}
        error={touched.title ? errors.title : undefined}
        autoCapitalize="sentences"
        maxLength={80}
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
        placeholder="Describe your mobile's condition, features, and accessories..."
      />

      <ListingFormInput
        label="Price"
        placeholder="Enter price"
        value={values.price}
        onChangeText={(v) => onChange('price', v.replace(/[^0-9]/g, ''))}
        onBlur={() => onBlur('price')}
        error={touched.price ? errors.price : undefined}
        keyboardType="numeric"
        maxLength={10}
        required
      />

      <ListingFormDropdown
        label="Condition"
        data={conditionOptions}
        value={values.condition}
        onChange={(item) => {
          onChange('condition', item.value);
          onBlur('condition', item.value);
        }}
        error={touched.condition ? errors.condition : undefined}
        required
      />

      <ListingFormInput
        label="Brand"
        placeholder="e.g., Apple, Samsung, OnePlus"
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
        placeholder="e.g., 15 Pro Max, Galaxy S24"
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
        label="Color"
        placeholder="e.g., Midnight Blue, Space Gray"
        value={values.color}
        onChangeText={(v) => onChange('color', v)}
        onBlur={() => onBlur('color')}
        error={touched.color ? errors.color : undefined}
        autoCapitalize="words"
        maxLength={40}
        required
      />

      <ListingYearPickerField
        label="Year of Purchase"
        value={values.yearOfPurchase}
        years={yearOptions}
        onChange={(year) => {
          onChange('yearOfPurchase', year);
          onBlur('yearOfPurchase', year);
        }}
        required
        error={touched.yearOfPurchase ? errors.yearOfPurchase : undefined}
      />

      <ListingFormDropdown
        label="Negotiable"
        data={negotiableOptions}
        value={values.negotiable}
        onChange={(item) => {
          onChange('negotiable', item.value);
          onBlur('negotiable', item.value);
        }}
        error={touched.negotiable ? errors.negotiable : undefined}
        required
      />

      <View style={{ height: SPACING.xxxl }} />
    </>
  );
};

export default MobileDetailsForm;
