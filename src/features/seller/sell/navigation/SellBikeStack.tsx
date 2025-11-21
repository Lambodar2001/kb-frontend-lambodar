import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import AddBikeDetailsScreen from '@features/seller/sell/screens/bike/AddBikeDetailsScreen';
import SelectBikePhotoScreen from '@features/seller/sell/screens/bike/SelectBikePhotoScreen';
import BikePricingScreen from '@features/seller/sell/screens/bike/BikePricingScreen';
import BikeLocationScreen from '@features/seller/sell/screens/bike/BikeLocationScreen';
import ChooseLocationScreen from '@features/seller/sell/screens/common/ChooseLocationScreen';
import ChooseCityScreen from '@features/seller/sell/screens/common/ChooseCityScreen';
import ChooseAreaScreen from '@features/seller/sell/screens/common/ChooseAreaScreen';
import ConfirmDetailsScreen from '@features/seller/sell/screens/bike/ConfirmDetailsScreen';

export type SellBikeStackParamList = {
  AddBikeDetails: undefined;
  SelectPhoto: { bikeId: number };
  BikePricingScreen: { bikeId: number; images?: string[] };
  BikeLocationScreen: { bikeId: number; images?: string[]; selectedLocation?: string };
  ChooseLocationScreen: { returnScreen: string; bikeId: number; images?: string[] };
  ChooseCityScreen: { stateName: string; bikeId: number; images?: string[] };
  ChooseAreaScreen: { cityName: string; bikeId: number; images?: string[] };
  ConfirmDetails: { bikeId: number; images?: string[] };
};

const Stack = createNativeStackNavigator<SellBikeStackParamList>();

const SellBikeStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="AddBikeDetails"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AddBikeDetails" component={AddBikeDetailsScreen} />
      <Stack.Screen name="SelectPhoto" component={SelectBikePhotoScreen} />
      <Stack.Screen name="BikePricingScreen" component={BikePricingScreen} />
      <Stack.Screen name="BikeLocationScreen" component={BikeLocationScreen} />
      <Stack.Screen name="ChooseLocationScreen" component={ChooseLocationScreen} />
      <Stack.Screen name="ChooseCityScreen" component={ChooseCityScreen} />
      <Stack.Screen name="ChooseAreaScreen" component={ChooseAreaScreen} />
      <Stack.Screen name="ConfirmDetails" component={ConfirmDetailsScreen} />
    </Stack.Navigator>
  );
};

export default SellBikeStack;
