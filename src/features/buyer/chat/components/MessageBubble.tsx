// src/features/buyer/chat/components/MessageBubble.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConversationMessage, SenderType } from '../types';

interface MessageBubbleProps {
  message: ConversationMessage;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <View style={[styles.container, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
      {/* Avatar for other user */}
      {!isCurrentUser && (
        <View style={styles.avatar}>
          <Icon name="account-circle" size={32} color="#6B7280" />
        </View>
      )}

      <View style={[styles.bubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
        {/* Sender label for other user */}
        {!isCurrentUser && (
          <Text style={styles.senderLabel}>
            {message.senderName}
          </Text>
        )}

        {/* Message text */}
        <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>
          {message.message}
        </Text>

        {/* Timestamp */}
        <Text style={[styles.timestamp, isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {/* Avatar placeholder for current user to maintain alignment */}
      {isCurrentUser && <View style={styles.avatarPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 8,
    marginTop: 4,
  },
  avatarPlaceholder: {
    width: 32,
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: '#0F5E87',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#0F172A',
  },
  timestamp: {
    fontSize: 10,
    fontWeight: '500',
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherUserTimestamp: {
    color: '#9CA3AF',
    textAlign: 'left',
  },
});

export default MessageBubble;
