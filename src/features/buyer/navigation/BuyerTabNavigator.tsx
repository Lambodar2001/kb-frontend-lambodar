import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BuyerHomeScreen from '../home/screens/BuyerHomeScreen';
import ProfileScreen from '../../shared/profile/screens/ProfileScreen';

// Placeholder screens - to be implemented
const SearchScreen = () => null;
const FavoritesScreen = () => null;
const ChatScreen = () => null;

const Tab = createBottomTabNavigator();

const tabBarBaseStyle = {
  backgroundColor: '#FFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
  height: 60,
  paddingBottom: 8,
  paddingTop: 8,
};

const BuyerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F5E87',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: tabBarBaseStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="BuyerHome"
        component={BuyerHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
          tabBarBadge: undefined, // Can show count when implemented
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Icon name="message-text" size={size} color={color} />
          ),
          tabBarBadge: undefined, // Can show unread count when implemented
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BuyerTabNavigator;
