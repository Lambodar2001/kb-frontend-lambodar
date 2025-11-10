import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddMobileDetailsScreen from '../screens/MobileScreens/AddMobileDetailsScreen';
import SelectMobilePhotoScreen from '../screens/MobileScreens/SelectMobilePhotoScreen';
import MobilePricingScreen from '../screens/MobileScreens/MobilePricingScreen';
import MobileLocationScreen from '../screens/MobileScreens/MobileLocationScreen';
import ChooseLocationScreen from '../screens/Sell/common/ChooseLocationScreen';
import ChooseCityScreen from '../screens/Sell/common/ChooseCityScreen';
import ChooseAreaScreen from '../screens/Sell/common/ChooseAreaScreen';
import ConfirmDetailsScreen from '../screens/MobileScreens/ConfirmDetailsScreen';

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
