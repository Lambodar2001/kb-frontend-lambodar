import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SellFlowLayout from '../Sell/common/SellFlowLayout';
import PrimaryButton from '../../components/common/PrimaryButton';
import FormField from '../../components/form/FormField';
import { colors, radii, shadows, spacing } from '../../theme/tokens';
import { CarStackParamList } from '../../navigation/CarStack';
import { getCarById } from '../../api/CarsApi';

type CarPricingNavProp = NativeStackNavigationProp<CarStackParamList, 'CarPricingScreen'>;
type CarPricingRouteProp = RouteProp<CarStackParamList, 'CarPricingScreen'>;

const PRICE_HINTS = [
  'Consider model year, variant, mileage, and service history.',
  'Consider model year, variant, mileage, and service history',
];

function formatINR(numeric: string) {
  if (!numeric) return '0';
  const num = Number(numeric);
  if (!Number.isFinite(num)) return numeric;
  const [intPart, decPart] = num.toString().split('.');
  const lastThree = intPart.slice(-3);
  const other = intPart.slice(0, -3);
  const withCommas =
    other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (other ? ',' : '') + lastThree;
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

const CarPricingScreen: React.FC = () => {
  const navigation = useNavigation<CarPricingNavProp>();
  const route = useRoute<CarPricingRouteProp>();
  const { carId, images } = route.params;

  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch car price on component mount
  useEffect(() => {
    const fetchCarPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const carData = await getCarById(carId);

        if (carData.price != null) {
          setPrice(String(carData.price));
        } else {
          setError('Price not found for this car');
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch car price';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarPrice();
    }
  }, [carId]);

  const handlePriceChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setPrice(sanitized);
  };

  const handleSavePrice = () => {
    if (!price) {
      Alert.alert('Add Price', 'Please enter a price to continue.');
      return;
    }
    // Navigate to CarLocationScreen with carId, images, and price
    navigation.navigate('CarLocationScreen', { carId, images });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SellFlowLayout
      title="Car Price"
      onBack={handleBack}
      footer={
        <PrimaryButton
          label="Next"
          onPress={handleSavePrice}
          disabled={!price || loading}
          loading={loading}
        />
      }
    >
      <FormField label="Current Listing Price" required>
        <View style={styles.priceInputContainer}>
          <View style={styles.currencyChip}>
            <Icon name="currency-inr" size={18} color={colors.white} />
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Fetching price...</Text>
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.priceDisplay}>
              {price ? formatINR(price) : 'No price set'}
            </Text>
          )}
        </View>
      </FormField>

      <View style={styles.tipsCard}>
        <View style={styles.tipHeader}>
          <Icon name="lightbulb-on-outline" size={20} color={colors.stepActive} />
          <Text style={styles.tipTitle}>Pricing tips</Text>
        </View>
        {PRICE_HINTS.map((hint) => (
          <View key={hint} style={styles.tipRow}>
            <View style={styles.bullet} />
            <Text style={styles.tipText}>{hint}</Text>
          </View>
        ))}
      </View>
    </SellFlowLayout>
  );
};

const styles = StyleSheet.create({
  // tighter: height & horizontal padding reduced
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,  // was spacing.md
    minHeight: 48,                  // was 56
  },
  // tighter: smaller chip and margin
  currencyChip: {
    width: 32,                      // was 40
    height: 32,                     // was 40
    borderRadius: 16,               // was 20
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,        // was spacing.md
  },
  // Read-only price display
  priceDisplay: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: 4,
  },
  // Loading container
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  // Error text
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.error || '#dc2626',
    fontWeight: '500',
  },
  // tighter: less top margin & padding
  tipsCard: {
    marginTop: spacing.lg,          // was spacing.xxl
    backgroundColor: colors.white,
    borderRadius: radii.sm,         // was radii.md (optional tighter corners)
    padding: spacing.md,            // was spacing.xl
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  // tighter: less gap under header
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,       // was spacing.md
    gap: spacing.xs,                // was spacing.sm
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  // tighter: less vertical gap between rows
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,       // was spacing.sm
  },
  // tighter: less right margin next to bullet
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.stepActive,
    marginTop: spacing.xs,
    marginRight: spacing.sm,        // was spacing.md
  },
  // tighter: reduced line height
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,                 // was 20
  },
});

export default CarPricingScreen;
