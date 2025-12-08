// src/features/seller/chat/components/BuyerRequestCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Booking } from '@core/booking/types/booking.types';
import { getSellerStatusConfig } from '@core/booking/utils';

interface BuyerRequestCardProps {
  request: Booking;
  onPress: () => void;
}

const BuyerRequestCard: React.FC<BuyerRequestCardProps> = ({ request, onPress }) => {
  // Get the last message from conversation
  const lastMessage =
    request.conversation && request.conversation.length > 0
      ? request.conversation[request.conversation.length - 1]
      : null;

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const statusConfig = getSellerStatusConfig(request.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Buyer Avatar */}
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={48} color="#0F5E87" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header: Buyer Name and Time */}
          <View style={styles.header}>
            <Text style={styles.buyerName}>{request.buyerName || `Buyer #${request.buyerId}`}</Text>
            <Text style={styles.time}>
              {lastMessage ? formatTime(lastMessage.timestamp) : formatTime(request.createdAt)}
            </Text>
          </View>

          {/* Last Message */}
          <View style={styles.messageContainer}>
            {lastMessage && (
              <Text style={styles.message} numberOfLines={2}>
                {lastMessage.senderType === 'BUYER' ? '' : 'You: '}
                {lastMessage.message}
              </Text>
            )}
          </View>

          {/* Footer: Status Badge and Message Count */}
          <View style={styles.footer}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <Icon name={statusConfig.icon} size={12} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>

            {request.conversation && request.conversation.length > 0 && (
              <View style={styles.messageCount}>
                <Icon name="message-text" size={12} color="#6B7280" />
                <Text style={styles.messageCountText}>
                  {request.conversation.length} {request.conversation.length === 1 ? 'msg' : 'msgs'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Chevron */}
        <Icon name="chevron-right" size={24} color="#9CA3AF" style={styles.chevron} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002F34',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  messageCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messageCountText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 76, // 16 (padding) + 48 (avatar) + 12 (margin)
  },
});

export default BuyerRequestCard;
