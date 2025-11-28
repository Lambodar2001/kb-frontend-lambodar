import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyAdsStackParamList } from '../../navigation/MyMobileAdsStack';
import { getMobileById, updateMobile, UpdateMobileDTO, MobileDetail } from '@features/seller/sell/api/MobilesApi';
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
import MobileDetailsForm, {
  MobileFormData,
} from '../../components/listingUpdate/forms/MobileDetailsForm';
import {
  buildMobileYearOptions,
  MOBILE_CONDITION_OPTIONS,
  MOBILE_NEGOTIABLE_OPTIONS,
  MOBILE_CURRENT_YEAR,
  MOBILE_MIN_YEAR,
} from '../../../sell/screens/mobile/constants/mobileFormOptions';

type UpdateRouteProp = RouteProp<MyAdsStackParamList, 'UpdateMobile'>;
type UpdateNavProp = NativeStackNavigationProp<MyAdsStackParamList, 'UpdateMobile'>;

const styles = listingUpdateStyles;

const mobileInitialValues: MobileFormData = {
  title: '',
  description: '',
  price: '',
  negotiable: null,
  condition: null,
  brand: '',
  model: '',
  color: '',
  yearOfPurchase: '',
};

const stringNormalizer = (value: any) => (typeof value === 'string' ? value.trim() : value);

const UpdateMobileScreen: React.FC = () => {
  const navigation = useNavigation<UpdateNavProp>();
  const { params } = useRoute<UpdateRouteProp>();
  const { mobileId } = params;
  const { sellerId: authSellerId } = useAuth();
  const [saving, setSaving] = useState(false);
  const [ownerSellerId, setOwnerSellerId] = useState<number | null>(null);

  const yearOptions = useMemo(() => buildMobileYearOptions(), []);

  const validators = useMemo<ListingFormValidators<MobileFormData>>(
    () => ({
      title: (value) => {
        if (!value || value.trim().length < 5) return 'Title must be at least 5 characters';
        if (value.length > 80) return 'Title must not exceed 80 characters';
        return undefined;
      },
      description: (value) => {
        if (!value || value.trim().length < 20) {
          return 'Description must be at least 20 characters';
        }
        if (value.length > 400) return 'Description must not exceed 400 characters';
        return undefined;
      },
      price: (value) => {
        const priceNum = parseFloat(value);
        if (!value || Number.isNaN(priceNum)) return 'Please enter a valid price';
        if (priceNum <= 0) return 'Price must be greater than 0';
        if (priceNum > 10000000) return 'Price seems too high';
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
        if (Number.isNaN(year) || year < MOBILE_MIN_YEAR || year > MOBILE_CURRENT_YEAR) {
          return `Year must be between ${MOBILE_MIN_YEAR} and ${MOBILE_CURRENT_YEAR}`;
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
    }),
    [],
  );

  const normalizers = useMemo<ListingFormNormalizers<MobileFormData>>(
    () => ({
      title: stringNormalizer,
      description: stringNormalizer,
      price: stringNormalizer,
      negotiable: (value) => value,
      condition: stringNormalizer,
      brand: stringNormalizer,
      model: stringNormalizer,
      color: stringNormalizer,
      yearOfPurchase: stringNormalizer,
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
  } = useListingUpdateForm<MobileFormData>({
    initialValues: mobileInitialValues,
    validators,
    normalizers,
  });

  const fetchMobile = useCallback(() => getMobileById(mobileId), [mobileId]);

  const { data, loading, error } = useListingDetails<MobileDetail>(fetchMobile, {
    defaultErrorMessage: 'Failed to load mobile details',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    const nextFormData: MobileFormData = {
      title: data.title ?? '',
      description: data.description ?? '',
      price: data.price != null ? String(data.price) : '',
      negotiable: typeof data.negotiable === 'boolean' ? data.negotiable : null,
      condition: (data.condition as string) ?? null,
      brand: data.brand ?? '',
      model: data.model ?? '',
      color: data.color ?? '',
      yearOfPurchase: data.yearOfPurchase ? String(data.yearOfPurchase) : '',
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

    try {
      setSaving(true);

      const payload: UpdateMobileDTO = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: priceNum,
        negotiable: formData.negotiable === true,
        condition: formData.condition,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        color: formData.color.trim(),
        yearOfPurchase: yearNum,
      };

      const resolvedSellerId =
        (typeof ownerSellerId === 'number' && Number.isFinite(ownerSellerId) && ownerSellerId) ||
        (typeof authSellerId === 'number' && Number.isFinite(authSellerId) && authSellerId) ||
        undefined;

      if (resolvedSellerId !== undefined) {
        Object.assign(payload, { sellerId: resolvedSellerId });
      }

      await updateMobile(mobileId, payload);
      Alert.alert('Success', 'Mobile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', getFriendlyApiError(err, 'Failed to update mobile'));
    } finally {
      setSaving(false);
    }
  }, [authSellerId, formData, getChangedFields, mobileId, navigation, ownerSellerId, validateForm]);

  if (loading) {
    return <ListingUpdateLoader message="Loading mobile details..." />;
  }

  return (
    <ListingUpdateLayout
      title="Edit Mobile Details"
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
      <MobileDetailsForm
        values={formData}
        errors={errors}
        touched={touched}
        onChange={handleChange}
        onBlur={handleBlur}
        yearOptions={yearOptions}
        conditionOptions={MOBILE_CONDITION_OPTIONS}
        negotiableOptions={MOBILE_NEGOTIABLE_OPTIONS}
      />
    </ListingUpdateLayout>
  );
};

export default UpdateMobileScreen;

