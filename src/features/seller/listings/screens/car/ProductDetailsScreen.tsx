import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MyCarAdsStackParamList } from '../../navigation/MyCarAdsStack';
import ListingDetailsLayout, {
  DetailSection,
} from '../../components/details/ListingDetailsLayout';
import BottomSheet from '../../components/myads/BottomSheet';
import BottomActionBar from '../../components/myadsFlowComponents/BottomActionBar';
import CarCardMenu from '../../../sell/components/car/CarCardMenu';
import useListingDetails from '../../hooks/useListingDetails';
import { deleteCar, getCarById, CarDetail } from '@features/seller/sell/api/CarsApi';
import { formatPriceWithNegotiable } from '@shared/utils';
import { ACTION_BAR_HEIGHT, BOTTOM_SHEET_MENU_HEIGHT } from '@shared/constants/listing';

type DetailsRouteProp = RouteProp<MyCarAdsStackParamList, 'ProductDetails'>;
type NavProp = NativeStackNavigationProp<MyCarAdsStackParamList>;

const PLACEHOLDER_IMAGE = require('@assets/icons/bike.png');

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<DetailsRouteProp>();
  const { carId } = params;
  const insets = useSafeAreaInsets();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCar = useCallback(() => getCarById(carId), [carId]);

  const { data, loading, error, refetch } = useListingDetails<CarDetail>(fetchCar, {
    defaultErrorMessage: 'Failed to load details',
  });

  const images = useMemo(() => {
    return (data?.images || []).filter(
      (uri): uri is string => typeof uri === 'string' && uri.trim().length > 0
    );
  }, [data?.images]);

  const titleText = useMemo(() => {
    if (!data) return `Car #${carId}`;
    if (data.title && data.title.trim().length > 0) return data.title;
    const parts = [data.brand, data.model].filter((part) => part && String(part).trim().length > 0);
    if (parts.length > 0) return parts.join(' ');
    return `Car #${carId}`;
  }, [data, carId]);

  const priceText = useMemo(() => {
    return formatPriceWithNegotiable(data?.price, data?.negotiable);
  }, [data?.price, data?.negotiable]);

  const metaLines = useMemo(() => {
    if (!data) return [];
    const pieces: string[] = [];
    if (data.yearOfPurchase) pieces.push(`Purchased ${data.yearOfPurchase}`);
    if (data.condition) pieces.push(data.condition);
    return pieces.length > 0 ? [pieces.join(' | ')] : [];
  }, [data]);

  const detailSections = useMemo<DetailSection[]>(() => {
    if (!data) return [];

    const productSection = [
      { label: 'Brand', value: data.brand ?? '' },
      { label: 'Model', value: data.model ?? '' },
      { label: 'Variant', value: data.variant ?? '' },
      { label: 'Colour', value: data.color ?? '' },
      { label: 'Condition', value: data.condition ?? '' },
      {
        label: 'Year of Purchase',
        value: data.yearOfPurchase != null ? String(data.yearOfPurchase) : '',
      },
      { label: 'Fuel Type', value: data.fuelType ?? '' },
      { label: 'Transmission', value: data.transmission ?? '' },
      {
        label: 'KM Driven',
        value: data.kmDriven != null ? `${data.kmDriven.toLocaleString()} km` : '',
      },
      {
        label: 'Number of Owners',
        value: data.numberOfOwners != null ? String(data.numberOfOwners) : '',
      },
    ].filter((row) => row.value && row.value.trim().length > 0);

    const insuranceSection = [
      {
        label: 'Insurance',
        value: data.carInsurance ? 'Yes' : 'No',
      },
      { label: 'Insurance Type', value: data.carInsuranceType ?? '' },
      { label: 'Insurance Valid Till', value: data.carInsuranceDate ?? '' },
    ].filter((row) => row.value && row.value.trim().length > 0);

    const featuresSection = [
      { label: 'Airbag', value: data.airbag ? 'Yes' : 'No' },
      { label: 'ABS', value: data.abs ? 'Yes' : 'No' },
      { label: 'Button Start', value: data.buttonStart ? 'Yes' : 'No' },
      { label: 'Sunroof', value: data.sunroof ? 'Yes' : 'No' },
      { label: 'Child Safety Locks', value: data.childSafetyLocks ? 'Yes' : 'No' },
      { label: 'AC Feature', value: data.acFeature ? 'Yes' : 'No' },
      { label: 'Music System', value: data.musicFeature ? 'Yes' : 'No' },
      { label: 'Power Windows', value: data.powerWindowFeature ? 'Yes' : 'No' },
      { label: 'Rear Parking Camera', value: data.rearParkingCameraFeature ? 'Yes' : 'No' },
    ].filter((row) => row.value === 'Yes');

    const locationSection = [
      { label: 'Address', value: data.address ?? '' },
      { label: 'City', value: data.city ?? '' },
      { label: 'State', value: data.state ?? '' },
      { label: 'Pincode', value: data.pincode ?? '' },
    ].filter((row) => row.value && row.value.trim().length > 0);

    const sections: DetailSection[] = [];
    if (productSection.length > 0) sections.push({ title: 'Product Details', rows: productSection });
    if (insuranceSection.length > 0) sections.push({ title: 'Insurance', rows: insuranceSection });
    if (featuresSection.length > 0) sections.push({ title: 'Features', rows: featuresSection });
    if (locationSection.length > 0) sections.push({ title: 'Location', rows: locationSection });

    return sections;
  }, [data]);

  const descriptionText = data?.description?.trim() ?? null;
  const badgeLabel = data?.status || 'Status unavailable';

  const handleRetry = useCallback(() => {
    refetch().catch(() => {
      /* handled inside hook */
    });
  }, [refetch]);

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check this car on CarYanam: ${titleText}`,
      });
    } catch {
      /* share cancelled */
    }
  }, [titleText]);

  const handleEdit = useCallback(() => {
    setSheetVisible(false);
    navigation.navigate('UpdateCar', { carId });
  }, [carId, navigation]);

  const confirmDelete = useCallback(() => {
    if (deleting || !data) return;
    Alert.alert(
      'Delete car',
      'Are you sure you want to delete this car?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteCar(carId);
              setSheetVisible(false);
              Alert.alert('Deleted', 'Car removed from your listings', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e: any) {
              Alert.alert('Failed', e?.response?.data?.message || 'Unable to delete car');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [data, deleting, carId, navigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (deleting) {
        setDeleting(false);
      }
    };
  }, [deleting]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading car details...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.center, styles.contentPadding]}>
        <Text style={styles.errorText}>{error || 'Unable to load details.'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ListingDetailsLayout
        images={images}
        placeholderSource={PLACEHOLDER_IMAGE}
        badgeLabel={badgeLabel}
        title={titleText}
        price={priceText}
        detailSections={detailSections}
        metaLines={metaLines}
        description={descriptionText}
        onBack={() => navigation.goBack()}
        onShare={onShare}
        onMenu={() => setSheetVisible(true)}
        actionBarHeight={ACTION_BAR_HEIGHT}
        bottomInset={insets.bottom}
      />

      <BottomActionBar
        onChat={() => Alert.alert('Coming Soon', 'Chat feature will be available soon.')}
        onBid={() => console.log('Start Bidding')}
      />

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} height={BOTTOM_SHEET_MENU_HEIGHT}>
        <CarCardMenu
          title={titleText}
          statusLabel={data.status}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          isDeleting={deleting}
          disabled={deleting}
        />
      </BottomSheet>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  contentPadding: { paddingHorizontal: 32 },
  loadingText: { marginTop: 8, color: '#666' },
  errorText: { color: '#c00', marginBottom: 16, textAlign: 'center' },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#216DBD',
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
