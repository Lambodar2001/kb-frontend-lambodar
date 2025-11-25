// src/features/buyer/chat/components/ChatRequestCard.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatRequest, RequestStatus } from '../types';
import { getBuyerStatusConfig } from '@shared/utils/chatStatus';

interface ChatRequestCardProps {
  request: ChatRequest;
  onPress: () => void;
  mobileTitle?: string;
  mobileImage?: string;
  mobilePrice?: number;
}

const ChatRequestCard: React.FC<ChatRequestCardProps> = ({
  request,
  onPress,
  mobileTitle = 'Mobile Device',
  mobileImage,
  mobilePrice,
}) => {
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

  const statusConfig = getBuyerStatusConfig(request.status);
  const imageUrl = mobileImage || 'https://via.placeholder.com/80x80?text=No+Image';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Mobile Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header: Title and Time */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {mobileTitle}
            </Text>
            <Text style={styles.time}>
              {lastMessage ? formatTime(lastMessage.timestamp) : formatTime(request.createdAt)}
            </Text>
          </View>

          {/* Price */}
          {mobilePrice !== undefined && (
            <Text style={styles.price}>₹ {mobilePrice.toLocaleString('en-IN')}</Text>
          )}

          {/* Last Message */}
          <View style={styles.messageContainer}>
            {lastMessage && (
              <>
                {lastMessage.senderType === 'BUYER' && (
                  <Icon name="account" size={14} color="#6B7280" style={styles.messageIcon} />
                )}
                <Text style={styles.message} numberOfLines={1}>
                  {lastMessage.senderType === 'BUYER' ? 'You: ' : ''}
                  {lastMessage.message}
                </Text>
              </>
            )}
          </View>

          {/* Status Badge */}
          <View style={styles.footer}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>

            {/* Unread Indicator (future enhancement) */}
            {/* You can add unread count here when backend supports it */}
          </View>
        </View>
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
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#002F34',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002F34',
    marginBottom: 6,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageIcon: {
    marginRight: 4,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 108, // 16 (padding) + 80 (image) + 12 (margin)
  },
});

export default ChatRequestCard;
