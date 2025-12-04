// src/features/seller/chat/screens/SellerChatListScreen.tsx
// Placeholder screen - Seller accesses chats from My Ads screen

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SellerChatListScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
          <Icon name="magnify" size={24} color="#002F34" />
        </TouchableOpacity>
      </View>

      {/* Info Message */}
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon name="chat-outline" size={64} color="#CBD5E1" />
        </View>
        <Text style={styles.emptyTitle}>View chats from My Ads</Text>
        <Text style={styles.emptySubtitle}>
          To access buyer chat requests,{'\n'}
          go to My Ads and tap the chat icon{'\n'}
          on any mobile listing
        </Text>

        <View style={styles.infoCard}>
          <Icon name="information-outline" size={20} color="#0F5E87" />
          <Text style={styles.infoText}>
            Each mobile has its own chat requests
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002F34',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002F34',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F3F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#0F5E87',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default SellerChatListScreen;
