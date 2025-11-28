// src/screens/LaptopScreens/LaptopLocationScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LocationScreen from '../common/LocationScreen';
import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';

type LaptopLocationNavProp = NativeStackNavigationProp<SellLaptopStackParamList, 'LaptopLocationScreen'>;
type LaptopLocationRouteProp = RouteProp<SellLaptopStackParamList, 'LaptopLocationScreen'>;

const LaptopLocationScreen: React.FC = () => {
  const navigation = useNavigation<LaptopLocationNavProp>();
  const route = useRoute<LaptopLocationRouteProp>();
  const { laptopId, images, selectedLocation } = route.params;

  const handleOpenLocationPicker = () => {
    navigation.navigate('ChooseLocationScreen', {
      returnScreen: 'LaptopLocationScreen',
      laptopId,
      images,
    });
  };

  const handleNext = () => {
    navigation.navigate('ConfirmLaptopDetails', { laptopId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LocationScreen
      title="Set Laptop Location"
      entityId={laptopId}
      entityType="laptop"
      images={images}
      selectedLocation={selectedLocation}
      onOpenLocationPicker={handleOpenLocationPicker}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default LaptopLocationScreen;
