import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

interface Listing {
  id: number;
  title: string;
  price: number;
  image: string;
  status: 'active' | 'pending' | 'sold';
  views: number;
}

interface SellerListingsPreviewProps {
  listings: Listing[];
  loading: boolean;
}

const SellerListingsPreview: React.FC<SellerListingsPreviewProps> = ({ listings, loading }) => {
  const navigation = useNavigation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'sold':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Active Listings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyAdsEntry' as never)}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="package-variant" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No active listings</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('SellEntry' as never)}
          >
            <Icon name="plus" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add New Listing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {listings.map((listing) => (
              <TouchableOpacity key={listing.id} style={styles.listingCard}>
                <Image source={{ uri: listing.image }} style={styles.listingImage} />
                <View style={styles.listingInfo}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(listing.status) }]}>
                    <Text style={styles.statusText}>{getStatusLabel(listing.status)}</Text>
                  </View>
                  <Text style={styles.listingTitle} numberOfLines={2}>
                    {listing.title}
                  </Text>
                  <Text style={styles.listingPrice}>₹{listing.price.toLocaleString('en-IN')}</Text>
                  <View style={styles.viewsContainer}>
                    <Icon name="eye" size={14} color="#999" />
                    <Text style={styles.viewsText}>{listing.views} views</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => navigation.navigate('SellEntry' as never)}
          >
            <Icon name="plus-circle" size={20} color="#0F5E87" />
            <Text style={styles.addButtonSmallText}>Add New Listing</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F5E87',
  },
  scrollView: {
    marginHorizontal: -4,
  },
  listingCard: {
    width: 140,
    marginHorizontal: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  listingImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E5E7EB',
  },
  listingInfo: {
    padding: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  listingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 16,
  },
  listingPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F5E87',
    marginBottom: 4,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 11,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F5E87',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    gap: 6,
  },
  addButtonSmallText: {
    color: '#0F5E87',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SellerListingsPreview;
