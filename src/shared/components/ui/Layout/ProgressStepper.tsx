// src/components/common/ProgressStepper.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '../../../../theme/tokens';

export type StepStatus = 'completed' | 'current' | 'upcoming';

export interface StepConfig {
  label: string;
  status: StepStatus;
}

interface ProgressStepperProps {
  steps: StepConfig[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <React.Fragment key={step.label}>
            <View style={styles.step}>
              <View
                style={[
                  styles.circle,
                  step.status !== 'upcoming' && styles.circleActive,
                  step.status === 'completed' && styles.circleCompleted,
                ]}
              >
                {step.status === 'completed' ? (
                  <Icon name="check" size={12} color={colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      step.status !== 'upcoming' && styles.circleTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  step.status === 'completed' && styles.labelCompleted,
                  step.status === 'current' && styles.labelActive,
                ]}
              >
                {step.label}
              </Text>
            </View>
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  (step.status === 'completed' || step.status === 'current') && styles.connectorActive,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  step: {
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.stepInactive,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.stepInactive,
  },
  circleActive: {
    backgroundColor: colors.stepActive,
    borderColor: colors.stepActive,
  },
  circleCompleted: {
    backgroundColor: colors.stepActive,
  },
  circleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  circleTextActive: {
    color: colors.white,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.stepActive,
    fontWeight: '600',
  },
  labelCompleted: {
    color: colors.stepActive,
    fontWeight: '600',
  },
  connector: {
    width: 24,
    height: 2,
    backgroundColor: colors.stepInactive,
    marginHorizontal: spacing.xs,
  },
  connectorActive: {
    backgroundColor: colors.stepActive,
  },
});

export default ProgressStepper;
