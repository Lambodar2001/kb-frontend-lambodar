// src/screens/MobileScreens/MobileLocationScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LocationScreen from '../common/LocationScreen';
import { SellMobileStackParamList } from '../../navigation/SellMobileStack';

type MobileLocationNavProp = NativeStackNavigationProp<SellMobileStackParamList, 'MobileLocationScreen'>;
type MobileLocationRouteProp = RouteProp<SellMobileStackParamList, 'MobileLocationScreen'>;

const MobileLocationScreen: React.FC = () => {
  const navigation = useNavigation<MobileLocationNavProp>();
  const route = useRoute<MobileLocationRouteProp>();
  const { mobileId, images, selectedLocation } = route.params;

  const handleOpenLocationPicker = () => {
    navigation.navigate('ChooseLocationScreen', {
      returnScreen: 'MobileLocationScreen',
      mobileId,
      images,
    });
  };

  const handleNext = () => {
    navigation.navigate('ConfirmDetails', { mobileId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LocationScreen
      title="Set Mobile Location"
      entityId={mobileId}
      entityType="mobile"
      images={images}
      selectedLocation={selectedLocation}
      onOpenLocationPicker={handleOpenLocationPicker}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default MobileLocationScreen;
