import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { MyAdListItem } from '../../screens/MyAds/types';

type Props = {
  item: MyAdListItem;
  onPress: () => void;
  onMenuPress: () => void;
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return '#16A34A';
    case 'SOLD':
      return '#DC2626';
    default:
      return '#6B7280';
  }
};

const MyAdCard: React.FC<Props> = ({ item, onPress, onMenuPress }) => {
  const statusColor = getStatusColor(item.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={item.thumbnail} style={styles.image} resizeMode="cover" />
        <View style={[styles.entityPill, { backgroundColor: item.accentColor }]}>
          <Text style={styles.entityPillText}>{item.entityLabel}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.price}>{item.priceText}</Text>
          <TouchableOpacity onPress={onMenuPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="dots-vertical" size={18} color="#4B5563" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
        <View style={styles.footerRow}>
          {item.location ? (
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={14} color="#9CA3AF" />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.badgeText}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MyAdCard);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    paddingBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  entityPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entityPillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  details: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  locationText: {
    marginLeft: 3,
    fontSize: 11,
    color: '#6B7280',
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
