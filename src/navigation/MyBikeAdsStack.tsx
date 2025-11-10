// src/navigation/stacks/MyBikeAdsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyBikeAdsListScreen from '../screens/BikeScreens/MyBikeAdsListScreen';
import ProductDetailsScreen from '../screens/BikeScreens/ProductDetailsScreen';
import UpdateBikeScreen from '../screens/BikeScreens/UpdateBikeScreen';

export type MyBikeAdsStackParamList = {
  MyBikeAdsList: undefined;
  ProductDetails: { bikeId: number };
  UpdateBike: { bikeId: number };
  ChatScreen: undefined;
};

const Stack = createNativeStackNavigator<MyBikeAdsStackParamList>();

export default function MyBikeAdsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyBikeAdsList"
        component={MyBikeAdsListScreen}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />
      <Stack.Screen
        name="UpdateBike"
        component={UpdateBikeScreen}
        options={{
          presentation: 'card',
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            // Go up to the tab navigator (3 levels up)
            const tabNavigator = navigation.getParent()?.getParent()?.getParent();
            if (tabNavigator) {
              tabNavigator.setOptions({
                tabBarStyle: { display: 'none' },
              });
            }
          },
          blur: () => {
            const tabNavigator = navigation.getParent()?.getParent()?.getParent();
            if (tabNavigator) {
              tabNavigator.setOptions({
                tabBarStyle: undefined,
              });
            }
          },
        })}
      />
    </Stack.Navigator>
  );
}
