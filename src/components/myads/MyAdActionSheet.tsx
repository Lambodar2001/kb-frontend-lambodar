import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  title?: string;
  status?: string;
  entityLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting: boolean;
};

const MyAdActionSheet: React.FC<Props> = ({ title, status, entityLabel, onEdit, onDelete, deleting }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title ?? 'Selected ad'}</Text>
      {status ? (
        <Text style={styles.statusLabel}>
          Status:{' '}
          <Text style={styles.statusValue}>
            {status}
          </Text>
        </Text>
      ) : null}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, !onEdit && styles.disabledButton]}
          onPress={onEdit}
          disabled={!onEdit || deleting}
        >
          <Icon name="pencil-outline" size={20} color="#2563EB" />
          <Text style={styles.actionText}>Edit {entityLabel ?? 'Ad'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton, (!onDelete || deleting) && styles.disabledButton]}
          onPress={onDelete}
          disabled={!onDelete || deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Icon name="delete-outline" size={20} color="#fff" />
          )}
          <Text style={[styles.actionText, styles.deleteText]}>Delete listing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyAdActionSheet;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusValue: {
    fontWeight: '600',
    color: '#111827',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  deleteText: {
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
