import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ConfirmContactForm, {
  type ConfirmContactFormValues,
} from '../../components/sell/ConfirmContactForm';
import { PrimaryButton } from '@shared/components';
import SellFlowLayout from '../common/SellFlowLayout';
import { useSafeAsyncState } from '@shared/hooks';
import { useAuth } from '@context/AuthContext';
import { getLaptopConfirmDetailsCombined, type LaptopConfirmDetailsDTO } from '@features/seller/sell/api/LaptopsApi';
import { SellLaptopStackParamList } from '../../navigation/SellLaptopStack';

type ConfirmLaptopNav = NativeStackNavigationProp<SellLaptopStackParamList, 'ConfirmLaptopDetails'>;
type ConfirmLaptopRoute = RouteProp<SellLaptopStackParamList, 'ConfirmLaptopDetails'>;

const ConfirmLaptopDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ConfirmLaptopNav>();
  const route = useRoute<ConfirmLaptopRoute>();
  const { laptopId } = route.params;

  const { userId } = useAuth();
  const [loading, setLoading] = useSafeAsyncState(true);
  const [formData, setFormData] = useSafeAsyncState<LaptopConfirmDetailsDTO>({
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!laptopId) {
          throw new Error('Missing laptop id');
        }
        if (!userId) {
          throw new Error('Missing user id');
        }

        setLoading(true);
        const data = await getLaptopConfirmDetailsCombined({ laptopId, userId });
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
  }, [laptopId, setFormData, setLoading, userId]);

  const handleInputChange = <K extends keyof ConfirmContactFormValues>(
    field: K,
    value: ConfirmContactFormValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostNow = () => {
    Alert.alert('Success', 'Your laptop ad has been posted!');

    // Navigate back to SellerHome tab
    // Navigation hierarchy: SellLaptopStack -> SellEntryStack -> SellerTabNavigator
    const tabNavigator = navigation.getParent()?.getParent();

    if (tabNavigator) {
      // First pop to top of the SellLaptopStack
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
      footer={
        <PrimaryButton label="Post Now" onPress={handlePostNow} loading={loading} />
      }
    >
      <ConfirmContactForm
        values={formData}
        onChange={handleInputChange}
        editable={!loading}
      />
    </SellFlowLayout>
  );
};

export default ConfirmLaptopDetailsScreen;
