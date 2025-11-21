// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import LoginScreen from './src/features/auth/screens/LoginScreen';
import SignupScreen from './src/features/auth/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailsScreen from './src/features/seller/listings/screens/mobile/ProductDetailsScreen';
import LiveBiddingScreen from './src/screens/LiveBiddingScreen';
import ProfileScreen from './src/features/shared/profile/screens/ProfileScreen';

// ✅ New entry stacks (replace old SellProductStack/MyAdsStack usage here)
import SellEntryStack from './src/features/seller/sell/navigation/SellEntryStack';
import MyAdsEntryStack from './src/features/seller/listings/navigation/MyAdsEntryStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import CustomTabBar from './src/components/CustomTabBar';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStackNav = createNativeStackNavigator();

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNav.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
    </HomeStackNav.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  const { clearAuthenticating } = useAuth();

  // Clear authenticating state once Main screen is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      clearAuthenticating();
    }, 500); // Small delay to ensure smooth transition

    return () => clearTimeout(timer);
  }, [clearAuthenticating]);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* ALL TABS - Show for everyone, role guards inside screens will handle access */}
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Live Bidding" component={LiveBiddingScreen} />
      <Tab.Screen name="Sell Product" component={SellEntryStack} />
      <Tab.Screen name="My Ads" component={MyAdsEntryStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) return null; // Initial session load

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <RootStack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
