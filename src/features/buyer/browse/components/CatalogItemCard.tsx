/**
 * Catalog Item Card Component
 * Reusable card component that works with any entity type
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EntityConfig, BaseEntity } from '../config/entityTypes';
import {
  getEntityId,
  getEntityTitle,
  getEntityPrice,
  getEntityImages,
} from '../api/catalogApi';

const { width } = Dimensions.get('window');
// container horizontal padding = 16, gap between cards = 12
const CARD_WIDTH = (width - 32 - 12) / 2;

interface CatalogItemCardProps<T extends BaseEntity> {
  entity: T;
  config: EntityConfig<T>;
  onPress: () => void;
}

export function CatalogItemCard<T extends BaseEntity>({
  entity,
  config,
  onPress,
}: CatalogItemCardProps<T>) {
  const images = getEntityImages(entity, config);
  const imageUrl = images.length > 0 ? images[0].imageUrl : null;
  const price = getEntityPrice(entity, config);
  const title = getEntityTitle(entity, config);

  const brand = (entity as any).brand;
  const model = (entity as any).model;
  const condition = entity.condition;

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderContainer]}>
            <Icon name={config.icon} size={42} color="#CBD5E1" />
          </View>
        )}

        {condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{condition}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.price} numberOfLines={1}>
          ₹{price.toLocaleString('en-IN')}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {(brand || model) && (
          <View style={styles.detailsRow}>
            <Icon name={config.icon} size={14} color="#94A3B8" />
            <Text style={styles.detailsText} numberOfLines={1}>
              {[brand, model].filter(Boolean).join(' ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F5E87',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F172A',
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});
