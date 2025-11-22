import React from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SellProductScreen from '../screens/SellProductScreen';
import SellMobileStack from './SellMobileStack';
import SellLaptopStack from './SellLaptopStack';
import SellBikeStack from './SellBikeStack';
import SellCarStack from './SellCarStack';

export type SellEntryStackParamList = {
  SellProduct: undefined;
  SellMobileStack: undefined;
  SellLaptopStack: undefined;
  SellBikeStack: undefined;
  SellCarStack: undefined;
};

const Stack = createNativeStackNavigator<SellEntryStackParamList>();

const toggleTabBarVisibility = (
  navigation: NavigationProp<ParamListBase>,
  hide: boolean
) => {
  const tabNavigator = navigation.getParent();
  if (tabNavigator) {
    tabNavigator.setOptions({
      tabBarStyle: hide ? { display: 'none' } : undefined,
    });
  }
};

const sellFlowListeners = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => ({
  focus: () => toggleTabBarVisibility(navigation, true),
  blur: () => toggleTabBarVisibility(navigation, false),
});

export default function SellEntryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellProduct" component={SellProductScreen} />
      <Stack.Screen
        name="SellMobileStack"
        component={SellMobileStack}
        listeners={sellFlowListeners}
      />
      <Stack.Screen
        name="SellLaptopStack"
        component={SellLaptopStack}
        listeners={sellFlowListeners}
      />
      <Stack.Screen
        name="SellBikeStack"
        component={SellBikeStack}
        listeners={sellFlowListeners}
      />
      <Stack.Screen
        name="SellCarStack"
        component={SellCarStack}
        listeners={sellFlowListeners}
      />

    </Stack.Navigator>
  );
}
