// src/screens/Sell/common/PricingScreen.tsx
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SellFlowLayout from './SellFlowLayout';
import { PrimaryButton, FormField } from '@shared/components';
import { colors, radii, shadows, spacing } from '@theme/tokens';

type EntityType = 'car' | 'bike' | 'mobile' | 'laptop';

interface PricingScreenProps {
  /** The title displayed in the header */
  title: string;
  /** The entity ID to fetch price for */
  entityId: number;
  /** The type of entity (car, bike, mobile, laptop) */
  entityType: EntityType;
  /** Optional images array to pass forward */
  images?: string[];
  /** Callback to fetch entity data by ID */
  fetchEntityById: (id: number) => Promise<any>;
  /** Callback when user presses Next */
  onNext: () => void;
  /** Callback when user presses Back */
  onBack: () => void;
  /** Optional custom pricing hints */
  pricingHints?: string[];
}

const DEFAULT_PRICING_HINTS: Record<EntityType, string[]> = {
  car: [
    'Consider model year, variant, mileage, and service history.',
    'Check similar listings in your area for competitive pricing.',
  ],
  bike: [
    'Consider model year, condition, mileage, and service history.',
    'Check similar listings in your area for competitive pricing.',
  ],
  mobile: [
    'Consider model year, condition, accessories, and warranty status.',
    'Check current market prices for similar models.',
  ],
  laptop: [
    'Consider specifications, age, condition, and warranty status.',
    'Check current market prices for similar configurations.',
  ],
};

const ENTITY_PRICE_FIELD_MAP: Record<EntityType, string> = {
  car: 'price',
  bike: 'prize', // Note: Backend has typo but we handle it
  mobile: 'price',
  laptop: 'price',
};

function formatINR(numeric: string | number): string {
  if (!numeric) return '0';
  const num = typeof numeric === 'string' ? Number(numeric) : numeric;
  if (!Number.isFinite(num)) return String(numeric);

  const [intPart, decPart] = num.toString().split('.');
  const lastThree = intPart.slice(-3);
  const other = intPart.slice(0, -3);
  const withCommas =
    other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (other ? ',' : '') + lastThree;
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

const PricingScreen: React.FC<PricingScreenProps> = ({
  title,
  entityId,
  entityType,
  images,
  fetchEntityById,
  onNext,
  onBack,
  pricingHints,
}) => {
  const [price, setPrice] = useState<string | number>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hints = pricingHints || DEFAULT_PRICING_HINTS[entityType];
  const priceField = ENTITY_PRICE_FIELD_MAP[entityType];

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const entityData = await fetchEntityById(entityId);

        const priceValue = entityData[priceField];
        if (priceValue != null) {
          setPrice(priceValue);
        } else {
          setError('Price not found for this item');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || err?.message || 'Failed to fetch price';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      fetchPrice();
    }
  }, [entityId, fetchEntityById, priceField]);

  const handleNext = () => {
    if (!price) {
      Alert.alert('Add Price', 'Please wait for price to load before continuing.');
      return;
    }
    onNext();
  };

  return (
    <SellFlowLayout
      title={title}
      onBack={onBack}
      footer={
        <PrimaryButton
          label="Next"
          onPress={handleNext}
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
        {hints.map((hint, index) => (
          <View key={`${hint}-${index}`} style={styles.tipRow}>
            <View style={styles.bullet} />
            <Text style={styles.tipText}>{hint}</Text>
          </View>
        ))}
      </View>
    </SellFlowLayout>
  );
};

const styles = StyleSheet.create({
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    minHeight: 48,
  },
  currencyChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  priceDisplay: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: 4,
  },
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
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.error || '#dc2626',
    fontWeight: '500',
  },
  tipsCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.stepActive,
    marginTop: spacing.xs,
    marginRight: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default PricingScreen;
