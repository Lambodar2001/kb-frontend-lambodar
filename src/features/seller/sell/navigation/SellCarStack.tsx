import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddCarDetailsScreen from '@features/seller/sell/screens/car/AddCarDetailsScreen';
import SelectCarPhotoScreen from '@features/seller/sell/screens/car/SelectCarPhotoScreen';
import CarPricingScreen from '@features/seller/sell/screens/car/CarPricingScreen';
import CarLocationScreen from '@features/seller/sell/screens/car/CarLocationScreen';
import ChooseLocationScreen from '@features/seller/sell/screens/common/ChooseLocationScreen';
import ChooseCityScreen from '@features/seller/sell/screens/common/ChooseCityScreen';
import ChooseAreaScreen from '@features/seller/sell/screens/common/ChooseAreaScreen';
import ConfirmDetailsScreen from '@features/seller/sell/screens/car/ConfirmDetailsScreen';

export type SellCarStackParamList = {
  AddCarDetails: undefined;
  SelectPhoto: { carId: number };
  CarPricingScreen: { carId: number; images?: string[] };
  CarLocationScreen: { carId: number; images?: string[]; selectedLocation?: string };
  ChooseLocationScreen: { returnScreen: string; carId: number; images?: string[] };
  ChooseCityScreen: { stateName: string; carId: number; images?: string[] };
  ChooseAreaScreen: { cityName: string; carId: number; images?: string[] };
  ConfirmDetails: { carId: number; images?: string[] };
};

const Stack = createNativeStackNavigator<SellCarStackParamList>();

export default function SellCarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddCarDetails" component={AddCarDetailsScreen} />
      <Stack.Screen name="SelectPhoto" component={SelectCarPhotoScreen} />
      <Stack.Screen name="CarPricingScreen" component={CarPricingScreen} />
      <Stack.Screen name="CarLocationScreen" component={CarLocationScreen} />
      <Stack.Screen name="ChooseLocationScreen" component={ChooseLocationScreen} />
      <Stack.Screen name="ChooseCityScreen" component={ChooseCityScreen} />
      <Stack.Screen name="ChooseAreaScreen" component={ChooseAreaScreen} />
      <Stack.Screen name="ConfirmDetails" component={ConfirmDetailsScreen} />
    </Stack.Navigator>
  );
}
