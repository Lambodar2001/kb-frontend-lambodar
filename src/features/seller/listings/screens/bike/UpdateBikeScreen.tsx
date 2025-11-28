import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyBikeAdsStackParamList } from '../../navigation/MyBikeAdsStack';
import { getBikeById, updateBike, UpdateBikeDTO, BikeDetail } from '@features/seller/sell/api/BikesApi';
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
import BikeDetailsForm, {
  BikeFormData,
} from '../../components/listingUpdate/forms/BikeDetailsForm';
import {
  BIKE_FUEL_TYPE_OPTIONS,
  buildBikeYearOptions,
  BIKE_CURRENT_YEAR,
  BIKE_MIN_YEAR,
} from '../../../sell/screens/bike/constants/bikeFormOptions';

type UpdateRouteProp = RouteProp<MyBikeAdsStackParamList, 'UpdateBike'>;
type UpdateNavProp = NativeStackNavigationProp<MyBikeAdsStackParamList, 'UpdateBike'>;

const styles = listingUpdateStyles;

const bikeInitialValues: BikeFormData = {
  brand: '',
  model: '',
  variant: '',
  manufactureYear: '',
  engineCC: '',
  kilometersDriven: '',
  fuelType: null,
  color: '',
  registrationNumber: '',
  prize: '',
  description: '',
};

const stringNormalizer = (value: any) => (typeof value === 'string' ? value.trim() : value);

const UpdateBikeScreen: React.FC = () => {
  const navigation = useNavigation<UpdateNavProp>();
  const {
    params: { bikeId },
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

  const yearOptions = useMemo(() => buildBikeYearOptions(), []);

  const validators = useMemo<ListingFormValidators<BikeFormData>>(
    () => ({
      brand: (value) => {
        if (!value || value.trim().length < 2) return 'Brand name is required';
        return undefined;
      },
      model: (value) => {
        if (!value || value.trim().length < 1) return 'Model name is required';
        return undefined;
      },
      variant: (value) => {
        if (!value || value.trim().length < 1) return 'Variant is required';
        return undefined;
      },
      color: (value) => {
        if (!value || value.trim().length < 2) return 'Color is required';
        return undefined;
      },
      description: (value) => {
        if (!value || value.trim().length < 20) {
          return 'Description must be at least 20 characters';
        }
        if (value.length > 400) return 'Description must not exceed 400 characters';
        return undefined;
      },
      prize: (value) => {
        const price = parseFloat(value);
        if (!value || Number.isNaN(price)) return 'Please enter a valid price';
        if (price <= 0 || price > 10000000) {
          return 'Please enter a valid price between 1 and 10000000';
        }
        return undefined;
      },
      manufactureYear: (value) => {
        if (!value || value.length < 4) return 'Please select manufacture year';
        const year = parseInt(value, 10);
        if (Number.isNaN(year) || year < BIKE_MIN_YEAR || year > BIKE_CURRENT_YEAR) {
          return `Please select a valid year between ${BIKE_MIN_YEAR} and ${BIKE_CURRENT_YEAR}`;
        }
        return undefined;
      },
      engineCC: (value) => {
        if (!value) return undefined;
        const cc = parseInt(value, 10);
        if (Number.isNaN(cc) || cc < 0) return 'Please enter a valid number';
        return undefined;
      },
      kilometersDriven: (value) => {
        if (!value) return undefined;
        const km = parseInt(value, 10);
        if (Number.isNaN(km) || km < 0) return 'Please enter a valid number';
        return undefined;
      },
      registrationNumber: (value) => {
        if (!value || value.trim().length < 5) return 'Registration number is required';
        return undefined;
      },
      fuelType: (value) => {
        if (!value) return 'Please select fuel type';
        return undefined;
      },
    }),
    [],
  );

  const normalizers = useMemo<ListingFormNormalizers<BikeFormData>>(
    () => ({
      brand: stringNormalizer,
      model: stringNormalizer,
      variant: stringNormalizer,
      manufactureYear: stringNormalizer,
      engineCC: stringNormalizer,
      kilometersDriven: stringNormalizer,
      fuelType: stringNormalizer,
      color: stringNormalizer,
      registrationNumber: stringNormalizer,
      prize: stringNormalizer,
      description: stringNormalizer,
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
  } = useListingUpdateForm<BikeFormData>({
    initialValues: bikeInitialValues,
    validators,
    normalizers,
  });

  const fetchBike = useCallback(() => getBikeById(bikeId), [bikeId]);

  const { data, loading, error } = useListingDetails<BikeDetail>(fetchBike, {
    defaultErrorMessage: 'Failed to load bike details',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    const nextFormData: BikeFormData = {
      brand: data.brand ?? '',
      model: data.model ?? '',
      variant: data.variant ?? '',
      manufactureYear: data.manufactureYear ? String(data.manufactureYear) : '',
      engineCC: data.engineCC != null ? String(data.engineCC) : '',
      kilometersDriven: data.kilometersDriven != null ? String(data.kilometersDriven) : '',
      fuelType: (data.fuelType as string) ?? null,
      color: data.color ?? '',
      registrationNumber: data.registrationNumber ?? '',
      prize: data.prize != null ? String(data.prize) : '',
      description: data.description ?? '',
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

    const prizeNum = parseFloat(formData.prize);
    const yearNum = parseInt(formData.manufactureYear, 10);
    const engineCCNum = formData.engineCC ? parseInt(formData.engineCC, 10) : undefined;
    const kmNum = formData.kilometersDriven ? parseInt(formData.kilometersDriven, 10) : undefined;

    try {
      setSaving(true);

      const payload: UpdateBikeDTO = {
        prize: prizeNum,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        variant: formData.variant.trim(),
        manufactureYear: yearNum,
        engineCC: engineCCNum,
        kilometersDriven: kmNum,
        fuelType: formData.fuelType || undefined,
        color: formData.color.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        description: formData.description.trim(),
        status: 'ACTIVE',
      };

      const resolvedSellerId =
        (typeof ownerSellerId === 'number' && Number.isFinite(ownerSellerId) && ownerSellerId) ||
        (typeof authSellerId === 'number' && Number.isFinite(authSellerId) && authSellerId) ||
        undefined;

      if (resolvedSellerId !== undefined) {
        Object.assign(payload, { sellerId: resolvedSellerId });
      }

      await updateBike(bikeId, payload);
      Alert.alert('Success', 'Bike updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', getFriendlyApiError(err, 'Failed to update bike'));
    } finally {
      setSaving(false);
    }
  }, [
    authSellerId,
    bikeId,
    formData,
    getChangedFields,
    navigation,
    ownerSellerId,
    validateForm,
  ]);

  if (loading) {
    return <ListingUpdateLoader message="Loading bike details..." />;
  }

  return (
    <ListingUpdateLayout
      title="Edit Bike Details"
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
      <BikeDetailsForm
        values={formData}
        errors={errors}
        touched={touched}
        onChange={handleChange}
        onBlur={handleBlur}
        yearOptions={yearOptions}
        fuelTypeOptions={BIKE_FUEL_TYPE_OPTIONS}
      />
    </ListingUpdateLayout>
  );
};

export default UpdateBikeScreen;
