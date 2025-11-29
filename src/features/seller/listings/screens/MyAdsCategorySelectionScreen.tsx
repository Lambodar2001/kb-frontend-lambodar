import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@context/AuthContext';
import AppHeader from '@shared/components/headers/AppHeader';
import MyAdsCategoryGrid from '../components/myads/MyAdsCategoryGrid';
import { MY_ADS_CATEGORIES } from '../config/categoryConfig';
import { MyAdsEntryStackParamList } from '../navigation/MyAdsEntryStack';
import { MyAdEntityType } from './common/types';

type NavigationProp = NativeStackNavigationProp<MyAdsEntryStackParamList>;

const ENTITY_STACK_MAP: Record<MyAdEntityType, keyof MyAdsEntryStackParamList> = {
  mobile: 'MyMobileAdsStack',
  laptop: 'MyLaptopAdsStack',
  car: 'MyCarAdsStack',
  bike: 'MyBikeAdsStack',
};

const MyAdsCategorySelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { roles, sellerId } = useAuth();

  // Role guard: Only sellers with valid sellerId can access this screen
  const isSeller = roles.includes('SELLER') && sellerId !== null;

  if (!isSeller) {
    return (
      <View style={styles.roleGuardContainer}>
        <Text style={styles.roleGuardTitle}>Seller Access Only</Text>
        <Text style={styles.roleGuardMessage}>
          This feature is only available for sellers. Please contact support to upgrade your account.
        </Text>
      </View>
    );
  }

  const handleCategoryPress = useCallback(
    (categoryId: MyAdEntityType) => {
      const stackName = ENTITY_STACK_MAP[categoryId];
      if (stackName) {
        navigation.navigate(stackName);
      }
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppHeader showLocation={true} location="Pune" />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>My Ads</Text>
          <Text style={styles.subtitle}>
            Select a category to view your listings
          </Text>
        </View>

        {/* Category Grid */}
        <MyAdsCategoryGrid
          categories={MY_ADS_CATEGORIES}
          onCategoryPress={handleCategoryPress}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: '85%',
  },
  bottomSpacing: {
    height: 40,
  },
  // Role guard styles
  roleGuardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F8F9',
  },
  roleGuardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  roleGuardMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MyAdsCategorySelectionScreen;
