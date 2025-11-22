import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { BuyerActivity } from '../hooks/useBuyerActivity';

interface BuyerActivitySectionProps {
  activity: BuyerActivity | null;
  loading: boolean;
}

const BuyerActivitySection: React.FC<BuyerActivitySectionProps> = ({ activity, loading }) => {
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0F5E87" />
      </View>
    );
  }

  if (!activity) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => {/* Navigate to favorites */}}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
            <Icon name="heart" size={24} color="#FF6B6B" />
          </View>
          <Text style={styles.statValue}>{activity.favoritesCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => {/* Navigate to recent views */}}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Icon name="eye" size={24} color="#0F5E87" />
          </View>
          <Text style={styles.statValue}>{activity.recentViewsCount}</Text>
          <Text style={styles.statLabel}>Recent Views</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => {/* Navigate to saved searches */}}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Icon name="magnify" size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.statValue}>{activity.savedSearchesCount}</Text>
          <Text style={styles.statLabel}>Saved Searches</Text>
        </TouchableOpacity>
      </View>

      {/* Favorites Preview */}
      {activity.favorites.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Favorites</Text>
            <TouchableOpacity onPress={() => {/* Navigate to favorites */}}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {activity.favorites.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-outline" size={12} color="#999" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recent Views Preview */}
      {activity.recentViews.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <TouchableOpacity onPress={() => {/* Navigate to recent views */}}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {activity.recentViews.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-outline" size={12} color="#999" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  loadingContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F5E87',
  },
  scrollView: {
    marginHorizontal: -4,
  },
  itemCard: {
    width: 140,
    marginHorizontal: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E5E7EB',
  },
  itemInfo: {
    padding: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F5E87',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: 10,
    color: '#999',
    flex: 1,
  },
});

export default BuyerActivitySection;
