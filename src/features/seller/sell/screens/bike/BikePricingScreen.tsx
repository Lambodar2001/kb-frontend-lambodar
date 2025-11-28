// src/screens/BikeScreens/BikePricingScreen.tsx
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PricingScreen from '../common/PricingScreen';
import { SellBikeStackParamList } from '../../navigation/SellBikeStack';
import { getBikeById } from '@features/seller/sell/api/BikesApi';

type BikePricingNavProp = NativeStackNavigationProp<SellBikeStackParamList, 'BikePricingScreen'>;
type BikePricingRouteProp = RouteProp<SellBikeStackParamList, 'BikePricingScreen'>;

const BikePricingScreen: React.FC = () => {
  const navigation = useNavigation<BikePricingNavProp>();
  const route = useRoute<BikePricingRouteProp>();
  const { bikeId, images } = route.params;

  const handleNext = () => {
    navigation.navigate('BikeLocationScreen', { bikeId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <PricingScreen
      title="Bike Price"
      entityId={bikeId}
      entityType="bike"
      images={images}
      fetchEntityById={getBikeById}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

export default BikePricingScreen;
