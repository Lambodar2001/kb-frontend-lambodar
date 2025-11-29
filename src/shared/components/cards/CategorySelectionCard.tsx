import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';

interface CategorySelectionCardProps {
  id: string;
  name: string;
  emoji: string;
  accentColor: string;
  onPress: () => void;
}

const CategorySelectionCard: React.FC<CategorySelectionCardProps> = ({
  name,
  emoji,
  accentColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 26,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
});

export default CategorySelectionCard;
