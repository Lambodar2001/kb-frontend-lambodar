import React from 'react';
import { Text, View } from 'react-native';

import {
  ListingFormInput,
  ListingFormDropdown,
  ListingFormTextArea,
  ListingYearPickerField,
} from '@shared/components';
import { listingUpdateStyles, LISTING_UPDATE_SPACING as SPACING } from '@theme/listingUpdate';
import { ListingFormErrors, ListingFormTouched } from '../../../hooks/useListingUpdateForm';

export type CarFormData = {
  title: string;
  description: string;
  price: string;
  negotiable: boolean | null;
  condition: string | null;
  brand: string;
  model: string;
  variant: string;
  color: string;
  yearOfPurchase: string;
  fuelType: string | null;
  transmission: string | null;
  kmDriven: string;
  numberOfOwners: string;
  carInsurance: boolean | null;
  carInsuranceDate: string;
  carInsuranceType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  airbag: boolean;
  abs: boolean;
  buttonStart: boolean;
  sunroof: boolean;
  childSafetyLocks: boolean;
  acFeature: boolean;
  musicFeature: boolean;
  powerWindowFeature: boolean;
  rearParkingCameraFeature: boolean;
};

type Props = {
  values: CarFormData;
  errors: ListingFormErrors<CarFormData>;
  touched: ListingFormTouched<CarFormData>;
  onChange: <K extends keyof CarFormData>(field: K, value: CarFormData[K]) => void;
  onBlur: <K extends keyof CarFormData>(field: K, value?: CarFormData[K]) => void;
  yearOptions: string[];
  conditionOptions: Array<{ label: string; value: string }>;
  negotiableOptions: Array<{ label: string; value: boolean }>;
  fuelTypeOptions: Array<{ label: string; value: string }>;
  transmissionOptions: Array<{ label: string; value: string }>;
  booleanOptions: Array<{ label: string; value: boolean }>;
};

const styles = listingUpdateStyles;

const CarDetailsForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  yearOptions,
  conditionOptions,
  negotiableOptions,
  fuelTypeOptions,
  transmissionOptions,
  booleanOptions,
}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Basic Information</Text>

      <ListingFormInput
        label="Title"
        placeholder="e.g., 2020 Maruti Grand Vitara - Excellent Condition"
        value={values.title}
        onChangeText={(v) => onChange('title', v)}
        onBlur={() => onBlur('title')}
        error={touched.title ? errors.title : undefined}
        autoCapitalize="sentences"
        maxLength={100}
        required
      />

      <ListingFormTextArea
        label="Description"
        value={values.description}
        onChangeText={(v) => onChange('description', v)}
        onBlur={() => onBlur('description')}
        error={touched.description ? errors.description : undefined}
        autoCapitalize="sentences"
        maxLength={500}
        required
        placeholder="Describe your car's condition, features, service history..."
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

      <Text style={styles.sectionTitle}>Car Specifications</Text>

      <ListingFormInput
        label="Brand"
        placeholder="e.g., Maruti Suzuki, Hyundai, Honda"
        value={values.brand}
        onChangeText={(v) => onChange('brand', v)}
        onBlur={() => onBlur('brand')}
        error={touched.brand ? errors.brand : undefined}
        autoCapitalize="words"
        maxLength={50}
        required
      />

      <ListingFormInput
        label="Model"
        placeholder="e.g., Grand Vitara, Creta, City"
        value={values.model}
        onChangeText={(v) => onChange('model', v)}
        onBlur={() => onBlur('model')}
        error={touched.model ? errors.model : undefined}
        autoCapitalize="words"
        maxLength={50}
        required
      />

      <ListingFormInput
        label="Variant"
        placeholder="e.g., Alpha Plus Hybrid, SX, VX"
        value={values.variant}
        onChangeText={(v) => onChange('variant', v)}
        onBlur={() => onBlur('variant')}
        error={touched.variant ? errors.variant : undefined}
        autoCapitalize="words"
        maxLength={50}
      />

      <ListingFormInput
        label="Color"
        placeholder="e.g., Pearl Arctic White, Red"
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

      <ListingFormDropdown
        label="Transmission"
        data={transmissionOptions}
        value={values.transmission}
        onChange={(item) => {
          onChange('transmission', item.value);
          onBlur('transmission', item.value);
        }}
        error={touched.transmission ? errors.transmission : undefined}
        required
      />

      <ListingFormInput
        label="KM Driven"
        placeholder="e.g., 35000"
        value={values.kmDriven}
        onChangeText={(v) => onChange('kmDriven', v.replace(/[^0-9]/g, ''))}
        onBlur={() => onBlur('kmDriven')}
        error={touched.kmDriven ? errors.kmDriven : undefined}
        keyboardType="numeric"
        maxLength={8}
      />

      <ListingFormInput
        label="Number of Owners"
        placeholder="e.g., 1, 2, 3"
        value={values.numberOfOwners}
        onChangeText={(v) => onChange('numberOfOwners', v.replace(/[^0-9]/g, ''))}
        onBlur={() => onBlur('numberOfOwners')}
        error={touched.numberOfOwners ? errors.numberOfOwners : undefined}
        keyboardType="numeric"
        maxLength={2}
      />

      <Text style={styles.sectionTitle}>Insurance Details</Text>

      <ListingFormDropdown
        label="Car Insurance"
        data={booleanOptions}
        value={values.carInsurance}
        onChange={(item) => {
          onChange('carInsurance', item.value);
          onBlur('carInsurance', item.value);
        }}
        error={touched.carInsurance ? errors.carInsurance : undefined}
      />

      {values.carInsurance && (
        <>
          <ListingFormInput
            label="Insurance Type"
            placeholder="e.g., Comprehensive, Third Party"
            value={values.carInsuranceType}
            onChangeText={(v) => onChange('carInsuranceType', v)}
            onBlur={() => onBlur('carInsuranceType')}
            error={touched.carInsuranceType ? errors.carInsuranceType : undefined}
            autoCapitalize="words"
            maxLength={60}
          />

          <ListingFormInput
            label="Insurance Date (YYYY-MM-DD)"
            placeholder="e.g., 2024-08-15"
            value={values.carInsuranceDate}
            onChangeText={(v) => onChange('carInsuranceDate', v)}
            onBlur={() => onBlur('carInsuranceDate')}
            error={touched.carInsuranceDate ? errors.carInsuranceDate : undefined}
            maxLength={10}
          />
        </>
      )}

      <Text style={styles.sectionTitle}>Location</Text>

      <ListingFormInput
        label="Address"
        placeholder="e.g., Baner Road, near Symbiosis College"
        value={values.address}
        onChangeText={(v) => onChange('address', v)}
        onBlur={() => onBlur('address')}
        error={touched.address ? errors.address : undefined}
        autoCapitalize="words"
        maxLength={100}
      />

      <ListingFormInput
        label="City"
        placeholder="e.g., Pune"
        value={values.city}
        onChangeText={(v) => onChange('city', v)}
        onBlur={() => onBlur('city')}
        error={touched.city ? errors.city : undefined}
        autoCapitalize="words"
        maxLength={50}
      />

      <ListingFormInput
        label="State"
        placeholder="e.g., Maharashtra"
        value={values.state}
        onChangeText={(v) => onChange('state', v)}
        onBlur={() => onBlur('state')}
        error={touched.state ? errors.state : undefined}
        autoCapitalize="words"
        maxLength={50}
      />

      <ListingFormInput
        label="Pincode"
        placeholder="e.g., 411045"
        value={values.pincode}
        onChangeText={(v) => onChange('pincode', v.replace(/[^0-9]/g, ''))}
        onBlur={() => onBlur('pincode')}
        error={touched.pincode ? errors.pincode : undefined}
        keyboardType="numeric"
        maxLength={6}
      />

      <Text style={styles.sectionTitle}>Features</Text>

      <ListingFormDropdown
        label="Airbag"
        data={booleanOptions}
        value={values.airbag}
        onChange={(item) => onChange('airbag', item.value)}
      />

      <ListingFormDropdown
        label="ABS"
        data={booleanOptions}
        value={values.abs}
        onChange={(item) => onChange('abs', item.value)}
      />

      <ListingFormDropdown
        label="Button Start"
        data={booleanOptions}
        value={values.buttonStart}
        onChange={(item) => onChange('buttonStart', item.value)}
      />

      <ListingFormDropdown
        label="Sunroof"
        data={booleanOptions}
        value={values.sunroof}
        onChange={(item) => onChange('sunroof', item.value)}
      />

      <ListingFormDropdown
        label="Child Safety Locks"
        data={booleanOptions}
        value={values.childSafetyLocks}
        onChange={(item) => onChange('childSafetyLocks', item.value)}
      />

      <ListingFormDropdown
        label="AC Feature"
        data={booleanOptions}
        value={values.acFeature}
        onChange={(item) => onChange('acFeature', item.value)}
      />

      <ListingFormDropdown
        label="Music System"
        data={booleanOptions}
        value={values.musicFeature}
        onChange={(item) => onChange('musicFeature', item.value)}
      />

      <ListingFormDropdown
        label="Power Windows"
        data={booleanOptions}
        value={values.powerWindowFeature}
        onChange={(item) => onChange('powerWindowFeature', item.value)}
      />

      <ListingFormDropdown
        label="Rear Parking Camera"
        data={booleanOptions}
        value={values.rearParkingCameraFeature}
        onChange={(item) => onChange('rearParkingCameraFeature', item.value)}
      />

      <View style={{ height: SPACING.xxxl }} />
    </>
  );
};

export default CarDetailsForm;
