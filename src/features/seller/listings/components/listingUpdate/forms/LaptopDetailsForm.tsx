import React from 'react';
import { View } from 'react-native';

import {
  ListingFormInput,
  ListingFormDropdown,
} from '@shared/components';
import { LISTING_UPDATE_SPACING as SPACING } from '@theme/listingUpdate';
import { ListingFormErrors, ListingFormTouched } from '../../../hooks/useListingUpdateForm';

export type LaptopFormData = {
  serialNumber: string;
  dealer: string;
  brand: string;
  model: string;
  price: string;
  warrantyInYear: number;
  processor: string;
  processorBrand: string;
  memoryType: string;
  ram: string;
  storage: string;
  colour: string;
  screenSize: string;
  battery: string;
  batteryLife: string;
  graphicsCard: string;
  graphicBrand: string;
  weight: string;
  manufacturer: string;
  usbPorts: string;
};

type Props = {
  values: LaptopFormData;
  errors: ListingFormErrors<LaptopFormData>;
  touched: ListingFormTouched<LaptopFormData>;
  onChange: <K extends keyof LaptopFormData>(field: K, value: LaptopFormData[K]) => void;
  onBlur: <K extends keyof LaptopFormData>(field: K, value?: LaptopFormData[K]) => void;
  warrantyOptions: Array<{ label: string; value: number }>;
};

const LaptopDetailsForm: React.FC<Props> = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  warrantyOptions,
}) => (
  <>
    <ListingFormInput
      label="Serial Number"
      placeholder="Enter laptop serial number"
      value={values.serialNumber}
      onChangeText={(text) => onChange('serialNumber', text)}
      onBlur={() => onBlur('serialNumber')}
      error={touched.serialNumber ? errors.serialNumber : undefined}
      autoCapitalize="characters"
      autoCorrect={false}
      required
    />

    <ListingFormInput
      label="Dealer"
      placeholder="Enter dealer name"
      value={values.dealer}
      onChangeText={(text) => onChange('dealer', text)}
      onBlur={() => onBlur('dealer')}
      error={touched.dealer ? errors.dealer : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="Brand"
      placeholder="e.g., HP, Dell, Apple"
      value={values.brand}
      onChangeText={(text) => onChange('brand', text)}
      onBlur={() => onBlur('brand')}
      error={touched.brand ? errors.brand : undefined}
      autoCapitalize="words"
      required
    />

    <ListingFormInput
      label="Model"
      placeholder="e.g., 15s-fq5009TU"
      value={values.model}
      onChangeText={(text) => onChange('model', text)}
      onBlur={() => onBlur('model')}
      error={touched.model ? errors.model : undefined}
      autoCapitalize="characters"
      autoCorrect={false}
      required
    />

    <ListingFormInput
      label="Price"
      placeholder="Enter price"
      value={values.price}
      onChangeText={(text) => onChange('price', text)}
      onBlur={() => onBlur('price')}
      error={touched.price ? errors.price : undefined}
      keyboardType="numeric"
      autoCapitalize="none"
      autoCorrect={false}
      required
    />

    <ListingFormDropdown
      label="Warranty (Years)"
      data={warrantyOptions}
      value={values.warrantyInYear}
      onChange={(item) => {
        onChange('warrantyInYear', Number(item.value) || warrantyOptions[0].value);
        onBlur('warrantyInYear', Number(item.value) || warrantyOptions[0].value);
      }}
    />

    <ListingFormInput
      label="Processor"
      placeholder="e.g., Intel Core i5-1335U"
      value={values.processor}
      onChangeText={(text) => onChange('processor', text)}
      onBlur={() => onBlur('processor')}
      error={touched.processor ? errors.processor : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="Processor Brand"
      placeholder="e.g., Intel, AMD"
      value={values.processorBrand}
      onChangeText={(text) => onChange('processorBrand', text)}
      onBlur={() => onBlur('processorBrand')}
      error={touched.processorBrand ? errors.processorBrand : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="RAM"
      placeholder="e.g., 16 GB"
      value={values.ram}
      onChangeText={(text) => onChange('ram', text)}
      onBlur={() => onBlur('ram')}
      error={touched.ram ? errors.ram : undefined}
      autoCapitalize="characters"
      autoCorrect={false}
    />

    <ListingFormInput
      label="Storage"
      placeholder="e.g., 512 GB SSD"
      value={values.storage}
      onChangeText={(text) => onChange('storage', text)}
      onBlur={() => onBlur('storage')}
      error={touched.storage ? errors.storage : undefined}
      autoCapitalize="characters"
      autoCorrect={false}
    />

    <ListingFormInput
      label="Colour"
      placeholder="e.g., Silver"
      value={values.colour}
      onChangeText={(text) => onChange('colour', text)}
      onBlur={() => onBlur('colour')}
      error={touched.colour ? errors.colour : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="Screen Size"
      placeholder="e.g., 15.6 inch"
      value={values.screenSize}
      onChangeText={(text) => onChange('screenSize', text)}
      onBlur={() => onBlur('screenSize')}
      error={touched.screenSize ? errors.screenSize : undefined}
      autoCapitalize="none"
      autoCorrect={false}
    />

    <ListingFormInput
      label="Memory Type"
      placeholder="e.g., DDR4"
      value={values.memoryType}
      onChangeText={(text) => onChange('memoryType', text)}
      onBlur={() => onBlur('memoryType')}
      error={touched.memoryType ? errors.memoryType : undefined}
      autoCapitalize="characters"
      autoCorrect={false}
    />

    <ListingFormInput
      label="Battery"
      placeholder="e.g., 41 Wh Li-ion"
      value={values.battery}
      onChangeText={(text) => onChange('battery', text)}
      onBlur={() => onBlur('battery')}
      error={touched.battery ? errors.battery : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="Battery Life"
      placeholder="e.g., Up to 8 hours"
      value={values.batteryLife}
      onChangeText={(text) => onChange('batteryLife', text)}
      onBlur={() => onBlur('batteryLife')}
      error={touched.batteryLife ? errors.batteryLife : undefined}
      autoCapitalize="sentences"
    />

    <ListingFormInput
      label="Graphics Card"
      placeholder="e.g., Intel Iris Xe"
      value={values.graphicsCard}
      onChangeText={(text) => onChange('graphicsCard', text)}
      onBlur={() => onBlur('graphicsCard')}
      error={touched.graphicsCard ? errors.graphicsCard : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="Graphic Brand"
      placeholder="e.g., Intel"
      value={values.graphicBrand}
      onChangeText={(text) => onChange('graphicBrand', text)}
      onBlur={() => onBlur('graphicBrand')}
      error={touched.graphicBrand ? errors.graphicBrand : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="Weight"
      placeholder="e.g., 1.59 kg"
      value={values.weight}
      onChangeText={(text) => onChange('weight', text)}
      onBlur={() => onBlur('weight')}
      error={touched.weight ? errors.weight : undefined}
      autoCapitalize="none"
      autoCorrect={false}
    />

    <ListingFormInput
      label="Manufacturer"
      placeholder="e.g., HP India Pvt Ltd"
      value={values.manufacturer}
      onChangeText={(text) => onChange('manufacturer', text)}
      onBlur={() => onBlur('manufacturer')}
      error={touched.manufacturer ? errors.manufacturer : undefined}
      autoCapitalize="words"
    />

    <ListingFormInput
      label="USB Ports"
      placeholder="Number of USB ports"
      value={values.usbPorts}
      onChangeText={(text) => onChange('usbPorts', text)}
      onBlur={() => onBlur('usbPorts')}
      error={touched.usbPorts ? errors.usbPorts : undefined}
      keyboardType="numeric"
      autoCapitalize="none"
      autoCorrect={false}
    />

    <View style={{ height: SPACING.xxxl }} />
  </>
);

export default LaptopDetailsForm;
