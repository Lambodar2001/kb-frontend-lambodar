import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { colors, radii, spacing } from '@theme/tokens';

const MAHARASHTRA_CITIES = [
  'Mumbai',
  'Pune',
  'Nagpur',
  'Nashik',
  'Aurangabad',
  'Solapur',
  'Kolhapur',
  'Pandharpur',
  'Satara',
  'Sangli',
];

// Generic route params for all entity types
type ChooseCityRouteParams = {
  stateName: string;
  carId?: number;
  bikeId?: number;
  mobileId?: number;
  laptopId?: number;
  images?: string[];
};

type ChooseCityRouteProp = RouteProp<{ ChooseCityScreen: ChooseCityRouteParams }, 'ChooseCityScreen'>;

const ChooseCityScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ChooseCityRouteProp>();
  const { stateName, carId, bikeId, mobileId, laptopId, images } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(MAHARASHTRA_CITIES);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCities(MAHARASHTRA_CITIES);
    } else {
      const filtered = MAHARASHTRA_CITIES.filter((city) =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleCityPress = (city: string) => {
    // Only Pandharpur opens area screen for demo
    if (city === 'Pandharpur') {
      navigation.navigate('ChooseAreaScreen', {
        cityName: city,
        carId,
        bikeId,
        mobileId,
        laptopId,
        images,
      } as any);
    } else {
      console.log('Selected city:', city);
      // Could navigate back with selected city
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{stateName}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Cities Section */}
        <View style={styles.citiesHeader}>
          <Text style={styles.citiesHeaderText}>Choose City</Text>
        </View>

        {/* Cities List */}
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.citiesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cityItem}
              onPress={() => handleCityPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.cityText}>{item}</Text>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.cityDivider} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    left: spacing.lg,
    padding: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  citiesHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  citiesHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  citiesList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  cityText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  cityDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
});

export default ChooseCityScreen;
