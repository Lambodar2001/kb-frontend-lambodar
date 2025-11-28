// src/screens/MobileScreens/MobilePricingScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PricingScreen from '../common/PricingScreen';
import { SellMobileStackParamList } from '../../navigation/SellMobileStack';
import { getMobileById } from '@features/seller/sell/api/MobilesApi';

type MobilePricingNavProp = NativeStackNavigationProp<SellMobileStackParamList, 'MobilePricingScreen'>;
type MobilePricingRouteProp = RouteProp<SellMobileStackParamList, 'MobilePricingScreen'>;

const MobilePricingScreen: React.FC = () => {
  const navigation = useNavigation<MobilePricingNavProp>();
  const route = useRoute<MobilePricingRouteProp>();
  const { mobileId, images } = route.params;

  const handleNext = () => {
    navigation.navigate('MobileLocationScreen', { mobileId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <PricingScreen
      title="Mobile Price"
      entityId={mobileId}
      entityType="mobile"
      images={images}
      fetchEntityById={getMobileById}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default MobilePricingScreen;
