// src/features/buyer/chat/screens/BuyerChatListScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@context/AuthContext';
import { getBuyerChatRequests } from '../api/chatApi';
import { ChatRequest } from '../types';
import ChatRequestCard from '../components/ChatRequestCard';

type FilterType = 'all' | 'active' | 'completed';

const BuyerChatListScreen = () => {
  const navigation = useNavigation();
  const { buyerId } = useAuth();

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);

  // Load chat requests
  const loadChatRequests = useCallback(async () => {
    if (!buyerId) {
      setError('Buyer profile not found. Please complete your profile.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const requests = await getBuyerChatRequests(buyerId);

      // Sort by latest activity (most recent first)
      const sortedRequests = requests.sort((a, b) => {
        const aTime = a.updatedAt || a.createdAt;
        const bTime = b.updatedAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setChatRequests(sortedRequests);
      filterRequests(sortedRequests, selectedFilter);
    } catch (err: any) {
      console.error('[CHAT_LIST] Error loading chat requests:', err);
      setError(err?.errorMessage || 'Failed to load chats. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [buyerId, selectedFilter]);

  // Filter requests based on selected filter
  const filterRequests = (requests: ChatRequest[], filter: FilterType) => {
    let filtered = requests;

    switch (filter) {
      case 'active':
        filtered = requests.filter(
          (req) => req.status === 'PENDING' || req.status === 'IN_NEGOTIATION'
        );
        break;
      case 'completed':
        filtered = requests.filter(
          (req) => req.status === 'COMPLETED' || req.status === 'REJECTED' || req.status === 'ACCEPTED'
        );
        break;
      case 'all':
      default:
        filtered = requests;
        break;
    }

    setFilteredRequests(filtered);
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    filterRequests(chatRequests, filter);
  };

  // Initial load
  useEffect(() => {
    loadChatRequests();
  }, []);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadChatRequests();
    setRefreshing(false);
  };

  // Handle chat request press
  const handleChatPress = (request: ChatRequest) => {
    navigation.navigate('BuyerChatThread' as never, {
      requestId: request.requestId,
      mobileTitle: `Mobile Request #${request.mobileId}`,
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
        onPress={loadChatRequests}
        activeOpacity={0.8}
      >
        <Icon name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Render list item
  const renderChatItem = ({ item }: { item: ChatRequest }) => (
    <ChatRequestCard
      request={item}
      onPress={() => handleChatPress(item)}
      mobileTitle={`Mobile Request #${item.mobileId}`}
      // TODO: Add mobile details when API provides them
      // mobileTitle={item.mobileTitle}
      // mobileImage={item.mobileImage}
      // mobilePrice={item.mobilePrice}
    />
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
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
        <Text style={styles.headerTitle}>Chats</Text>
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
          keyExtractor={(item) => item.requestId.toString()}
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
