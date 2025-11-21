import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyAdsScreen from '../screens/MyAdsScreen';

// Per-entity stacks
import MyMobileAdsStack from './MyMobileAdsStack';
import MyLaptopAdsStack from './MyLaptopAdsStack';
import MyCarAdsStack from './MyCarAdsStack';
import MyBikeAdsStack from './MyBikeAdsStack';


export type MyAdsEntryStackParamList = {
  MyAdsScreen: undefined;
  MyMobileAdsStack: undefined;
  MyLaptopAdsStack: undefined;
  MyCarAdsStack: undefined;
  MyBikeAdsStack: undefined;
};

const Stack = createNativeStackNavigator<MyAdsEntryStackParamList>();

export default function MyAdsEntryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyAdsScreen" component={MyAdsScreen} />
      <Stack.Screen name="MyMobileAdsStack" component={MyMobileAdsStack} />
      <Stack.Screen name="MyLaptopAdsStack" component={MyLaptopAdsStack} />
      <Stack.Screen name="MyCarAdsStack" component={MyCarAdsStack} />
      <Stack.Screen name="MyBikeAdsStack" component={MyBikeAdsStack} />
    </Stack.Navigator>
  );
}
