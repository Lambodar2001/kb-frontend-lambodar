import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddMobileDetailsScreen from '@features/seller/sell/screens/mobile/AddMobileDetailsScreen';
import SelectMobilePhotoScreen from '@features/seller/sell/screens/mobile/SelectMobilePhotoScreen';
import MobilePricingScreen from '@features/seller/sell/screens/mobile/MobilePricingScreen';
import MobileLocationScreen from '@features/seller/sell/screens/mobile/MobileLocationScreen';
import ChooseLocationScreen from '@features/seller/sell/screens/common/ChooseLocationScreen';
import ChooseCityScreen from '@features/seller/sell/screens/common/ChooseCityScreen';
import ChooseAreaScreen from '@features/seller/sell/screens/common/ChooseAreaScreen';
import ConfirmDetailsScreen from '@features/seller/sell/screens/mobile/ConfirmDetailsScreen';

export type SellMobileStackParamList = {
  AddMobileDetails: undefined;
  SelectPhoto: { mobileId: number };
  MobilePricingScreen: { mobileId: number; images?: string[] };
  MobileLocationScreen: { mobileId: number; images?: string[]; selectedLocation?: string };
  ChooseLocationScreen: { returnScreen: string; mobileId: number; images?: string[] };
  ChooseCityScreen: { stateName: string; mobileId: number; images?: string[] };
  ChooseAreaScreen: { cityName: string; mobileId: number; images?: string[] };
  ConfirmDetails: { mobileId: number; images?: string[] };
};

const Stack = createNativeStackNavigator<SellMobileStackParamList>();

export default function SellMobileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddMobileDetails" component={AddMobileDetailsScreen} />
      <Stack.Screen name="SelectPhoto" component={SelectMobilePhotoScreen} />
      <Stack.Screen name="MobilePricingScreen" component={MobilePricingScreen} />
      <Stack.Screen name="MobileLocationScreen" component={MobileLocationScreen} />
      <Stack.Screen name="ChooseLocationScreen" component={ChooseLocationScreen} />
      <Stack.Screen name="ChooseCityScreen" component={ChooseCityScreen} />
      <Stack.Screen name="ChooseAreaScreen" component={ChooseAreaScreen} />
      <Stack.Screen name="ConfirmDetails" component={ConfirmDetailsScreen} />
    </Stack.Navigator>
  );
}
