import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../context/AuthContext';

// Shared components
import {
  ProfileHeader,
  AccountInfoSection,
  SettingsSection,
  LogoutButton,
} from '../components';

// Seller-specific components
import { SellerStatsCard, SellerListingsPreview } from '../../../seller/profile/components';
import { useSellerStats } from '../../../seller/profile/hooks/useSellerStats';

// Buyer-specific components
import { BuyerActivitySection } from '../../../buyer/profile/components';
import { useBuyerActivity } from '../../../buyer/profile/hooks/useBuyerActivity';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userId, sellerId, roles } = useAuth();

  // Determine user role
  const isSeller = roles.includes('SELLER');
  const isBuyer = roles.includes('BUYER') || roles.includes('USER');

  // Fetch seller data if user is a seller
  const { stats: sellerStats, loading: sellerLoading } = useSellerStats(
    isSeller ? sellerId : null
  );

  // Fetch buyer activity if user is a buyer
  const { activity: buyerActivity, loading: buyerLoading } = useBuyerActivity(
    isBuyer ? userId : null
  );

  // Mock user data (TODO: fetch from API)
  const userData = {
    name: 'Pramod Patil',
    username: 'pramodpatil',
    email: 'pramod@example.com',
    phone: '+91 9876543210',
    emailVerified: true,
    phoneVerified: false,
    memberSince: '2023-06-15',
    profileImage: null,
  };

  // Mock active listings for seller (TODO: fetch from API)
  const activeListings = isSeller
    ? [
        {
          id: 1,
          title: 'iPhone 14 Pro Max',
          price: 85000,
          image: 'https://via.placeholder.com/100',
          status: 'active' as const,
          views: 45,
        },
        {
          id: 2,
          title: 'Honda City 2020',
          price: 950000,
          image: 'https://via.placeholder.com/100',
          status: 'active' as const,
          views: 78,
        },
        {
          id: 3,
          title: 'MacBook Pro M2',
          price: 150000,
          image: 'https://via.placeholder.com/100',
          status: 'pending' as const,
          views: 92,
        },
      ]
    : [];

  // Role-specific menu items
  const getSellerMenuItems = () => [
    {
      id: 'my-listings',
      icon: 'format-list-bulleted',
      label: 'My Listings',
      onPress: () => navigation.navigate('MyAdsEntry' as never),
    },
    {
      id: 'sales-history',
      icon: 'history',
      label: 'Sales History',
      onPress: () => console.log('Navigate to Sales History'),
    },
    {
      id: 'reviews',
      icon: 'star-outline',
      label: 'Reviews & Ratings',
      onPress: () => console.log('Navigate to Reviews'),
    },
  ];

  const getBuyerMenuItems = () => [
    {
      id: 'my-orders',
      icon: 'shopping-outline',
      label: 'My Orders',
      onPress: () => console.log('Navigate to My Orders'),
    },
    {
      id: 'wishlist',
      icon: 'heart-outline',
      label: 'Wishlist',
      onPress: () => console.log('Navigate to Wishlist'),
    },
    {
      id: 'saved-searches',
      icon: 'magnify',
      label: 'Saved Searches',
      onPress: () => console.log('Navigate to Saved Searches'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContent}>
          {/* Profile Header - Common for all */}
          <ProfileHeader
            name={userData.name}
            username={userData.username}
            profileImage={userData.profileImage}
          />

          {/* Seller-Specific Sections */}
          {isSeller && (
            <>
              <SettingsSection menuItems={getSellerMenuItems()} />
            </>
          )}

          {/* Buyer-Specific Sections */}
          {isBuyer && !isSeller && (
            <>
              <SettingsSection menuItems={getBuyerMenuItems()} />
            </>
          )}

          {/* Account Information - Common for all */}
          <AccountInfoSection
            email={userData.email}
            phone={userData.phone}
            emailVerified={userData.emailVerified}
            phoneVerified={userData.phoneVerified}
            memberSince={userData.memberSince}
          />

          {/* General Settings - Common for all */}
          <SettingsSection />
        </View>
      </ScrollView>

      {/* Logout Button - Common for all, Fixed at Bottom */}
      <LogoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default ProfileScreen;
