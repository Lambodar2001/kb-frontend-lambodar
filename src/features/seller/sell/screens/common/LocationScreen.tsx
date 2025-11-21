// src/screens/Sell/common/LocationScreen.tsx
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SellFlowLayout from './SellFlowLayout';
import { PrimaryButton, FormField } from '@shared/components';
import { colors, radii, spacing } from '@theme/tokens';

type EntityType = 'car' | 'bike' | 'mobile' | 'laptop';

interface LocationScreenProps {
  /** The title displayed in the header */
  title: string;
  /** The entity ID */
  entityId: number;
  /** The type of entity (car, bike, mobile, laptop) */
  entityType: EntityType;
  /** Optional images array to pass forward */
  images?: string[];
  /** Current selected location (if any) */
  selectedLocation?: string;
  /** Callback to open location picker */
  onOpenLocationPicker: () => void;
  /** Callback when user presses Next */
  onNext: () => void;
  /** Callback when user presses Back */
  onBack: () => void;
  /** Optional default location */
  defaultLocation?: string;
}

const DEFAULT_LOCATION = 'Hinjewadi, Pune';

const LocationScreen: React.FC<LocationScreenProps> = ({
  title,
  entityId,
  entityType,
  images,
  selectedLocation,
  onOpenLocationPicker,
  onNext,
  onBack,
  defaultLocation,
}) => {
  const [location, setLocation] = useState(
    selectedLocation || defaultLocation || DEFAULT_LOCATION
  );

  // Update location when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  const handleNext = () => {
    if (!location.trim()) {
      Alert.alert('Add Location', 'Please enter a location to continue.');
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
          disabled={!location.trim()}
        />
      }
    >
      <FormField label="Location" required>
        <TouchableOpacity
          style={styles.locationInputContainer}
          onPress={onOpenLocationPicker}
          activeOpacity={0.7}
        >
          <View style={styles.locationIcon}>
            <Icon name="map-marker" size={20} color={colors.white} />
          </View>
          <Text style={styles.locationInput}>{location}</Text>
          <Icon name="chevron-right" size={24} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.subtitle}>Location - {location}</Text>
      </FormField>
    </SellFlowLayout>
  );
};

const styles = StyleSheet.create({
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

export default LocationScreen;
