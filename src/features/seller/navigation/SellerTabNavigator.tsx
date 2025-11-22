import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SellerHomeScreen from '../home/screens/SellerHomeScreen';
import SellEntryStack from '../sell/navigation/SellEntryStack';
import MyAdsEntryStack from '../listings/navigation/MyAdsEntryStack';
import ProfileScreen from '../../shared/profile/screens/ProfileScreen';

// Placeholder screens - to be implemented
const ChatScreen = () => null;

const Tab = createBottomTabNavigator();

const tabBarBaseStyle = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
  height: Platform.OS === 'ios' ? 88 : 65,
  paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  paddingTop: 8,
};

const SellerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#002F34',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: tabBarBaseStyle,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="SellerHome"
        component={SellerHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="SellEntry"
        component={SellEntryStack}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: () => (
            <View style={styles.sellButtonWrapper}>
              <View style={styles.sellButton}>
                <View style={styles.sellButtonInner}>
                  <Icon name="add" size={26} color="#FFFFFF" style={styles.plusIcon} />
                </View>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MyAdsEntry"
        component={MyAdsEntryStack}
        options={{
          tabBarLabel: 'My Ads',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'file-tray-full' : 'file-tray-full-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  sellButtonWrapper: {
    width: 60,
    height: 60,
    marginTop: -50,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#002F34',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sellButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#23E5DB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  sellButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002F34',
  },
  plusIcon: {
    fontWeight: 'bold',
  },
});

export default SellerTabNavigator;
