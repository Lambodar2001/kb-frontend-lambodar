import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type ListingCardMenuProps = {
  title?: string;
  statusLabel?: string;
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  isDeleting?: boolean;
  disabled?: boolean;
};

const ListingCardMenu: React.FC<ListingCardMenuProps> = ({
  title,
  statusLabel,
  onEdit,
  onDelete,
  editLabel = 'Update',
  deleteLabel = 'Delete',
  isDeleting = false,
  disabled = false,
}) => {
  const editDisabled = disabled || isDeleting;
  const deleteDisabled = disabled || isDeleting;

  return (
    <View style={styles.container}>
      {/* Optional context header */}
      {!!title && (
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          {!!statusLabel && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{statusLabel}</Text>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <TouchableOpacity
        style={[styles.row, editDisabled && styles.disabledRow]}
        onPress={onEdit}
        activeOpacity={0.8}
        disabled={editDisabled}
        accessibilityRole="button"
        accessibilityLabel={`${editLabel} listing`}
      >
        <View style={styles.iconWrap}>
          <Icon name="pencil" size={18} color="#216DBD" />
        </View>
        <Text style={[styles.rowText, editDisabled && styles.disabledText]}>{editLabel}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.row, deleteDisabled && styles.disabledRow]}
        onPress={onDelete}
        activeOpacity={0.8}
        disabled={deleteDisabled}
        accessibilityRole="button"
        accessibilityLabel={`${deleteLabel} listing`}
      >
        <View style={[styles.iconWrap, styles.deleteIconWrap, isDeleting && styles.deleteIconBusy]}>
          {isDeleting ? (
            <ActivityIndicator size="small" color="#D93025" />
          ) : (
            <Icon name="trash-can-outline" size={18} color="#D93025" />
          )}
        </View>
        <Text
          style={[styles.rowText, styles.deleteText, deleteDisabled && styles.disabledDeleteText]}
        >
          {deleteLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListingCardMenu;

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  header: { marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F0F6FF',
  },
  badgeText: { fontSize: 11, color: '#216DBD', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconWrap: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#E8F1FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowText: { fontSize: 15, fontWeight: '500', color: '#111' },
  divider: { height: 1, backgroundColor: '#EFEFEF', marginVertical: 2 },
  disabledRow: { opacity: 0.6 },
  disabledText: { color: '#9AA4AF' },
  deleteIconWrap: { backgroundColor: '#FFE9E9' },
  deleteIconBusy: { justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#D93025', fontWeight: '500' },
  disabledDeleteText: { color: '#F5A3A0' },
});
