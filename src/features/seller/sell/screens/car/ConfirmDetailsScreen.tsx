// src/screens/CarScreens/ConfirmDetailsScreen.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SellFlowLayout from '../common/SellFlowLayout';
import { PrimaryButton } from '@shared/components';
import ConfirmContactForm, {
  type ConfirmContactFormValues,
} from '../../components/sell/ConfirmContactForm';
import { useSafeAsyncState } from '@shared/hooks';
import { useAuth } from '@context/AuthContext';
import { getConfirmDetailsCombined, type CarConfirmDetailsDTO } from '@features/seller/sell/api/CarsApi';
import { SellCarStackParamList } from '../../navigation/SellCarStack';

type ConfirmRoute = RouteProp<SellCarStackParamList, 'ConfirmDetails'>;
type ConfirmNav = NativeStackNavigationProp<SellCarStackParamList, 'ConfirmDetails'>;

const ConfirmDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ConfirmNav>();
  const route = useRoute<ConfirmRoute>();
  const { carId } = route.params;

  const { userId } = useAuth();
  const [loading, setLoading] = useSafeAsyncState(true);
  const [formData, setFormData] = useSafeAsyncState<CarConfirmDetailsDTO>({
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!carId) {
          throw new Error('Missing car id');
        }
        if (!userId) {
          throw new Error('Missing user id');
        }

        setLoading(true);
        const data = await getConfirmDetailsCombined({ carId, userId });
        setFormData(data);
      } catch (error: any) {
        Alert.alert(
          'Error',
          error?.response?.data?.message || error?.message || 'Failed to load details',
        );
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [carId, setFormData, setLoading, userId]);

  const handleChange = <K extends keyof ConfirmContactFormValues>(
    field: K,
    value: ConfirmContactFormValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostNow = () => {
    Alert.alert('Success', 'Your ad has been posted!');

    // Navigate back to SellerHome tab
    // Navigation hierarchy: SellCarStack -> SellEntryStack -> SellerTabNavigator
    const tabNavigator = navigation.getParent()?.getParent();

    if (tabNavigator) {
      // First pop to top of the SellCarStack
      navigation.popToTop();

      // Then navigate to SellerHome tab
      tabNavigator.navigate('SellerHome' as never);
    } else {
      // Fallback: just pop to top of current stack
      navigation.popToTop();
    }
  };

  return (
    <SellFlowLayout
      title="Confirm Details"
      onBack={() => navigation.goBack()}
      footer={<PrimaryButton label="Post Now" onPress={handlePostNow} loading={loading} />}
    >
      <ConfirmContactForm
        values={formData}
        onChange={handleChange}
        editable={!loading}
      />
    </SellFlowLayout>
  );
};

export default ConfirmDetailsScreen;
