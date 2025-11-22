// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from './src/features/auth/screens/LoginScreen';
import SignupScreen from './src/features/auth/screens/SignupScreen';

// Role-based navigators
import BuyerTabNavigator from './src/features/buyer/navigation/BuyerTabNavigator';
import SellerTabNavigator from './src/features/seller/navigation/SellerTabNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  const { clearAuthenticating, roles } = useAuth();

  // Clear authenticating state once Main screen is mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      clearAuthenticating();
    }, 500); // Small delay to ensure smooth transition

    return () => clearTimeout(timer);
  }, [clearAuthenticating]);

  // Determine which navigator to show based on user role
  const isSeller = roles.includes('SELLER');
  const isBuyer = roles.includes('BUYER') || roles.includes('USER');

  // Sellers get SellerTabNavigator
  if (isSeller) {
    return <SellerTabNavigator />;
  }

  // Buyers (and default users) get BuyerTabNavigator
  if (isBuyer) {
    return <BuyerTabNavigator />;
  }

  // Fallback to buyer navigator if no role is set
  return <BuyerTabNavigator />;
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
