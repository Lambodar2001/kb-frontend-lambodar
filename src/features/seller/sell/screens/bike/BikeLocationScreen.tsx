// src/screens/BikeScreens/BikeLocationScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LocationScreen from '../common/LocationScreen';
import { SellBikeStackParamList } from '../../navigation/SellBikeStack';

type BikeLocationNavProp = NativeStackNavigationProp<SellBikeStackParamList, 'BikeLocationScreen'>;
type BikeLocationRouteProp = RouteProp<SellBikeStackParamList, 'BikeLocationScreen'>;

const BikeLocationScreen: React.FC = () => {
  const navigation = useNavigation<BikeLocationNavProp>();
  const route = useRoute<BikeLocationRouteProp>();
  const { bikeId, images, selectedLocation } = route.params;

  const handleOpenLocationPicker = () => {
    navigation.navigate('ChooseLocationScreen', {
      returnScreen: 'BikeLocationScreen',
      bikeId,
      images,
    });
  };

  const handleNext = () => {
    navigation.navigate('ConfirmDetails', { bikeId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LocationScreen
      title="Set Bike Location"
      entityId={bikeId}
      entityType="bike"
      images={images}
      selectedLocation={selectedLocation}
      onOpenLocationPicker={handleOpenLocationPicker}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default BikeLocationScreen;
