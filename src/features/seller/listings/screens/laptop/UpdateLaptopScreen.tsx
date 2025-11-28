import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyLaptopAdsStackParamList } from '../../navigation/MyLaptopAdsStack';
import { getLaptopById, LaptopDetail, updateLaptop } from '@features/seller/sell/api/LaptopsApi';
import ListingUpdateLayout from '../../components/details/ListingUpdateLayout';
import ListingUpdateLoader from '../../components/details/ListingUpdateLoader';
import {
  listingUpdateStyles,
  LISTING_UPDATE_COLORS as COLORS,
} from '@theme/listingUpdate';
import useListingDetails from '../../hooks/useListingDetails';
import useListingUpdateForm, {
  ListingFormNormalizers,
  ListingFormValidators,
} from '../../hooks/useListingUpdateForm';
import LaptopDetailsForm, {
  LaptopFormData,
} from '../../components/listingUpdate/forms/LaptopDetailsForm';
import { LAPTOP_WARRANTY_OPTIONS } from '../../../sell/screens/laptop/constants/laptopFormOptions';

type UpdateRouteProp = RouteProp<MyLaptopAdsStackParamList, 'UpdateLaptop'>;
type NavProp = NativeStackNavigationProp<MyLaptopAdsStackParamList, 'UpdateLaptop'>;

const DEFAULT_FORM: LaptopFormData = {
  serialNumber: '',
  dealer: '',
  brand: '',
  model: '',
  price: '',
  warrantyInYear: 1,
  processor: '',
  processorBrand: '',
  memoryType: '',
  ram: '',
  storage: '',
  colour: '',
  screenSize: '',
  battery: '',
  batteryLife: '',
  graphicsCard: '',
  graphicBrand: '',
  weight: '',
  manufacturer: '',
  usbPorts: '',
};

const styles = listingUpdateStyles;
const stringNormalizer = (value: any) => (typeof value === 'string' ? value.trim() : value);
const trimOrUndefined = (value: string) => {
  const next = value.trim();
  return next.length > 0 ? next : undefined;
};

const UpdateLaptopScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const {
    params: { laptopId },
  } = useRoute<UpdateRouteProp>();

  const [saving, setSaving] = useState(false);

  const validators = useMemo<ListingFormValidators<LaptopFormData>>(
    () => ({
      serialNumber: (value) => {
        if (!value || !value.trim()) return 'Serial Number is required';
        return undefined;
      },
      brand: (value) => {
        if (!value || !value.trim()) return 'Brand is required';
        return undefined;
      },
      model: (value) => {
        if (!value || !value.trim()) return 'Model is required';
        return undefined;
      },
      price: (value) => {
        if (!value || !value.trim()) return 'Price is required';
        const priceNum = Number(value);
        if (Number.isNaN(priceNum) || priceNum <= 0) return 'Please enter a valid numeric price';
        return undefined;
      },
      usbPorts: (value) => {
        if (!value || !value.trim()) return undefined;
        const usbPortsNum = Number(value);
        if (Number.isNaN(usbPortsNum) || usbPortsNum < 0) {
          return 'Please enter a valid number of USB ports';
        }
        return undefined;
      },
    }),
    [],
  );

  const normalizers = useMemo<ListingFormNormalizers<LaptopFormData>>(
    () => ({
      serialNumber: stringNormalizer,
      dealer: stringNormalizer,
      brand: stringNormalizer,
      model: stringNormalizer,
      price: stringNormalizer,
      warrantyInYear: (value) => value,
      processor: stringNormalizer,
      processorBrand: stringNormalizer,
      memoryType: stringNormalizer,
      ram: stringNormalizer,
      storage: stringNormalizer,
      colour: stringNormalizer,
      screenSize: stringNormalizer,
      battery: stringNormalizer,
      batteryLife: stringNormalizer,
      graphicsCard: stringNormalizer,
      graphicBrand: stringNormalizer,
      weight: stringNormalizer,
      manufacturer: stringNormalizer,
      usbPorts: stringNormalizer,
    }),
    [],
  );

  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    initializeForm,
  } = useListingUpdateForm<LaptopFormData>({
    initialValues: DEFAULT_FORM,
    validators,
    normalizers,
  });

  const fetchLaptop = useCallback(() => getLaptopById(laptopId), [laptopId]);

  const { data, loading, error } = useListingDetails<LaptopDetail>(fetchLaptop, {
    defaultErrorMessage: 'Failed to load laptop',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    const allowedWarranty =
      data.warrantyInYear != null &&
      LAPTOP_WARRANTY_OPTIONS.some((option) => option.value === data.warrantyInYear)
        ? data.warrantyInYear
        : DEFAULT_FORM.warrantyInYear;

    initializeForm({
      serialNumber: data.serialNumber ?? '',
      dealer: data.dealer ?? '',
      brand: data.brand ?? '',
      model: data.model ?? '',
      price: data.price != null ? String(data.price) : '',
      warrantyInYear: allowedWarranty,
      processor: data.processor ?? '',
      processorBrand: data.processorBrand ?? '',
      memoryType: data.memoryType ?? '',
      ram: data.ram ?? '',
      storage: data.storage ?? '',
      colour: data.colour ?? '',
      screenSize: data.screenSize ?? '',
      battery: data.battery ?? '',
      batteryLife: data.batteryLife ?? '',
      graphicsCard: data.graphicsCard ?? '',
      graphicBrand: data.graphicBrand ?? '',
      weight: data.weight ?? '',
      manufacturer: data.manufacturer ?? '',
      usbPorts: data.usbPorts != null ? String(data.usbPorts) : '',
    });
  }, [data, initializeForm]);

  const handleSave = useCallback(async () => {
    if (saving) return;

    if (!validateForm()) {
      Alert.alert('Please review the form', 'Correct highlighted fields before saving.');
      return;
    }

    const priceNum = Number(formData.price);
    const usbPortsNum = formData.usbPorts.trim().length
      ? Number(formData.usbPorts)
      : undefined;
    const warrantyValue = LAPTOP_WARRANTY_OPTIONS.some(
      (option) => option.value === formData.warrantyInYear,
    )
      ? formData.warrantyInYear
      : DEFAULT_FORM.warrantyInYear;

    const payload = {
      serialNumber: formData.serialNumber.trim(),
      dealer: trimOrUndefined(formData.dealer),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      price: priceNum,
      warrantyInYear: warrantyValue,
      processor: trimOrUndefined(formData.processor),
      processorBrand: trimOrUndefined(formData.processorBrand),
      memoryType: trimOrUndefined(formData.memoryType),
      ram: trimOrUndefined(formData.ram),
      storage: trimOrUndefined(formData.storage),
      colour: trimOrUndefined(formData.colour),
      screenSize: trimOrUndefined(formData.screenSize),
      battery: trimOrUndefined(formData.battery),
      batteryLife: trimOrUndefined(formData.batteryLife),
      graphicsCard: trimOrUndefined(formData.graphicsCard),
      graphicBrand: trimOrUndefined(formData.graphicBrand),
      weight: trimOrUndefined(formData.weight),
      manufacturer: trimOrUndefined(formData.manufacturer),
      usbPorts: usbPortsNum,
      status: data?.status,
      sellerId: data?.sellerId,
    };

    try {
      setSaving(true);
      await updateLaptop(laptopId, payload);
      Alert.alert('Success', 'Laptop updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to update laptop');
    } finally {
      setSaving(false);
    }
  }, [data, formData, laptopId, navigation, saving, validateForm]);

  if (loading) {
    return <ListingUpdateLoader message="Loading laptop..." />;
  }

  return (
    <ListingUpdateLayout
      title="Edit Laptop Details"
      onBack={() => navigation.goBack()}
      backDisabled={saving}
      footer={
        <TouchableOpacity
          style={[styles.nextButton, saving && styles.nextButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.nextButtonText}>Update</Text>
          )}
        </TouchableOpacity>
      }
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      <LaptopDetailsForm
        values={formData}
        errors={errors}
        touched={touched}
        onChange={handleChange}
        onBlur={handleBlur}
        warrantyOptions={LAPTOP_WARRANTY_OPTIONS}
      />
    </ListingUpdateLayout>
  );
};

export default UpdateLaptopScreen;

