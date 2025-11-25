// src/features/seller/chat/components/StatusActionButtons.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RequestStatus } from '../types';
import { updateRequestStatus, completeDeal } from '../api/chatApi';

interface StatusActionButtonsProps {
  requestId: number;
  currentStatus: RequestStatus;
  onStatusUpdated: () => void;
}

const StatusActionButtons: React.FC<StatusActionButtonsProps> = ({
  requestId,
  currentStatus,
  onStatusUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: 'IN_NEGOTIATION' | 'ACCEPTED' | 'REJECTED', action: string) => {
    Alert.alert(
      `${action}?`,
      `Are you sure you want to ${action.toLowerCase()} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          onPress: async () => {
            try {
              setLoading(true);
              await updateRequestStatus(requestId, newStatus);
              Alert.alert('Success', `Request ${action.toLowerCase()}ed successfully`);
              onStatusUpdated();
            } catch (error: any) {
              Alert.alert('Error', error?.errorMessage || `Failed to ${action.toLowerCase()} request`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCompleteDeal = async () => {
    Alert.alert(
      'Complete Deal?',
      'This will mark the mobile as SOLD and reject all other pending requests. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete Deal',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('[STATUS_BUTTONS] Completing deal for request:', requestId);
              await completeDeal(requestId);
              console.log('[STATUS_BUTTONS] Deal completed successfully');
              Alert.alert(
                'Deal Completed!',
                'The mobile has been marked as SOLD. All other pending requests have been rejected.',
                [
                  {
                    text: 'OK',
                    onPress: () => onStatusUpdated()
                  }
                ]
              );
            } catch (error: any) {
              console.error('[STATUS_BUTTONS] Error completing deal:', error);
              Alert.alert('Error', error?.response?.data?.message || error?.message || 'Failed to complete deal');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0F5E87" />
        <Text style={styles.loadingText}>Updating...</Text>
      </View>
    );
  }

  // PENDING status
  if (currentStatus === 'PENDING') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => handleStatusUpdate('IN_NEGOTIATION', 'Start Negotiation')}
          activeOpacity={0.8}
        >
          <Icon name="chat-processing" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Start Negotiation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleStatusUpdate('REJECTED', 'Reject')}
          activeOpacity={0.8}
        >
          <Icon name="close-circle" size={18} color="#EF4444" />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // IN_NEGOTIATION or ACCEPTED status - Show Complete and Reject
  if (currentStatus === 'IN_NEGOTIATION' || currentStatus === 'ACCEPTED') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleCompleteDeal}
          activeOpacity={0.8}
        >
          <Icon name="check-all" size={18} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>Complete Deal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleStatusUpdate('REJECTED', 'Reject')}
          activeOpacity={0.8}
        >
          <Icon name="close-circle" size={18} color="#EF4444" />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // COMPLETED or REJECTED - no buttons
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#0F5E87',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  completeButton: {
    backgroundColor: '#6B7280',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default StatusActionButtons;
