import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types/booking.types';
import { EntityType } from '../types/entity.types';
import { createBookingApi } from '../api/createBookingApi';

export interface UseBookingThreadOptions {
  entityType: EntityType;
  bookingId: number;
  contextId: number;
  enabled?: boolean;
}

export interface UseBookingThreadReturn<TEntity = any> {
  booking: Booking<TEntity> | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateBooking: (updatedBooking: Booking<TEntity>) => void;
}

export function useBookingThread<TEntity = any>(
  options: UseBookingThreadOptions
): UseBookingThreadReturn<TEntity> {
  const { entityType, bookingId, contextId, enabled = true } = options;
  const [booking, setBooking] = useState<Booking<TEntity> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = createBookingApi<TEntity>(entityType);

  const loadBooking = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getBookingById(bookingId, contextId);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking');
      console.error(`[useBookingThread:${entityType}]`, err);
    } finally {
      setLoading(false);
    }
  }, [entityType, bookingId, contextId, enabled]);

  const updateBooking = useCallback((updatedBooking: Booking<TEntity>) => {
    setBooking(updatedBooking);
  }, []);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  return {
    booking,
    loading,
    error,
    refresh: loadBooking,
    updateBooking,
  };
}
