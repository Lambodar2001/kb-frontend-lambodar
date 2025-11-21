import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MyBikeAdsStackParamList } from '../../navigation/MyBikeAdsStack';
import { deleteBike } from '@features/seller/sell/api/BikesApi/deleteBike';
import { getAllBikes } from '@features/seller/sell/api/BikesApi/getAllBikes';

import BikeCard from '../../components/bikes/BikeCard';
import BikeCardMenu from '../../components/bikes/BikeCardMenu';
import MyAdsListLayout from '../MyAds/common/MyAdsListLayout';
import { useMyAdsStatusFilter } from '../../hooks/useMyAdsStatusFilter';
import { formatINR } from '@shared/utils';

type NavigationProp = NativeStackNavigationProp<MyBikeAdsStackParamList>;

type ApiBike = {
  bikeId: number;
  title: string;
  description?: string;
  price: number;
  negotiable?: boolean;
  condition?: string;
  brand?: string;
  model?: string;
  variant?: string;
  color?: string;
  manufactureYear?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'SOLD' | string;
  createdAt?: string;
  updatedAt?: string | null;
  sellerId?: number;
  images?: string[];
};

const MyBikesAdsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [bikes, setBikes] = useState<ApiBike[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<ApiBike | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { selectedTab, setSelectedTab, filtered } = useMyAdsStatusFilter({
    items: bikes,
    getStatus: (item) => item.status,
  });

  const fetchData = async (reset = false) => {
    if (loading && !reset) return;
    try {
      if (reset) {
        setPage(0);
        setHasMore(true);
      }
      setLoading(true);
      const res = await getAllBikes({
        page: reset ? 0 : page,
        size: 20,
        sort: 'createdAt,DESC',
      });
      setHasMore(res?.last === false);
      setPage((prev) => (reset ? 1 : prev + 1));
      setBikes((prev) => (reset ? res.content : [...prev, ...res.content]));
    } catch (e) {
      console.warn('getAllBikes error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const openMenuFor = (bike: ApiBike) => {
    setSelectedBike(bike);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setSelectedBike(null);
  };

  const handleEdit = () => {
    if (!selectedBike) return;
    (navigation as any).navigate('UpdateBike', { bikeId: selectedBike.bikeId });
    closeMenu();
  };

  const handleDelete = () => {
    if (!selectedBike || deleting) return;

    Alert.alert(
      'Delete bike',
      'Are you sure you want to delete this bike?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteBike(selectedBike.bikeId);
              await fetchData(true);
              Alert.alert('Deleted', 'Bike soft-deleted');
            } catch (e: any) {
              Alert.alert('Failed', e?.response?.data?.message ?? 'Please try again');
            } finally {
              setDeleting(false);
              closeMenu();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderAdCard = ({ item }: { item: ApiBike }) => {
    const primaryImage = item.images?.[0]
      ? { uri: item.images[0] }
      : require('../../assets/icons/bike.png');

    const titleText = item.title || 'Untitled Bike';
    const subtitleText = [item.brand, item.manufactureYear?.toString()].filter(Boolean).join(' | ');

    return (
      <BikeCard
        image={primaryImage}
        priceText={formatINR(item.price)}
        title={titleText}
        subtitle={subtitleText}
        location="Pune"
        badgeText={item.status === 'ACTIVE' ? 'Live' : (item.status ?? 'Info')}
        onPress={() => navigation.navigate('ProductDetails', { bikeId: item.bikeId })}
        onMenuPress={() => openMenuFor(item)}
      />
    );
  };

  const listFooter =
    hasMore && loading ? <ActivityIndicator style={{ paddingVertical: 16 }} /> : null;

  return (
    <MyAdsListLayout
      title="My Bike Ads"
      tabLabelSuffix="Bikes"
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      data={filtered}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={renderAdCard}
      keyExtractor={(item) => String(item.bikeId)}
      emptyMessage="No bikes found."
      onBack={() => navigation.goBack()}
      menuVisible={menuOpen}
      onCloseMenu={closeMenu}
      menuContent={
        <BikeCardMenu
          title={selectedBike?.title}
          statusLabel={selectedBike?.status}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleting}
          disabled={deleting}
        />
      }
      isInitialLoading={loading && bikes.length === 0}
      listProps={{
        onEndReachedThreshold: 0.3,
        onEndReached: () => {
          if (hasMore && !loading) {
            fetchData(false);
          }
        },
        ListFooterComponent: listFooter,
      }}
    />
  );
};

export default MyBikesAdsListScreen;
