// src/navigation/stacks/MyLaptopAdsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyLaptopAdsListScreen from '@features/seller/listings/screens/laptop/MyLaptopAdsListScreen';
import LaptopDetailsScreen from '@features/seller/listings/screens/laptop/LaptopDetailsScreen';
import UpdateLaptopScreen from '@features/seller/listings/screens/laptop/UpdateLaptopScreen';

export type MyLaptopAdsStackParamList = {
  MyLaptopAdsList: undefined;
  LaptopDetails: { laptopId: number };
  UpdateLaptop: { laptopId: number };
};

const Stack = createNativeStackNavigator<MyLaptopAdsStackParamList>();

export default function MyLaptopAdsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyLaptopAdsList"
        component={MyLaptopAdsListScreen}
      />
      <Stack.Screen
        name="LaptopDetails"
        component={LaptopDetailsScreen}
      />
      <Stack.Screen
        name="UpdateLaptop"
        component={UpdateLaptopScreen}
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
