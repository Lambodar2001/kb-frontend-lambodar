// src/features/buyer/chat/screens/BuyerChatListScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@context/AuthContext';
import { useBookingList } from '@core/booking/hooks';
import { EntityType, MobileEntity } from '@core/booking/types/entity.types';
import { Booking } from '@core/booking/types/booking.types';
import ChatRequestCard from '../components/ChatRequestCard';

type FilterType = 'all' | 'active' | 'completed';

interface RouteParams {
  entityType: EntityType;
  entityName: string;
}

const BuyerChatListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { buyerId } = useAuth();

  // ========================================
  // MOBILE BOOKING BLOCK - Get params from route
  // ========================================
  const { entityType = 'mobile', entityName = 'Mobile' } = route.params || {};

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Use generic booking hook with dynamic entityType
  const { bookings, loading, error: apiError, refresh } = useBookingList<MobileEntity>({
    entityType,
    buyerId: buyerId || 0,
    enabled: !!buyerId,
  });

  const [refreshing, setRefreshing] = useState(false);
  const error = apiError || (!buyerId ? 'Buyer profile not found. Please complete your profile.' : null);

  // Mark initial load as complete once loading is done
  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  // Calculate filtered requests during render using useMemo
  const filteredRequests = useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return [];
    }

    // Sort by latest activity (most recent first)
    const sortedBookings = [...bookings].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt;
      const bTime = b.updatedAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    let filtered = sortedBookings;

    switch (selectedFilter) {
      case 'active':
        filtered = sortedBookings.filter(
          (req) => req.status === 'PENDING' || req.status === 'IN_NEGOTIATION'
        );
        break;
      case 'completed':
        filtered = sortedBookings.filter(
          (req) => req.status === 'COMPLETED' || req.status === 'REJECTED' || req.status === 'ACCEPTED'
        );
        break;
      case 'all':
      default:
        filtered = sortedBookings;
        break;
    }

    return filtered as Booking<MobileEntity>[];
  }, [bookings, selectedFilter]);

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Handle chat request press
  const handleChatPress = (request: any) => {
    navigation.navigate('BuyerChatThread' as never, {
      requestId: request.bookingId || request.requestId,
      mobileTitle: `Mobile Request #${request.entityId}`,
      sellerId: request.sellerId,
    } as never);
  };

  // Render filter tabs
  const renderFilterTabs = () => {
    const filters: { key: FilterType; label: string }[] = [
      { key: 'all', label: 'All' },
      { key: 'active', label: 'Active' },
      { key: 'completed', label: 'Completed' },
    ];

    return (
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(filter.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
            {selectedFilter === filter.key && <View style={styles.filterIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="chat-outline" size={64} color="#CBD5E1" />
      </View>
      <Text style={styles.emptyTitle}>No chat requests yet</Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'active'
          ? 'You don\'t have any active chats'
          : selectedFilter === 'completed'
          ? 'No completed chats found'
          : 'Start browsing and make inquiries\nto chat with sellers'}
      </Text>
      {selectedFilter === 'all' && (
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('BuyerHome' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.browseButtonText}>Browse Categories</Text>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.errorIconContainer}>
        <Icon name="alert-circle-outline" size={64} color="#EF4444" />
      </View>
      <Text style={styles.emptyTitle}>Something went wrong</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRefresh}
        activeOpacity={0.8}
      >
        <Icon name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Render list item
  const renderChatItem = ({ item }: { item: Booking<MobileEntity> }) => (
    <ChatRequestCard
      request={item}
      onPress={() => handleChatPress(item)}
      mobileTitle={`Mobile Request #${item.entityId}`}
      // TODO: Add mobile details when API provides them
      // mobileTitle={item.mobileTitle}
      // mobileImage={item.mobileImage}
      // mobilePrice={item.mobilePrice}
    />
  );

  // Loading state - show loading on initial load only
  if (isInitialLoad && loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#002F34" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{entityName} Chats</Text>
          <View style={styles.headerIconButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F5E87" />
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#002F34" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{entityName} Chats</Text>
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
          <Icon name="magnify" size={24} color="#002F34" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      {renderFilterTabs()}

      {/* Chat List */}
      {error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.bookingId.toString()}
          contentContainerStyle={
            filteredRequests.length === 0 ? styles.emptyList : styles.listContent
          }
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0F5E87']}
              tintColor="#0F5E87"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002F34',
    letterSpacing: 0.3,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginRight: 8,
    position: 'relative',
  },
  filterTabActive: {
    // Active state styling handled by indicator
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#0F5E87',
  },
  filterIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0F5E87',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002F34',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F5E87',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#0F5E87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default BuyerChatListScreen;
