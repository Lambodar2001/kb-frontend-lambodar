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
const CARD_WIDTH = (width - 48) / 2;

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

  // Extract additional info from entity
  const brand = (entity as any).brand;
  const model = (entity as any).model;
  const condition = entity.condition;

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderContainer]}>
            <Icon name={config.icon} size={40} color="#CBD5E1" />
          </View>
        )}
        {condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{condition}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.price}>
          ₹{price.toLocaleString('en-IN')}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {(brand || model) && (
          <View style={styles.detailsRow}>
            <Icon name={config.icon} size={14} color="#64748B" />
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
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  conditionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F5E87',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
});
