import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@context/AuthContext';
import secondHandBikeImage from '@assets/buyerScreen/second-hand-bike.jpeg';
import hondaBikeImage from '@assets/buyerScreen/honda-bike.jpeg';
import { getAllEntityConfigs } from '../../browse/config/entityConfigs';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Product {
  id: number;
  title: string;
  price: number;
  location: string;
  image: string;
  category: string;
  isFavorite?: boolean;
  featured?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

const CATEGORIES: Category[] = [
  { id: 'mobile', name: 'Mobiles', icon: 'cellphone', image: '📱' },
  { id: 'laptop', name: 'Laptops', icon: 'laptop', image: '💻' },
  { id: 'car', name: 'Cars', icon: 'car', image: '🚗' },
  { id: 'bike', name: 'Bikes', icon: 'motorbike', image: '🏍️' },
  { id: 'properties', name: 'Properties', icon: 'office-building', image: '🏢' },
  { id: 'jobs', name: 'Jobs', icon: 'briefcase', image: '💼' },
  { id: 'fashion', name: 'Fashion', icon: 'hanger', image: '👔' },
  { id: 'electronics', name: 'Electronics', icon: 'television', image: '🖥️' },
  { id: 'commercial', name: 'Vehicles', icon: 'truck', image: '🚚' },
  { id: 'furniture', name: 'Furniture', icon: 'sofa', image: '🛋️' },
  { id: 'pets', name: 'Pets', icon: 'paw', image: '🐾' },
  { id: 'fashion2', name: 'Fashion', icon: 'hanger', image: '👔' },

];

const BuyerHomeScreen = () => {
  const navigation = useNavigation();
  const { userId } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const localSecondHandBikeImage = Image.resolveAssetSource(
        secondHandBikeImage
      ).uri;
      const localHondaBikeImage = Image.resolveAssetSource(
        hondaBikeImage
      ).uri;

      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Royal Enfield HIMALAYAN 450',
          price: 325000,
          location: 'pune',
          image: localSecondHandBikeImage,
          category: 'bike',
        },
        {
          id: 2,
          title: 'Honda SINGLE OWNERSHIP',
          price: 50000,
          location: 'pune',
          image: localHondaBikeImage,
          category: 'bike',
        },
        {
          id: 3,
          title: 'iPhone 14 Pro Max 256GB',
          price: 1100000,
          location: 'Mumbai',
          image: 'https://images.unsplash.com/photo-1592286927505-2c17a58e9b30?w=400',
          category: 'mobile',
          featured: true,
        },
        {
          id: 4,
          title: 'Honda City 2021 VX',
          price: 950000,
          location: 'Delhi',
          image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400',
          category: 'car',
        },
        {
          id: 5,
          title: 'MacBook Pro M2 512GB',
          price: 150000,
          location: 'Bangalore',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          category: 'laptop',
        },
        {
          id: 6,
          title: 'Royal Enfield Classic 350',
          price: 180000,
          location: 'Pune',
          image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400',
          category: 'bike',
        },
        {
          id: 7,
          title: '3BHK Apartment for Sale',
          price: 7500000,
          location: 'Gurgaon',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
          category: 'properties',
        },
        {
          id: 8,
          title: 'Samsung Galaxy S23 Ultra',
          price: 89999,
          location: 'Chennai',
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
          category: 'mobile',
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const toggleFavorite = (productId: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p,
      ),
    );
  };

  // 🔹 UPDATED HEADER - Location with no background, grey icon
  const renderHeader = () => (
    <View style={styles.header}>
      {/* Top row: brand + location */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <View style={styles.brandLogo}>
            <Icon name="storefront-outline" size={18} color="#0F172A" />
          </View>
          <View style={styles.brandTextContainer}>
            <Text style={styles.brandTitlePrimary}>Kharido</Text>
            <Text style={styles.brandTitleSecondary}>Becho</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.locationPill}>
          <Icon name="map-marker" size={20} color="#6B7280" />
          <Text style={styles.locationText}>Pune</Text>
          <Icon name="chevron-down" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Bottom row: search + actions */}
      <View style={styles.headerBottomRow}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cars, bikes, mobiles..."
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.micButton}>
            <Icon name="microphone-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.roundIconButton}>
            <Icon name="heart-outline" size={20} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundIconButton}>
            <Icon name="bell-outline" size={20} color="#0F172A" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderBanner = () => (
    <TouchableOpacity style={styles.banner}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800' }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.bannerOverlay}>
        <View style={styles.bannerBadge}>
          <Text style={styles.bannerBadgeText}>Kharido Becho Deals</Text>
        </View>
        <Text style={styles.bannerTitle}>Cold Days.{'\n'}Hot Rewards.</Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Explore now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Categories - Mobile, Laptop, Car, Bike first
  const handleCategoryPress = (categoryId: string) => {
    // Get all entity configurations
    const entityConfigs = getAllEntityConfigs();

    // Find matching entity config for this category
    const entityConfig = entityConfigs.find(config => config.type === categoryId);

    if (entityConfig) {
      // Navigate to the entity's stack using the config
      navigation.navigate(entityConfig.stackName as never);
    } else {
      // Category not yet implemented
      console.log('Category not yet implemented:', categoryId);
    }
  };

  const renderCategories = () => {
    const halfLength = Math.ceil(CATEGORIES.length / 2);
    const firstRow = CATEGORIES.slice(0, halfLength);
    const secondRow = CATEGORIES.slice(halfLength);

    const renderCategoryRow = (categories: Category[]) => (
      <View style={styles.categoryRow}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              index === 0 && styles.categoryCardFirst,
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={styles.categoryIconContainer}>
              <Text style={styles.categoryEmoji}>{category.image}</Text>
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    return (
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          <View style={styles.categoriesWrapper}>
            {renderCategoryRow(firstRow)}
            {renderCategoryRow(secondRow)}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderRecentlyViewed = () => {
    const recentProducts = products.slice(0, 3);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently viewed items</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentlyViewedContainer}
        >
          {recentProducts.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.recentCard}
              onPress={() => {
                /* Navigate to product details */
              }}
            >
              <Image
                source={{ uri: product.image }}
                style={styles.recentImage}
                resizeMode="cover"
              />
              {product.featured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>FEATURED</Text>
                </View>
              )}
              <View style={styles.recentInfo}>
                <Text style={styles.recentPrice}>
                  ₹ {product.price.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.recentTitle} numberOfLines={2}>
                  {product.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAllProducts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fresh recommendations</Text>
      <View style={styles.productsGrid}>
        {products.map(product => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => {
              /* Navigate to product details */
            }}
          >
            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(product.id)}
              >
                <Icon
                  name={product.isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={product.isFavorite ? '#FF6B6B' : '#666'}
                />
              </TouchableOpacity>
              {product.featured && (
                <View style={styles.productFeaturedBadge}>
                  <Text style={styles.productFeaturedText}>FEATURED</Text>
                </View>
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productPrice}>
                ₹ {product.price.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.productTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.productLocation} numberOfLines={1}>
                {product.location}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#002F34" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#002F34']}
          />
        }
      >
        {renderHeader()}
        {renderBanner()}
        {renderCategories()}
        {renderRecentlyViewed()}
        {renderAllProducts()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8F9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  // 🔹 Updated header styles
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#E5F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  brandTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  brandTitlePrimary: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  brandTitleSecondary: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  // Updated - location with no background, grey icon
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
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
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
    padding: 0,
  },
  micButton: {
    paddingLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  roundIconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  banner: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    padding: 20,
    justifyContent: 'center',
  },
  bannerBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  bannerBadgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  comingSoonBadge: {
    backgroundColor: '#22C55E',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Categories - Mobile, Laptop, Car, Bike shown first
  categoriesSection: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
  },
  categoriesScrollContainer: {
    paddingHorizontal: 16,
  },
  categoriesWrapper: {
    flexDirection: 'column',
  },
  categoryRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  categoryCard: {
    alignItems: 'center',
    width: 70,
    marginRight: 12,
  },
  categoryCardFirst: {
    marginLeft: 0,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryName: {
    fontSize: 11,
    color: '#002F34',
    textAlign: 'center',
    fontWeight: '500',
  },

  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#002F34',
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3A77FF',
  },
  recentlyViewedContainer: {
    paddingRight: 16,
  },
  recentCard: {
    width: width * 0.45,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  recentImage: {
    width: '100%',
    height: 150,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FACC15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  featuredText: {
    color: '#1F2933',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentInfo: {
    padding: 12,
  },
  recentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002F34',
    marginBottom: 6,
  },
  recentTitle: {
    fontSize: 14,
    color: '#002F34',
    lineHeight: 18,
  },

  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 12,
  },
  productCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productFeaturedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FACC15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  productFeaturedText: {
    color: '#1F2933',
    fontSize: 9,
    fontWeight: 'bold',
  },
  productInfo: {
    paddingTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002F34',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 13,
    color: '#002F34',
    marginBottom: 4,
    lineHeight: 17,
  },
  productLocation: {
    fontSize: 11,
    color: '#666',
  },
  bottomSpacing: {
    height: 24,
  },
});

export default BuyerHomeScreen;
