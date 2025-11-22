import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface SettingsSectionProps {
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 'notifications',
    icon: 'bell-outline',
    label: 'Notifications',
    onPress: () => console.log('Navigate to Notifications'),
  },
  {
    id: 'privacy',
    icon: 'shield-account-outline',
    label: 'Privacy & Security',
    onPress: () => console.log('Navigate to Privacy'),
  },
  {
    id: 'password',
    icon: 'lock-outline',
    label: 'Change Password',
    onPress: () => console.log('Navigate to Change Password'),
  },
  {
    id: 'language',
    icon: 'translate',
    label: 'Language',
    onPress: () => console.log('Navigate to Language'),
  },
];

const SettingsSection: React.FC<SettingsSectionProps> = ({ menuItems = defaultMenuItems }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={20} color="#1D6D99" />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default SettingsSection;
