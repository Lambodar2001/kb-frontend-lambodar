// src/features/buyer/home/components/MobileDetailFooter.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MobileDetailFooterProps {
  onChatPress: () => void;
  onMakeOfferPress: () => void;
}

const MobileDetailFooter: React.FC<MobileDetailFooterProps> = ({
  onChatPress,
  onMakeOfferPress,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
        <Icon name="message-text-outline" size={22} color="#0F5E87" />
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.offerButton} onPress={onMakeOfferPress}>
        <Icon name="cash-multiple" size={22} color="#FFFFFF" />
        <Text style={styles.offerButtonText}>Make Offer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F5E87',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
  },
  chatButtonText: {
    color: '#0F5E87',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  offerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5E87',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MobileDetailFooter;
