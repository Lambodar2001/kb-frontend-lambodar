import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyCarAdsStackParamList } from '../../navigation/MyCarAdsStack';
import { getCarById, updateCar, UpdateCarDTO, CarDetail } from '@features/seller/sell/api/CarsApi';
import ListingUpdateLayout from '../../components/details/ListingUpdateLayout';
import ListingUpdateLoader from '../../components/details/ListingUpdateLoader';
import { listingUpdateStyles, LISTING_UPDATE_COLORS as COLORS } from '@theme/listingUpdate';
import useListingDetails from '../../hooks/useListingDetails';
import { getFriendlyApiError } from '@shared/utils';
import { useAuth } from '@context/AuthContext';
import useListingUpdateForm, {
  ListingFormNormalizers,
  ListingFormValidators,
} from '../../hooks/useListingUpdateForm';
import CarDetailsForm, {
  CarFormData,
} from '../../components/listingUpdate/forms/CarDetailsForm';
import {
  buildCarYearOptions,
  CAR_BOOLEAN_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_FUEL_TYPE_OPTIONS,
  CAR_NEGOTIABLE_OPTIONS,
  CAR_TRANSMISSION_OPTIONS,
  CAR_CURRENT_YEAR,
  CAR_MIN_YEAR,
} from '../../../sell/screens/car/constants/carFormOptions';

type UpdateRouteProp = RouteProp<MyCarAdsStackParamList, 'UpdateCar'>;
type UpdateNavProp = NativeStackNavigationProp<MyCarAdsStackParamList, 'UpdateCar'>;

const styles = listingUpdateStyles;

const carInitialValues: CarFormData = {
  title: '',
  description: '',
  price: '',
  negotiable: null,
  condition: null,
  brand: '',
  model: '',
  variant: '',
  color: '',
  yearOfPurchase: '',
  fuelType: null,
  transmission: null,
  kmDriven: '',
  numberOfOwners: '',
  carInsurance: null,
  carInsuranceDate: '',
  carInsuranceType: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  airbag: false,
  abs: false,
  buttonStart: false,
  sunroof: false,
  childSafetyLocks: false,
  acFeature: false,
  musicFeature: false,
  powerWindowFeature: false,
  rearParkingCameraFeature: false,
};

const stringNormalizer = (value: any) => (typeof value === 'string' ? value.trim() : value);

const UpdateCarScreen: React.FC = () => {
  const navigation = useNavigation<UpdateNavProp>();
  const {
    params: { carId },
  } = useRoute<UpdateRouteProp>();
  const { sellerId: authSellerId } = useAuth();

  const [saving, setSaving] = useState(false);
  const [ownerSellerId, setOwnerSellerId] = useState<number | null>(null);

  // Hide tab bar when this screen is focused
  useLayoutEffect(() => {
    // Navigate up to find the tab navigator
    let currentNav = navigation.getParent();
    let tabNavigator = null;

    // Go up the navigation tree to find the tab navigator
    while (currentNav) {
      // Check if this navigator has a tabBarStyle option (indicates it's a tab navigator)
      if (currentNav.getId()?.includes('Tab') || currentNav.getState()?.type === 'tab') {
        tabNavigator = currentNav;
        break;
      }
      currentNav = currentNav.getParent();
    }

    // If we can't find it by type, just go up 3 levels
    if (!tabNavigator) {
      tabNavigator = navigation.getParent()?.getParent()?.getParent();
    }

    if (tabNavigator) {
      tabNavigator.setOptions({
        tabBarStyle: { display: 'none' },
      });
    }

    return () => {
      if (tabNavigator) {
        tabNavigator.setOptions({
          tabBarStyle: undefined,
        });
      }
    };
  }, [navigation]);

  const yearOptions = useMemo(() => buildCarYearOptions(), []);

  const validators = useMemo<ListingFormValidators<CarFormData>>(
    () => ({
      title: (value) => {
        if (!value || value.trim().length < 10) return 'Title must be at least 10 characters';
        if (value.length > 100) return 'Title must not exceed 100 characters';
        return undefined;
      },
      description: (value) => {
        if (!value || value.trim().length < 30) {
          return 'Description must be at least 30 characters';
        }
        if (value.length > 500) return 'Description must not exceed 500 characters';
        return undefined;
      },
      price: (value) => {
        const priceNum = parseFloat(value);
        if (!value || Number.isNaN(priceNum)) return 'Please enter a valid price';
        if (priceNum <= 0) return 'Price must be greater than 0';
        if (priceNum > 100000000) return 'Price seems too high';
        return undefined;
      },
      brand: (value) => {
        if (!value || value.trim().length === 0) return 'This field is required';
        return undefined;
      },
      model: (value) => {
        if (!value || value.trim().length === 0) return 'This field is required';
        return undefined;
      },
      color: (value) => {
        if (!value || value.trim().length === 0) return 'This field is required';
        return undefined;
      },
      yearOfPurchase: (value) => {
        if (!value) return 'Please select year of purchase';
        const year = parseInt(value, 10);
        if (Number.isNaN(year) || year < CAR_MIN_YEAR || year > CAR_CURRENT_YEAR) {
          return `Year must be between ${CAR_MIN_YEAR} and ${CAR_CURRENT_YEAR}`;
        }
        return undefined;
      },
      condition: (value) => {
        if (!value) return 'Please select condition';
        return undefined;
      },
      negotiable: (value) => {
        if (value === null || value === undefined) return 'Please select negotiable';
        return undefined;
      },
      fuelType: (value) => {
        if (!value) return 'Please select fuel type';
        return undefined;
      },
      transmission: (value) => {
        if (!value) return 'Please select transmission';
        return undefined;
      },
      kmDriven: (value) => {
        if (!value) return undefined;
        const km = parseInt(value, 10);
        if (Number.isNaN(km) || km < 0) return 'Please enter valid kilometers';
        return undefined;
      },
      numberOfOwners: (value) => {
        if (!value) return undefined;
        const owners = parseInt(value, 10);
        if (Number.isNaN(owners) || owners < 1 || owners > 10) {
          return 'Number of owners must be between 1 and 10';
        }
        return undefined;
      },
      pincode: (value) => {
        if (!value) return undefined;
        if (!/^\d{6}$/.test(value)) return 'Pincode must be 6 digits';
        return undefined;
      },
    }),
    [],
  );

  const normalizers = useMemo<ListingFormNormalizers<CarFormData>>(
    () => ({
      title: stringNormalizer,
      description: stringNormalizer,
      price: stringNormalizer,
      brand: stringNormalizer,
      model: stringNormalizer,
      variant: stringNormalizer,
      color: stringNormalizer,
      yearOfPurchase: stringNormalizer,
      fuelType: stringNormalizer,
      transmission: stringNormalizer,
      kmDriven: stringNormalizer,
      numberOfOwners: stringNormalizer,
      carInsuranceDate: stringNormalizer,
      carInsuranceType: stringNormalizer,
      address: stringNormalizer,
      city: stringNormalizer,
      state: stringNormalizer,
      pincode: stringNormalizer,
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
    getChangedFields,
  } = useListingUpdateForm<CarFormData>({
    initialValues: carInitialValues,
    validators,
    normalizers,
  });

  const fetchCar = useCallback(() => getCarById(carId), [carId]);

  const { data, loading, error } = useListingDetails<CarDetail>(fetchCar, {
    defaultErrorMessage: 'Failed to load car details',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    const nextFormData: CarFormData = {
      title: data.title ?? '',
      description: data.description ?? '',
      price: data.price != null ? String(data.price) : '',
      negotiable: typeof data.negotiable === 'boolean' ? data.negotiable : null,
      condition: (data.condition as string) ?? null,
      brand: data.brand ?? '',
      model: data.model ?? '',
      variant: data.variant ?? '',
      color: data.color ?? '',
      yearOfPurchase: data.yearOfPurchase ? String(data.yearOfPurchase) : '',
      fuelType: (data.fuelType as string) ?? null,
      transmission: (data.transmission as string) ?? null,
      kmDriven: data.kmDriven != null ? String(data.kmDriven) : '',
      numberOfOwners: data.numberOfOwners != null ? String(data.numberOfOwners) : '',
      carInsurance: typeof data.carInsurance === 'boolean' ? data.carInsurance : null,
      carInsuranceDate: data.carInsuranceDate ?? '',
      carInsuranceType: data.carInsuranceType ?? '',
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      pincode: data.pincode ?? '',
      airbag: data.airbag ?? false,
      abs: data.abs ?? false,
      buttonStart: data.buttonStart ?? false,
      sunroof: data.sunroof ?? false,
      childSafetyLocks: data.childSafetyLocks ?? false,
      acFeature: data.acFeature ?? false,
      musicFeature: data.musicFeature ?? false,
      powerWindowFeature: data.powerWindowFeature ?? false,
      rearParkingCameraFeature: data.rearParkingCameraFeature ?? false,
    };

    initializeForm(nextFormData);
    setOwnerSellerId(
      typeof data.sellerId === 'number' && Number.isFinite(data.sellerId) ? data.sellerId : null,
    );
  }, [data, initializeForm]);

  const handleUpdate = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert('Please review the form', 'Correct highlighted fields before saving.');
      return;
    }

    const changedFields = getChangedFields();
    if (changedFields.length === 0) {
      Alert.alert('No changes detected', 'Please update at least one field before saving.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const yearNum = parseInt(formData.yearOfPurchase, 10);
    const kmDrivenNum = formData.kmDriven ? parseInt(formData.kmDriven, 10) : undefined;
    const ownersNum = formData.numberOfOwners ? parseInt(formData.numberOfOwners, 10) : undefined;

    try {
      setSaving(true);

      const payload: UpdateCarDTO = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: priceNum,
        negotiable: formData.negotiable === true,
        condition: formData.condition,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        variant: formData.variant.trim() || undefined,
        color: formData.color.trim(),
        yearOfPurchase: yearNum,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        kmDriven: kmDrivenNum,
        numberOfOwners: ownersNum,
        carInsurance: formData.carInsurance ?? false,
        carInsuranceDate: formData.carInsuranceDate.trim() || undefined,
        carInsuranceType: formData.carInsuranceType.trim() || undefined,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        pincode: formData.pincode.trim() || undefined,
        airbag: formData.airbag,
        abs: formData.abs,
        buttonStart: formData.buttonStart,
        sunroof: formData.sunroof,
        childSafetyLocks: formData.childSafetyLocks,
        acFeature: formData.acFeature,
        musicFeature: formData.musicFeature,
        powerWindowFeature: formData.powerWindowFeature,
        rearParkingCameraFeature: formData.rearParkingCameraFeature,
      };

      const resolvedSellerId =
        (typeof ownerSellerId === 'number' && Number.isFinite(ownerSellerId) && ownerSellerId) ||
        (typeof authSellerId === 'number' && Number.isFinite(authSellerId) && authSellerId) ||
        undefined;

      if (resolvedSellerId !== undefined) {
        Object.assign(payload, { sellerId: resolvedSellerId });
      }

      await updateCar(carId, payload);
      Alert.alert('Success', 'Car updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', getFriendlyApiError(err, 'Failed to update car'));
    } finally {
      setSaving(false);
    }
  }, [
    authSellerId,
    carId,
    formData,
    getChangedFields,
    navigation,
    ownerSellerId,
    validateForm,
  ]);

  if (loading) {
    return <ListingUpdateLoader message="Loading car details..." />;
  }

  return (
    <ListingUpdateLayout
      title="Edit Car Details"
      onBack={() => navigation.goBack()}
      footer={
        <TouchableOpacity
          style={[styles.nextButton, saving && styles.nextButtonDisabled]}
          onPress={handleUpdate}
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
      <CarDetailsForm
        values={formData}
        errors={errors}
        touched={touched}
        onChange={handleChange}
        onBlur={handleBlur}
        yearOptions={yearOptions}
        conditionOptions={CAR_CONDITION_OPTIONS}
        negotiableOptions={CAR_NEGOTIABLE_OPTIONS}
        fuelTypeOptions={CAR_FUEL_TYPE_OPTIONS}
        transmissionOptions={CAR_TRANSMISSION_OPTIONS}
        booleanOptions={CAR_BOOLEAN_OPTIONS}
      />
    </ListingUpdateLayout>
  );
};

export default UpdateCarScreen;
