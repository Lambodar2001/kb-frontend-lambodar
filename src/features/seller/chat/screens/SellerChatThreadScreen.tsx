// src/features/seller/chat/screens/SellerChatThreadScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@context/AuthContext';
import { useBookingThread, useSendMessage } from '@core/booking/hooks';
import { createBookingApi } from '@core/booking/api';
import { MobileEntity } from '@core/booking/types/entity.types';
import { ConversationMessage } from '@core/booking/types/booking.types';
import MessageBubble from '../../../buyer/chat/components/MessageBubble';
import ChatInput from '../../../buyer/chat/components/ChatInput';
import StatusActionButtons from '../components/StatusActionButtons';
import { getSellerStatusConfig, isChatDisabled } from '@core/booking/utils';

interface RouteParams {
  requestId: number;
  buyerId: number;
  mobileId?: number;
  mobileTitle?: string;
}

const SellerChatThreadScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId, buyerId, mobileId, mobileTitle } = route.params as RouteParams;
  const { userId } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Use generic booking hooks
  const { booking, loading, error, refresh, updateBooking } = useBookingThread<MobileEntity>({
    entityType: 'mobile',
    bookingId: requestId,
    contextId: mobileId || 0,
    enabled: !!mobileId,
  });

  const { sendMessage, sending } = useSendMessage<MobileEntity>('mobile');
  const messages = booking?.conversation || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Send message handler
  const handleSendMessage = async (message: string) => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to send messages');
      return;
    }

    try {
      console.log('[SELLER_SEND_MESSAGE] Sending message:', {
        requestId,
        senderUserId: userId,
        sellerId: booking?.sellerId,
        buyerId: booking?.buyerId,
        message: message.substring(0, 20),
      });

      // Auto-change status from PENDING to IN_NEGOTIATION when seller sends first message
      if (booking?.status === 'PENDING') {
        console.log('[SELLER_CHAT] Auto-changing status from PENDING to IN_NEGOTIATION');
        const mobileApi = createBookingApi('mobile');
        await mobileApi.updateStatus(requestId, 'IN_NEGOTIATION');
      }

      const updatedBooking = await sendMessage(requestId, userId, message);
      console.log('[SELLER_SEND_MESSAGE] Response received:', {
        conversationLength: updatedBooking.conversation?.length,
        lastMessage: updatedBooking.conversation?.[updatedBooking.conversation.length - 1],
      });
      updateBooking(updatedBooking); // Update state directly without reload
    } catch (err: any) {
      console.error('[SELLER_CHAT_THREAD] Error sending message:', err);
      Alert.alert('Failed to send', err?.message || 'Please try again');
      throw err;
    }
  };

  // Status updated handler
  const handleStatusUpdated = () => {
    refresh();
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#002F34" />
      </TouchableOpacity>

      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Buyer #{buyerId}</Text>
        <Text style={styles.headerSubtitle}>
          {mobileTitle || `Mobile Request #${booking?.entityId || requestId}`}
        </Text>
      </View>

      <TouchableOpacity style={styles.headerIconButton}>
        <Icon name="dots-vertical" size={24} color="#002F34" />
      </TouchableOpacity>
    </View>
  );

  // Render message item
  const renderMessage = ({ item }: { item: ConversationMessage }) => {
    // TEMPORARY FIX: Compare senderId with userId instead of relying on senderType
    // because backend returns wrong senderType
    const isCurrentUser = item.senderId === userId;

    console.log('[SELLER_RENDER_MESSAGE]', {
      message: item.message,
      senderType: item.senderType,
      senderId: item.senderId,
      myUserId: userId,
      isCurrentUser,
      comparison: `${item.senderId} === ${userId} = ${isCurrentUser}`,
    });
    return <MessageBubble message={item} isCurrentUser={isCurrentUser} />;
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="message-text-outline" size={64} color="#CBD5E1" />
      </View>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        Start the conversation with the buyer
      </Text>
    </View>
  );

  // Render error state
  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.errorIconContainer}>
        <Icon name="alert-circle-outline" size={64} color="#EF4444" />
      </View>
      <Text style={styles.emptyTitle}>Something went wrong</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Icon name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Render status badge
  const renderStatusBadge = () => {
    if (!booking) return null;

    const config = getSellerStatusConfig(booking.status);

    return (
      <View style={[styles.statusBanner, { backgroundColor: config.bgColor }]}>
        <Icon name={config.icon} size={16} color={config.color} />
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F5E87" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !booking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  const showInput = booking ? !isChatDisabled(booking.status) : false;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderStatusBadge()}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        contentContainerStyle={
          messages.length === 0 ? styles.emptyList : styles.messagesList
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0F5E87']}
            tintColor="#0F5E87"
          />
        }
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {booking && (
        <StatusActionButtons
          requestId={requestId}
          currentStatus={booking.status}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {showInput && <ChatInput onSend={handleSendMessage} disabled={!showInput} />}
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002F34',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerIconButton: {
    padding: 4,
    marginLeft: 12,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  messagesList: {
    paddingVertical: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
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
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
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
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SellerChatThreadScreen;
