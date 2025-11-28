// src/screens/CarScreens/CarLocationScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LocationScreen from '../common/LocationScreen';
import { SellCarStackParamList } from '../../navigation/SellCarStack';

type CarLocationNavProp = NativeStackNavigationProp<SellCarStackParamList, 'CarLocationScreen'>;
type CarLocationRouteProp = RouteProp<SellCarStackParamList, 'CarLocationScreen'>;

const CarLocationScreen: React.FC = () => {
  const navigation = useNavigation<CarLocationNavProp>();
  const route = useRoute<CarLocationRouteProp>();
  const { carId, images, selectedLocation } = route.params;

  const handleOpenLocationPicker = () => {
    navigation.navigate('ChooseLocationScreen', {
      returnScreen: 'CarLocationScreen',
      carId,
      images,
    });
  };

  const handleNext = () => {
    navigation.navigate('ConfirmDetails', { carId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LocationScreen
      title="Set Car Location"
      entityId={carId}
      entityType="car"
      images={images}
      selectedLocation={selectedLocation}
      onOpenLocationPicker={handleOpenLocationPicker}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default CarLocationScreen;
