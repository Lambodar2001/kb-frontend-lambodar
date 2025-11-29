import React from 'react';
import { View, StyleSheet } from 'react-native';

import CategorySelectionCard from '@shared/components/cards/CategorySelectionCard';
import { CategoryConfig } from '../../config/categoryConfig';
import { MyAdEntityType } from '../../screens/common/types';

interface MyAdsCategoryGridProps {
  categories: CategoryConfig[];
  onCategoryPress: (categoryId: MyAdEntityType) => void;
}

const MyAdsCategoryGrid: React.FC<MyAdsCategoryGridProps> = ({
  categories,
  onCategoryPress,
}) => {
  return (
    <View style={styles.gridContainer}>
      {categories.map((category) => (
        <View key={category.id} style={styles.cardWrapper}>
          <CategorySelectionCard
            id={category.id}
            name={category.name}
            emoji={category.emoji}
            accentColor={category.accentColor}
            onPress={() => onCategoryPress(category.id)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cardWrapper: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
});

export default MyAdsCategoryGrid;
