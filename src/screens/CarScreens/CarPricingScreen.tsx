// src/screens/CarScreens/CarPricingScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PricingScreen from '../Sell/common/PricingScreen';
import { SellCarStackParamList } from '../../navigation/SellCarStack';
import { getCarById } from '../../api/CarsApi';

type CarPricingNavProp = NativeStackNavigationProp<SellCarStackParamList, 'CarPricingScreen'>;
type CarPricingRouteProp = RouteProp<SellCarStackParamList, 'CarPricingScreen'>;

const CarPricingScreen: React.FC = () => {
  const navigation = useNavigation<CarPricingNavProp>();
  const route = useRoute<CarPricingRouteProp>();
  const { carId, images } = route.params;

  const handleNext = () => {
    navigation.navigate('CarLocationScreen', { carId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <PricingScreen
      title="Car Price"
      entityId={carId}
      entityType="car"
      images={images}
      fetchEntityById={getCarById}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default CarPricingScreen;
