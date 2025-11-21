import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Vehicle', icon: require('../assets/icons/vehicle.png'), bgColor: '#FFF4CC', gradient: ['#FFF4CC', '#FFE999'] },
  { id: '2', name: 'Electronics', icon: require('../assets/icons/electronics.png'), bgColor: '#D9F3FF', gradient: ['#D9F3FF', '#B3E5FF'] },
  { id: '3', name: 'Fashion', icon: require('../assets/icons/fashion.png'), bgColor: '#FFE1EC', gradient: ['#FFE1EC', '#FFB3D9'] },
  { id: '4', name: 'Kitchen appliances', icon: require('../assets/icons/kitchen-appliances.png'), bgColor: '#FFF2D9', gradient: ['#FFF2D9', '#FFE5B3'] },
  { id: '5', name: 'Real Estate', icon: require('../assets/icons/real-estate.png'), bgColor: '#FFECE0', gradient: ['#FFECE0', '#FFD9C2'] },
  { id: '6', name: 'Jobs', icon: require('../assets/icons/jobs.png'), bgColor: '#FFEFF6', gradient: ['#FFEFF6', '#FFDFED'] },
  { id: '7', name: 'Books', icon: require('../assets/icons/books.png'), bgColor: '#EDF0FF', gradient: ['#EDF0FF', '#D4DBFF'] },
  { id: '8', name: 'Services', icon: require('../assets/icons/services.png'), bgColor: '#E8F5F1', gradient: ['#E8F5F1', '#CFEAE3'] },
];

const products = [
  {
    id: '1',
    title: 'Maruti Suzuki Dzire 2009',
    price: '₹2,50,000',
    specs: '2009 • 150,000 km',
    location: 'Baner, Pune',
    image: require('../assets/icons/hyundai.png'),
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Maruti Suzuki Dzire 2009',
    price: '₹2,50,000',
    specs: '2009 • 150,000 km',
    location: 'Baner, Pune',
    image: require('../assets/icons/hyundai.png'),
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Maruti Suzuki Dzire 2009',
    price: '₹2,50,000',
    specs: '2009 • 150,000 km',
    location: 'Baner, Pune',
    image: require('../assets/icons/hyundai.png'),
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Maruti Suzuki Dzire 2009',
    price: '₹2,50,000',
    specs: '2009 • 150,000 km',
    location: 'Baner, Pune',
    image: require('../assets/icons/hyundai.png'),
    isFeatured: false,
  },
];

const quickFilters = [
  { id: '1', label: 'Cars', icon: 'car-sport-outline' },
  { id: '2', label: 'Bikes', icon: 'bicycle-outline' },
  { id: '3', label: 'Mobiles', icon: 'phone-portrait-outline' },
  { id: '4', label: 'Laptops', icon: 'laptop-outline' },
  { id: '5', label: 'Near me', icon: 'navigate-outline' },
];

const CategoryCard = ({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '12deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.categoryItem,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View
          style={[
            styles.iconWrapper,
            { backgroundColor: item.bgColor },
            {
              shadowColor: item.bgColor,
              shadowOpacity: glowOpacity,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 8],
              }),
            },
          ]}
        >
          <Animated.Image
            source={item.icon}
            style={[
              styles.categoryIcon,
              { transform: [{ rotate }] },
            ]}
          />
        </Animated.View>
        <Text style={styles.categoryText} numberOfLines={1}>
          {item.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ProductCard = ({ product, onPress }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.productCard,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.productImageWrapper}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.badgeWrapper}>
            {product.isFeatured && (
              <View style={styles.featuredBadge}>
                <Icon name="star" size={10} color="#FBBF24" />
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.favButton}
              onPress={handleFavorite}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Icon
                  name={isFavorited ? 'heart' : 'heart-outline'}
                  size={16}
                  color={isFavorited ? '#EF4444' : '#fff'}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.productContent}>
          <Text style={styles.productPrice}>{product.price}</Text>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.productSpecs} numberOfLines={1}>
            {product.specs}
          </Text>

          <View style={styles.productBottomRow}>
            <View style={styles.productLocation}>
              <Icon name="location-outline" size={12} color="#9CA3AF" />
              <Text style={styles.locationTextCard} numberOfLines={1}>
                {product.location}
              </Text>
            </View>
            <Text style={styles.postedTime}>Today</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleCategoryPress = (name) => {
    Alert.alert('Coming Soon', `You selected: ${name}`);
  };

  const handleFilterPress = (id, label) => {
    setSelectedFilter(id);
    Alert.alert('Filter', `Filter applied: ${label}`);
  };

  const handleProductPress = (title) => {
    Alert.alert('Product', `Open details for: ${title}`);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002b40" />

      {/* ANIMATED HEADER */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.locationRow}>
            <Icon name="location-outline" size={20} color="#fff" />
            <Text style={styles.locationText}>India</Text>
            <Icon name="chevron-down" size={16} color="#fff" />
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Coming Soon', 'Notifications coming soon')}
            >
              <Icon name="notifications-outline" size={22} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.profileChip]}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Profile', 'Profile section coming soon')}
            >
              <Icon name="person-circle-outline" size={22} color="#002b40" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Search bar */}
        <View
          style={[
            styles.searchContainer,
            searchFocused && styles.searchContainerFocused,
          ]}
        >
          <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars, bikes, mobiles and more"
            placeholderTextColor="#999"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Filters', 'Advanced filters coming soon')}
          >
            <Icon name="options-outline" size={18} color="#002b40" />
          </TouchableOpacity>
        </View>

        {/* Quick filter chips with icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFilterRow}
        >
          {quickFilters.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.quickFilterChip,
                selectedFilter === f.id && styles.quickFilterChipActive,
              ]}
              activeOpacity={0.7}
              onPress={() => handleFilterPress(f.id, f.label)}
            >
              <Icon
                name={f.icon}
                size={14}
                color={selectedFilter === f.id ? '#002b40' : '#F9FAFB'}
              />
              <Text
                style={[
                  styles.quickFilterText,
                  selectedFilter === f.id && styles.quickFilterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* MAIN CONTENT */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Enhanced Promo banner */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <View style={styles.promoIconCircle}>
              <Icon name="megaphone-outline" size={24} color="#0B7CFF" />
            </View>
            <View style={styles.promoTextBlock}>
              <Text style={styles.promoTitle}>Post your ad in minutes</Text>
              <Text style={styles.promoSubtitle}>
                Sell your car, bike, mobile or more with zero listing fees.
              </Text>
              <TouchableOpacity
                style={styles.promoButton}
                onPress={() => Alert.alert('Sell', 'Sell flow coming from navigation')}
                activeOpacity={0.85}
              >
                <Text style={styles.promoButtonText}>Start Selling</Text>
                <Icon name="arrow-forward-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.promoBadge}>
            <Icon name="shield-checkmark-outline" size={14} color="#0a7d4f" />
            <Text style={styles.promoBadgeText}>Trusted by millions</Text>
          </View>
        </View>

        {/* CATEGORIES SECTION */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Browse by category</Text>
            <Text style={styles.sectionSubtitle}>Find what you're looking for</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => Alert.alert('Categories', 'All categories coming soon')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Icon name="chevron-forward-outline" size={16} color="#007bff" />
          </TouchableOpacity>
        </View>

        {/* Horizontal scroll for categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              item={cat}
              onPress={() => handleCategoryPress(cat.name)}
            />
          ))}
        </ScrollView>

        {/* RECOMMENDATIONS SECTION */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <View>
            <Text style={styles.sectionTitle}>Fresh recommendations</Text>
            <Text style={styles.sectionSubtitle}>Based on your interests</Text>
          </View>
          <TouchableOpacity style={styles.sortButton}>
            <Icon name="swap-vertical-outline" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.title)}
            />
          ))}
        </View>

        {/* Load more button */}
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => Alert.alert('Load More', 'Loading more products...')}
        >
          <Text style={styles.loadMoreText}>Load More Products</Text>
          <Icon name="chevron-down-outline" size={18} color="#007bff" />
        </TouchableOpacity>

        {/* bottom spacer */}
        <View style={{ height: 24 }} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // HEADER
  header: {
    backgroundColor: '#002b40',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  locationText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#002b40',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  profileChip: {
    backgroundColor: '#F9FAFB',
    borderColor: 'transparent',
  },

  // SEARCH
  searchContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 48,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: '#0B7CFF',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E5F1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickFilterRow: {
    marginTop: 12,
    paddingRight: 4,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  quickFilterChipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  quickFilterText: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
  },
  quickFilterTextActive: {
    color: '#002b40',
  },

  // MAIN SCROLL
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  // PROMO CARD
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  promoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  promoTextBlock: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  promoSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
    lineHeight: 18,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0B7CFF',
    columnGap: 6,
    elevation: 3,
    shadowColor: '#0B7CFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  promoBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  promoBadgeText: {
    fontSize: 11,
    color: '#15803D',
    marginLeft: 5,
    fontWeight: '600',
  },

  // SECTIONS
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 13,
    color: '#007bff',
    marginRight: 4,
    fontWeight: '600',
  },
  sortButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // CATEGORIES
  categoryScroll: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 76,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // PRODUCTS
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCard: {
    width: (width - 42) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  productImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeWrapper: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    columnGap: 4,
  },
  featuredBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  productContent: {
    padding: 10,
  },
  productPrice: {
    fontWeight: '800',
    fontSize: 16,
    color: '#111827',
    letterSpacing: 0.3,
  },
  productTitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 18,
  },
  productSpecs: {
    marginTop: 4,
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  productBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  productLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '65%',
  },
  locationTextCard: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  postedTime: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // LOAD MORE
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    columnGap: 6,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '700',
  },
});

export default HomeScreen;