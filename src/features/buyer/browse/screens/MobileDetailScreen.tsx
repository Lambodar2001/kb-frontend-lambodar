// src/features/buyer/home/screens/MobileDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@context/AuthContext';
import { MobileDetail } from '@features/seller/sell/api/MobilesApi/getById';
import { getBuyerMobileById } from '../api/mobilesApi';
import MobileDetailFooter from '../components/MobileDetailFooter';
import ChatRequestModal from '../../chat/components/ChatRequestModal';
import { useCreateBooking } from '@core/booking/hooks';
import { MobileEntity } from '@core/booking/types/entity.types';

const { width } = Dimensions.get('window');

const MobileDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mobileId } = route.params as { mobileId: number };
  const { userId } = useAuth();

  const [mobile, setMobile] = useState<MobileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);

  const { createBooking, loading: creatingBooking } = useCreateBooking<MobileEntity>('mobile');

  useEffect(() => {
    loadMobileDetails();
  }, [mobileId]);

  const loadMobileDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBuyerMobileById(mobileId);
      setMobile(data);
    } catch (err) {
      console.error('Failed to load mobile details:', err);
      setError('Failed to load mobile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = () => {
    setShowChatModal(true);
  };

  const handleSendChatRequest = async (message: string) => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to send a chat request');
      return;
    }

    try {
      const response = await createBooking(mobileId, userId, message);

      Alert.alert(
        'Success!',
        'Your request has been sent to the seller. You can view it in the Chats tab.',
        [
          {
            text: 'View Chat',
            onPress: () => {
              navigation.navigate('Chat' as never, {
                screen: 'BuyerChatThread',
                params: {
                  requestId: response.bookingId || response.requestId,
                  mobileTitle: mobile?.title,
                  sellerId: response.sellerId,
                },
              } as never);
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      Alert.alert(
        'Failed to send request',
        error?.message || 'Please try again later'
      );
    }
  };

  const handleMakeOfferPress = () => {
    Alert.alert('Make Offer', 'Booking API will be integrated next!');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share-variant" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="heart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageCarousel = () => {
    const images = mobile?.images && mobile.images.length > 0
      ? mobile.images.map(img => img.imageUrl)
      : ['https://via.placeholder.com/600x400?text=No+Image'];

    return (
      <View style={styles.imageCarouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        {images.length > 1 && (
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPriceSection = () => (
    <View style={styles.priceSection}>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹ {mobile?.price.toLocaleString('en-IN')}</Text>
        {mobile?.negotiable && (
          <View style={styles.negotiableBadge}>
            <Text style={styles.negotiableText}>Negotiable</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{mobile?.title}</Text>
    </View>
  );

  const renderDetailsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Details</Text>
      <View style={styles.detailsGrid}>
        {mobile?.brand && (
          <View style={styles.detailItem}>
            <Icon name="cellphone" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{mobile.brand}</Text>
            </View>
          </View>
        )}
        {mobile?.model && (
          <View style={styles.detailItem}>
            <Icon name="tag-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Model</Text>
              <Text style={styles.detailValue}>{mobile.model}</Text>
            </View>
          </View>
        )}
        {mobile?.condition && (
          <View style={styles.detailItem}>
            <Icon name="shield-check-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Condition</Text>
              <Text style={styles.detailValue}>{mobile.condition}</Text>
            </View>
          </View>
        )}
        {mobile?.yearOfPurchase && (
          <View style={styles.detailItem}>
            <Icon name="calendar" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Year of Purchase</Text>
              <Text style={styles.detailValue}>{mobile.yearOfPurchase}</Text>
            </View>
          </View>
        )}
        {mobile?.color && (
          <View style={styles.detailItem}>
            <Icon name="palette-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Color</Text>
              <Text style={styles.detailValue}>{mobile.color}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderDescriptionSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {mobile?.description || 'No description available.'}
      </Text>
    </View>
  );

  const renderSellerSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Seller Information</Text>
      <View style={styles.sellerCard}>
        <View style={styles.sellerAvatar}>
          <Icon name="account" size={32} color="#0F5E87" />
        </View>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>Seller ID: {mobile?.sellerId}</Text>
          <Text style={styles.sellerMeta}>Member since {mobile?.createdAt ? new Date(mobile.createdAt).getFullYear() : 'N/A'}</Text>
        </View>
        <TouchableOpacity style={styles.viewProfileButton}>
          <Icon name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F5E87" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !mobile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMobileDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.absoluteHeader}>{renderHeader()}</View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}
        {renderPriceSection()}
        {renderDetailsSection()}
        {renderDescriptionSection()}
        {renderSellerSection()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <MobileDetailFooter
        onChatPress={handleChatPress}
        onMakeOfferPress={handleMakeOfferPress}
      />

      {/* Chat Request Modal */}
      <ChatRequestModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        onSend={handleSendChatRequest}
        loading={creatingBooking}
        mobileTitle={mobile?.title}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  imageCarouselContainer: {
    width,
    height: 350,
    backgroundColor: '#000',
  },
  carouselImage: {
    width,
    height: 350,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  negotiableBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
  negotiableText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  sellerMeta: {
    fontSize: 13,
    color: '#666',
  },
  viewProfileButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#0F5E87',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
});

export default MobileDetailScreen;
