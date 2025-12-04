/**
 * Catalog Stack Navigator Factory
 * Creates stack navigators for any entity type
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EntityConfig, BaseEntity } from '../config/entityTypes';
import { CatalogListScreen } from '../screens/CatalogListScreen';
import { CatalogDetailScreen } from '../screens/CatalogDetailScreen';

const Stack = createNativeStackNavigator();

/**
 * Creates a stack navigator for a specific entity type
 */
export function createCatalogStack<T extends BaseEntity>(config: EntityConfig<T>) {
  return function CatalogStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name={config.listScreenName}
          options={{
            title: config.displayNamePlural,
          }}>
          {() => <CatalogListScreen<T> config={config} />}
        </Stack.Screen>
        <Stack.Screen
          name={config.detailScreenName}
          options={{
            title: `${config.displayName} Details`,
          }}>
          {() => <CatalogDetailScreen<T> config={config} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };
}
