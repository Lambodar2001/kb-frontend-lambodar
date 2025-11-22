import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SellerStats } from '../hooks/useSellerStats';

interface SellerStatsCardProps {
  stats: SellerStats | null;
  loading: boolean;
}

const SellerStatsCard: React.FC<SellerStatsCardProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0F5E87" />
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Performance</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Icon name="format-list-bulleted" size={24} color="#0F5E87" />
          </View>
          <Text style={styles.statValue}>{stats.activeAds}</Text>
          <Text style={styles.statLabel}>Active Ads</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Icon name="check-circle" size={24} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{stats.totalSold}</Text>
          <Text style={styles.statLabel}>Sold</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Icon name="eye" size={24} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>{stats.totalViews}</Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Icon name="star" size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.statValue}>{stats.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating ({stats.totalReviews})</Text>
        </View>
      </View>

      <View style={styles.additionalInfo}>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Response Rate: {stats.responseRate}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>Member since {new Date(stats.memberSince).getFullYear()}</Text>
        </View>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 16,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
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
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  additionalInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
});

export default SellerStatsCard;
