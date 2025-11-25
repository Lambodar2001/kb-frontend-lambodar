import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyMobilesAdsListScreen from '@features/seller/listings/screens/mobile/MyMobilesAdsListScreen';
import ProductDetailsScreen from '@features/seller/listings/screens/mobile/ProductDetailsScreen';
import UpdateMobileScreen from '@features/seller/listings/screens/mobile/UpdateMobileScreen';
import SellerRequestListScreen from '@features/seller/chat/screens/SellerRequestListScreen';
import SellerChatThreadScreen from '@features/seller/chat/screens/SellerChatThreadScreen';

export type MyMobileAdsStackParamList = {
  MyMobilesAdsList: undefined;
  ProductDetails: { mobileId: number };
  UpdateMobile: { mobileId: number };
  SellerRequestList: { mobileId: number; mobileTitle?: string };
  SellerChatThread: { requestId: number; buyerId: number; mobileId?: number; mobileTitle?: string };
};

const Stack = createNativeStackNavigator<MyMobileAdsStackParamList>();

export default function MyMobileAdsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MyMobilesAdsList"
        component={MyMobilesAdsListScreen}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        listeners={({ navigation }) => ({
          focus: () => {
            // Find the tab navigator by going up the hierarchy
            let parent = navigation.getParent();
            while (parent) {
              if (parent.getState()?.type === 'tab') {
                parent.setOptions({
                  tabBarStyle: { display: 'none' },
                });
                break;
              }
              parent = parent.getParent();
            }
          },
          blur: () => {
            let parent = navigation.getParent();
            while (parent) {
              if (parent.getState()?.type === 'tab') {
                parent.setOptions({
                  tabBarStyle: undefined,
                });
                break;
              }
              parent = parent.getParent();
            }
          },
        })}
      />
      <Stack.Screen
        name="UpdateMobile"
        component={UpdateMobileScreen}
        options={{
          presentation: 'card',
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            let parent = navigation.getParent();
            while (parent) {
              if (parent.getState()?.type === 'tab') {
                parent.setOptions({
                  tabBarStyle: { display: 'none' },
                });
                break;
              }
              parent = parent.getParent();
            }
          },
          blur: () => {
            let parent = navigation.getParent();
            while (parent) {
              if (parent.getState()?.type === 'tab') {
                parent.setOptions({
                  tabBarStyle: undefined,
                });
                break;
              }
              parent = parent.getParent();
            }
          },
        })}
      />
      <Stack.Screen
        name="SellerRequestList"
        component={SellerRequestListScreen}
      />
      <Stack.Screen
        name="SellerChatThread"
        component={SellerChatThreadScreen}
        listeners={({ navigation }) => ({
          focus: () => {
            let parent = navigation.getParent();
            while (parent) {
              if (parent.getState()?.type === 'tab') {
                parent.setOptions({
                  tabBarStyle: { display: 'none' },
                });
                break;
              }
              parent = parent.getParent();
            }
          },
          blur: () => {
            let parent = navigation.getParent();
            while (parent) {
              if (parent.getState()?.type === 'tab') {
                parent.setOptions({
                  tabBarStyle: undefined,
                });
                break;
              }
              parent = parent.getParent();
            }
          },
        })}
      />
    </Stack.Navigator>
  );
}
