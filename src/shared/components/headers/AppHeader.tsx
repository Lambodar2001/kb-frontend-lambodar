import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppHeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  showNotification?: boolean;
  notificationCount?: number;
  showLocation?: boolean;
  location?: string;
  onNotificationPress?: () => void;
  onLocationPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  showSearch = false,
  searchPlaceholder = 'Search...',
  showNotification = false,
  notificationCount = 0,
  showLocation = false,
  location = 'Pune',
  onNotificationPress,
  onLocationPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Top Row */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <View style={styles.brandLogo}>
            <Icon name="storefront-outline" size={18} color="#0F172A" />
          </View>
          <Text style={styles.brandText}>
            Kharido
            <Text style={styles.brandGreen}>Becho</Text>
          </Text>
        </View>

        {showLocation && (
          <TouchableOpacity style={styles.locationPill} onPress={onLocationPress}>
            <Icon name="map-marker" size={20} color="#6B7280" />
            <Text style={styles.locationText}>{location}</Text>
            <Icon name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Row (Search + Notification) */}
      {(showSearch || showNotification) && (
        <View style={styles.headerBottomRow}>
          {showSearch && (
            <View style={styles.searchBar}>
              <Icon name="magnify" size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {showNotification && (
            <TouchableOpacity
              style={styles.roundIconButton}
              onPress={onNotificationPress}
            >
              <Icon name="bell-outline" size={20} color="#0F172A" />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#E5F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 10,
  },
  brandGreen: {
    color: '#22C55E',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginHorizontal: 4,
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    padding: 0,
    fontSize: 14,
    color: '#111827',
  },
  roundIconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AppHeader;
