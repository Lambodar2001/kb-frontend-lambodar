import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyAdsEntryStackParamList } from '@navigation/MyAdsEntryStack';
import MyAdsListLayout from './common/MyAdsListLayout';
import { useMyAdsStatusFilter } from '../hooks/useMyAdsStatusFilter';
import { useMyAllAdsData } from '../hooks/useMyAllAdsData';
import MyAdCard from '../components/myads/MyAdCard';
import MyAdsCardMenu from '../components/myads/MyAdsCardMenu';
import type { MyAdEntityType, MyAdListItem } from '@features/seller/listings/screens/common/types';
import type { MobileItem } from '@features/seller/sell/api/MobilesApi/getAll';
import type { LaptopItem } from '@features/seller/sell/api/LaptopsApi/getAll';
import type { CarItem } from '@features/seller/sell/api/CarsApi/getAll';
import type { BikeItem } from '@features/seller/sell/api/BikesApi/getAllBikes';
import { deleteMobile } from '@features/seller/sell/api/MobilesApi';
import { deleteLaptop } from '@features/seller/sell/api/LaptopsApi';
import { deleteCar } from '@features/seller/sell/api/CarsApi';
import { deleteBike } from '@features/seller/sell/api/BikesApi';
import { ENTITY_ORDER } from '@features/seller/listings/screens/common/entityAdapters';
import { BOTTOM_SHEET_MENU_HEIGHT } from '@shared/constants/listing';
import { useAuth } from '@context/AuthContext';

type NavigationProp = NativeStackNavigationProp<MyAdsEntryStackParamList>;

type EntityBehavior = {
  stack: keyof MyAdsEntryStackParamList;
  detailScreen: string;
  editScreen: string;
  buildDetailParams: (item: MyAdListItem) => Record<string, unknown>;
  buildEditParams: (item: MyAdListItem) => Record<string, unknown>;
  deleteAction: (item: MyAdListItem) => Promise<void>;
};

const asMobile = (item: MyAdListItem): MobileItem => item.payload as MobileItem;
const asLaptop = (item: MyAdListItem): LaptopItem => item.payload as LaptopItem;
const asCar = (item: MyAdListItem): CarItem => item.payload as CarItem;
const asBike = (item: MyAdListItem): BikeItem => item.payload as BikeItem;

const ENTITY_BEHAVIORS: Record<MyAdEntityType, EntityBehavior> = {
  mobile: {
    stack: 'MyMobileAdsStack',
    detailScreen: 'ProductDetails',
    editScreen: 'UpdateMobile',
    buildDetailParams: (item) => ({ mobileId: asMobile(item).mobileId }),
    buildEditParams: (item) => ({ mobileId: asMobile(item).mobileId }),
    deleteAction: async (item) => {
      await deleteMobile(asMobile(item).mobileId);
    },
  },
  laptop: {
    stack: 'MyLaptopAdsStack',
    detailScreen: 'LaptopDetails',
    editScreen: 'UpdateLaptop',
    buildDetailParams: (item) => ({ laptopId: asLaptop(item).id }),
    buildEditParams: (item) => ({ laptopId: asLaptop(item).id }),
    deleteAction: async (item) => {
      await deleteLaptop(asLaptop(item).id);
    },
  },
  car: {
    stack: 'MyCarAdsStack',
    detailScreen: 'ProductDetails',
    editScreen: 'UpdateCar',
    buildDetailParams: (item) => ({ carId: asCar(item).carId }),
    buildEditParams: (item) => ({ carId: asCar(item).carId }),
    deleteAction: async (item) => {
      await deleteCar(asCar(item).carId);
    },
  },
  bike: {
    stack: 'MyBikeAdsStack',
    detailScreen: 'ProductDetails',
    editScreen: 'UpdateBike',
    buildDetailParams: (item) => ({ bikeId: asBike(item).bike_id }),
    buildEditParams: (item) => ({ bikeId: asBike(item).bike_id }),
    deleteAction: async (item) => {
      await deleteBike(asBike(item).bike_id);
    },
  },
};

const MyAdsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { roles, sellerId } = useAuth();
  const {
    items,
    loading,
    refreshing,
    refresh,
    fetchNext,
    hasMore,
    errors,
    isInitialLoading,
  } = useMyAllAdsData();
  const { selectedTab, setSelectedTab, filtered } = useMyAdsStatusFilter({
    items,
    getStatus: (item) => item.status,
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MyAdListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const focusRefreshGuard = useRef(false);
  const lastErrorRef = useRef<string | null>(null);

  // Role guard: Only sellers with valid sellerId can access this screen
  const isSeller = roles.includes('SELLER') && sellerId !== null;

  if (!isSeller) {
    return (
      <View style={roleGuardStyles.container}>
        <Text style={roleGuardStyles.title}>Seller Access Only</Text>
        <Text style={roleGuardStyles.message}>
          This feature is only available for sellers. Please contact support to upgrade your account.
        </Text>
      </View>
    );
  }

  useFocusEffect(
    useCallback(() => {
      if (focusRefreshGuard.current) {
        refresh();
      } else {
        focusRefreshGuard.current = true;
      }
    }, [refresh])
  );

  useEffect(() => {
    const firstError = ENTITY_ORDER.map((type) => errors[type]).find(Boolean);
    if (firstError && firstError !== lastErrorRef.current) {
      lastErrorRef.current = firstError;
      Alert.alert('Failed to load ads', firstError);
    }
    if (!firstError) {
      lastErrorRef.current = null;
    }
  }, [errors]);

  const handleNavigateToDetails = useCallback(
    (item: MyAdListItem) => {
      const behavior = ENTITY_BEHAVIORS[item.entityType];
      if (!behavior) return;
      (navigation as any).navigate(behavior.stack, {
        screen: behavior.detailScreen,
        params: behavior.buildDetailParams(item),
      });
    },
    [navigation]
  );

  const openMenuFor = useCallback((item: MyAdListItem) => {
    setSelectedItem(item);
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
    setSelectedItem(null);
  }, []);

  const handleEdit = useCallback(() => {
    if (!selectedItem) return;
    const behavior = ENTITY_BEHAVIORS[selectedItem.entityType];
    (navigation as any).navigate(behavior.stack, {
      screen: behavior.editScreen,
      params: behavior.buildEditParams(selectedItem),
    });
    closeMenu();
  }, [closeMenu, navigation, selectedItem]);

  const confirmDelete = useCallback(() => {
    if (!selectedItem) return;
    const behavior = ENTITY_BEHAVIORS[selectedItem.entityType];

    Alert.alert(
      `Delete ${selectedItem.entityLabel} ad`,
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await behavior.deleteAction(selectedItem);
              await refresh();
              Alert.alert('Deleted', `${selectedItem.entityLabel} ad removed.`);
            } catch (error: any) {
              const message =
                error?.response?.data?.message ??
                error?.message ??
                'Unable to delete ad. Please try again.';
              Alert.alert('Failed to delete', message);
            } finally {
              setDeleting(false);
              closeMenu();
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [closeMenu, refresh, selectedItem]);

  const renderCard = useCallback(
    ({ item }: { item: MyAdListItem }) => (
      <MyAdCard
        item={item}
        onPress={() => handleNavigateToDetails(item)}
        onMenuPress={() => openMenuFor(item)}
      />
    ),
    [handleNavigateToDetails, openMenuFor]
  );

  return (
    <MyAdsListLayout
      title="My Ads"
      tabLabelSuffix="Ads"
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      data={filtered}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      emptyMessage="No ads found."
      onBack={() => navigation.goBack()}
      menuVisible={menuVisible}
      onCloseMenu={closeMenu}
      bottomSheetHeight={BOTTOM_SHEET_MENU_HEIGHT}
      menuContent={
        <MyAdsCardMenu
          title={selectedItem?.title}
          statusLabel={selectedItem?.status}
          entityLabel={selectedItem?.entityLabel}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          isDeleting={deleting}
          disabled={deleting}
        />
      }
      isInitialLoading={isInitialLoading}
      listProps={{
        numColumns: 1,
        onEndReachedThreshold: 0.35,
        onEndReached: () => {
          if (hasMore) {
            fetchNext();
          }
        },
      }}
    />
  );
};

const roleGuardStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MyAdsScreen;
