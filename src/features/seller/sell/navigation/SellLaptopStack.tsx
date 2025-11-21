import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddLaptopDetailsScreen from '@features/seller/sell/screens/laptop/AddLaptopDetailsScreen';
import SelectLaptopPhotoScreen from '@features/seller/sell/screens/laptop/SelectLaptopPhotoScreen';
import LaptopPricingScreen from '@features/seller/sell/screens/laptop/LaptopPricingScreen';
import LaptopLocationScreen from '@features/seller/sell/screens/laptop/LaptopLocationScreen';
import ChooseLocationScreen from '@features/seller/sell/screens/common/ChooseLocationScreen';
import ChooseCityScreen from '@features/seller/sell/screens/common/ChooseCityScreen';
import ChooseAreaScreen from '@features/seller/sell/screens/common/ChooseAreaScreen';
import ConfirmLaptopDetailsScreen from '@features/seller/sell/screens/laptop/ConfirmLaptopDetailsScreen';

export type SellLaptopStackParamList = {
  AddLaptopDetails: undefined;
  SelectLaptopPhotoScreen: { laptopId: number };
  LaptopPricingScreen: { laptopId: number; images?: string[] };
  LaptopLocationScreen: { laptopId: number; images?: string[]; selectedLocation?: string };
  ChooseLocationScreen: { returnScreen: string; laptopId: number; images?: string[] };
  ChooseCityScreen: { stateName: string; laptopId: number; images?: string[] };
  ChooseAreaScreen: { cityName: string; laptopId: number; images?: string[] };
  ConfirmLaptopDetails: { laptopId: number; images?: string[] };
};

const Stack = createNativeStackNavigator<SellLaptopStackParamList>();

export default function SellLaptopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddLaptopDetails" component={AddLaptopDetailsScreen} />
      <Stack.Screen name="SelectLaptopPhotoScreen" component={SelectLaptopPhotoScreen} />
      <Stack.Screen name="LaptopPricingScreen" component={LaptopPricingScreen} />
      <Stack.Screen name="LaptopLocationScreen" component={LaptopLocationScreen} />
      <Stack.Screen name="ChooseLocationScreen" component={ChooseLocationScreen} />
      <Stack.Screen name="ChooseCityScreen" component={ChooseCityScreen} />
      <Stack.Screen name="ChooseAreaScreen" component={ChooseAreaScreen} />
      <Stack.Screen name="ConfirmLaptopDetails" component={ConfirmLaptopDetailsScreen} />
    </Stack.Navigator>
  );
}
