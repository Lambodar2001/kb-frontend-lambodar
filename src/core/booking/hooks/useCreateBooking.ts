import { useState, useCallback } from 'react';
import { Booking, CreateBookingRequest } from '../types/booking.types';
import { EntityType } from '../types/entity.types';
import { createBookingApi } from '../api/createBookingApi';

export interface UseCreateBookingReturn<TEntity = any> {
  createBooking: (entityId: number, buyerUserId: number, message: string) => Promise<Booking<TEntity>>;
  loading: boolean;
  error: string | null;
}

export function useCreateBooking<TEntity = any>(
  entityType: EntityType
): UseCreateBookingReturn<TEntity> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = createBookingApi<TEntity>(entityType);

  const createBooking = useCallback(async (
    entityId: number,
    buyerUserId: number,
    message: string
  ): Promise<Booking<TEntity>> => {
    setLoading(true);
    setError(null);
    try {
      const request: CreateBookingRequest = {
        entityId,
        entityType,
        buyerUserId,
        message,
      };
      const booking = await api.createBooking(request);
      return booking;
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  return {
    createBooking,
    loading,
    error,
  };
}
