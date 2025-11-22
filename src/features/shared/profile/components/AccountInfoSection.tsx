import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AccountInfoSectionProps {
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  memberSince?: string;
}

const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({
  email,
  phone,
  emailVerified = false,
  phoneVerified = false,
  memberSince,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>

      {email && (
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Icon name="email-outline" size={20} color="#0F5E87" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.valueRow}>
              <Text style={styles.infoValue}>{email}</Text>
              {emailVerified && (
                <View style={styles.verifiedBadge}>
                  <Icon name="check-decagram" size={14} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {phone && (
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Icon name="phone-outline" size={20} color="#0F5E87" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <View style={styles.valueRow}>
              <Text style={styles.infoValue}>{phone}</Text>
              {phoneVerified && (
                <View style={styles.verifiedBadge}>
                  <Icon name="check-decagram" size={14} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {memberSince && (
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Icon name="calendar-check" size={20} color="#0F5E87" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {new Date(memberSince).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
});

export default AccountInfoSection;
