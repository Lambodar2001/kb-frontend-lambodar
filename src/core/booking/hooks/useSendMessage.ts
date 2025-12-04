import { useState, useCallback } from 'react';
import { Booking } from '../types/booking.types';
import { EntityType } from '../types/entity.types';
import { createBookingApi } from '../api/createBookingApi';

export interface UseSendMessageReturn<TEntity = any> {
  sendMessage: (bookingId: number, userId: number, message: string) => Promise<Booking<TEntity>>;
  sending: boolean;
  error: string | null;
}

export function useSendMessage<TEntity = any>(
  entityType: EntityType
): UseSendMessageReturn<TEntity> {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = createBookingApi<TEntity>(entityType);

  const sendMessage = useCallback(async (
    bookingId: number,
    userId: number,
    message: string
  ): Promise<Booking<TEntity>> => {
    setSending(true);
    setError(null);
    try {
      const updatedBooking = await api.sendMessage({
        bookingId,
        senderUserId: userId,
        message,
      });
      return updatedBooking;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  }, [entityType]);

  return {
    sendMessage,
    sending,
    error,
  };
}
