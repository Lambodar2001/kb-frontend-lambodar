// src/features/buyer/home/components/MobileCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MobileItem } from '@features/seller/sell/api/MobilesApi/getAll';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface MobileCardProps {
  mobile: MobileItem;
  onPress: () => void;
}

const MobileCard: React.FC<MobileCardProps> = ({ mobile, onPress }) => {
  const imageUrl = mobile.images && mobile.images.length > 0
    ? mobile.images[0].imageUrl
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>₹ {mobile.price.toLocaleString('en-IN')}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {mobile.title}
        </Text>
        {mobile.brand && mobile.model && (
          <Text style={styles.brandModel} numberOfLines={1}>
            {mobile.brand} {mobile.model}
          </Text>
        )}
        {mobile.condition && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{mobile.condition}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    paddingTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002F34',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    color: '#002F34',
    marginBottom: 4,
    lineHeight: 17,
  },
  brandModel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  conditionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5F3F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 2,
  },
  conditionText: {
    fontSize: 10,
    color: '#0F5E87',
    fontWeight: '600',
  },
});

export default MobileCard;