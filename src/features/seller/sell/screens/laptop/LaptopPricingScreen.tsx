// src/screens/LaptopScreens/LaptopPricingScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PricingScreen from '../common/PricingScreen';
import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';
import { getLaptopById } from '@features/seller/sell/api/LaptopsApi';

type LaptopPricingNavProp = NativeStackNavigationProp<SellLaptopStackParamList, 'LaptopPricingScreen'>;
type LaptopPricingRouteProp = RouteProp<SellLaptopStackParamList, 'LaptopPricingScreen'>;

const LaptopPricingScreen: React.FC = () => {
  const navigation = useNavigation<LaptopPricingNavProp>();
  const route = useRoute<LaptopPricingRouteProp>();
  const { laptopId, images } = route.params;

  const handleNext = () => {
    navigation.navigate('LaptopLocationScreen', { laptopId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <PricingScreen
      title="Laptop Price"
      entityId={laptopId}
      entityType="laptop"
      images={images}
      fetchEntityById={getLaptopById}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default LaptopPricingScreen;
