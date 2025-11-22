import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const SellerHomeScreen = () => {
  const navigation = useNavigation();
  const { sellerId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    activeAds: 12,
    messages: 3,
    views: 340,
    sold: 9,
  });

  const [activeListings, setActiveListings] = useState([
    {
      id: 1,
      title: 'iPhone 14 Pro Max',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1592286927505-2c17a58e9b30?w=400',
      views: 41,
      status: 'active',
      category: 'mobile',
    },
    {
      id: 2,
      title: 'Honda City 2020',
      price: 950000,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
      views: 63,
      status: 'active',
      category: 'car',
    },
  ]);

  useEffect(() => {
    // simulate API
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // simulate refresh
    setTimeout(() => setRefreshing(false), 800);
  };

  // =========================
  // HEADER - MATCH BUYER UI
  // =========================
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Top Row */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <View style={styles.brandLogo}>
            <Icon name="storefront-outline" size={18} color="#0F172A" />
          </View>

          <Text style={styles.brandText}>
            Kharido
            <Text style={styles.brandGreen}>Becho</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.locationPill}>
          <Icon name="map-marker" size={20} color="#6B7280" />
          <Text style={styles.locationText}>Pune</Text>
          <Icon name="chevron-down" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Bottom Row */}
      <View style={styles.headerBottomRow}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your listings…"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity style={styles.roundIconButton}>
          <Icon name="bell-outline" size={20} color="#0F172A" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{stats.messages}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // =========================
  // POST AD CARD (IMAGE REMOVED)
  // =========================
  const renderPostAd = () => (
    <View style={styles.postAdCard}>
      <Text style={styles.postAdTitle}>Post a new Ad</Text>
      <Text style={styles.postAdSubtitle}>
        List your car, bike, mobile or more and start getting buyers in minutes.
      </Text>
      <TouchableOpacity
        style={styles.postAdButton}
        onPress={() => navigation.navigate('SellEntry' as never)}
      >
        <Text style={styles.postAdButtonText}>Start Selling</Text>
        <Icon name="arrow-right" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // =========================
  // QUICK ACTIONS
  // =========================
  const QUICK_ACTIONS = [
    { id: 'ads', name: 'My Ads', icon: 'format-list-bulleted' },
    { id: 'analytics', name: 'Analytics', icon: 'chart-bar' },
    { id: 'messages', name: 'Messages', icon: 'message-outline' },
    { id: 'earnings', name: 'Earnings', icon: 'wallet-outline' },
    { id: 'favorites', name: 'Favorites', icon: 'heart-outline' },
    { id: 'settings', name: 'Settings', icon: 'cog-outline' },
  ];

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {QUICK_ACTIONS.map(action => (
          <TouchableOpacity key={action.id} style={styles.quickActionCard}>
            <View style={styles.quickActionIconBox}>
              <Icon name={action.icon} size={24} color="#0F172A" />
            </View>
            <Text style={styles.quickActionText}>{action.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // =========================
  // ACTIVE LISTINGS (MATCH BUYER CARDS)
  // =========================
  const renderActiveListings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Active Listings</Text>

      <View style={styles.productsGrid}>
        {activeListings.map(listing => (
          <TouchableOpacity key={listing.id} style={styles.productCard}>
            <View style={styles.productImageContainer}>
              <Image source={{ uri: listing.image }} style={styles.productImage} />

              <View style={styles.viewBadge}>
                <Icon name="eye-outline" size={14} color="#fff" />
                <Text style={styles.viewBadgeText}>{listing.views}</Text>
              </View>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productPrice}>
                ₹ {listing.price.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.productTitle} numberOfLines={2}>
                {listing.title}
              </Text>
              <Text style={styles.productLocation}>{listing.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderHeader()}
        {renderPostAd()}
        {renderQuickActions()}
        {renderActiveListings()}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellerHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },

  // HEADER
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#E5F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 10,
  },
  brandGreen: {
    color: '#22C55E',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginHorizontal: 4,
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    padding: 0,
    fontSize: 14,
    color: '#111827',
  },
  roundIconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },

  // POST AD CARD (no image)
  postAdCard: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  postAdTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  postAdSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 14,
  },
  postAdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  postAdButtonText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 8,
    fontWeight: '700',
  },

  // Sections
 section: {
   marginTop: 24,
   paddingHorizontal: 16,
   backgroundColor: '#FFFFFF',     // 👈 added
   paddingVertical: 20,
   borderRadius: 16,
   shadowColor: '#000',
   shadowOpacity: 0.04,
   shadowOffset: { width: 0, height: 2 },
   shadowRadius: 4,
   elevation: 2,
 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },

  // Product grid (same pattern as buyer)
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  productCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  productImageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  viewBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewBadgeText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
  },
  productInfo: {
    paddingTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  productTitle: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4,
  },
  productLocation: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});
