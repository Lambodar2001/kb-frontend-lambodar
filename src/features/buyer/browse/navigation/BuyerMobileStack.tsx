// src/features/buyer/home/navigation/BuyerMobileStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MobileListingScreen from '../screens/MobileListingScreen';
import MobileDetailScreen from '../screens/MobileDetailScreen';

export type BuyerMobileStackParamList = {
  MobileListing: undefined;
  MobileDetail: { mobileId: number };
};

const Stack = createStackNavigator<BuyerMobileStackParamList>();

const BuyerMobileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MobileListing" component={MobileListingScreen} />
      <Stack.Screen name="MobileDetail" component={MobileDetailScreen} />
    </Stack.Navigator>
  );
};

export default BuyerMobileStack;
