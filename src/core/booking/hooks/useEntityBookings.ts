import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types/booking.types';
import { EntityType } from '../types/entity.types';
import { createBookingApi } from '../api/createBookingApi';

export interface UseEntityBookingsOptions {
  entityType: EntityType;
  entityId: number;
  enabled?: boolean;
}

export interface UseEntityBookingsReturn<TEntity = any> {
  bookings: Booking<TEntity>[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEntityBookings<TEntity = any>(
  options: UseEntityBookingsOptions
): UseEntityBookingsReturn<TEntity> {
  const { entityType, entityId, enabled = true } = options;
  const [bookings, setBookings] = useState<Booking<TEntity>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = createBookingApi<TEntity>(entityType);

  const loadBookings = useCallback(async () => {
    if (!enabled || !entityId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getEntityBookings(entityId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
      console.error(`[useEntityBookings:${entityType}]`, err);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, enabled]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return {
    bookings,
    loading,
    error,
    refresh: loadBookings,
  };
}
