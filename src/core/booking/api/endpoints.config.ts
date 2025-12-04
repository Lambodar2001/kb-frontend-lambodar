import { EntityType } from '../types/entity.types';

export interface EndpointConfig {
  createBooking: string;
  getBuyerBookings: (buyerId: number) => string;
  getBookingById: (bookingId: number) => string;
  getEntityBookings: (entityId: number) => string;
  getPendingBookings: string;
  sendMessage: (bookingId: number) => string;
  updateStatus: (bookingId: number) => string;
  acceptBooking: (bookingId: number) => string;
  rejectBooking: (bookingId: number) => string;
  approveBooking: (bookingId: number) => string;
}

const ENDPOINT_CONFIGS: Record<EntityType, EndpointConfig> = {
  // ========================================
  // MOBILE BOOKING BLOCK
  // ========================================
  mobile: {
    createBooking: '/api/v1/mobile/requests/create',
    getBuyerBookings: (buyerId) => `/api/v1/mobile/requests/buyer/${buyerId}`,
    getBookingById: (bookingId) => `/api/v1/mobile/requests/${bookingId}`,
    getEntityBookings: (mobileId) => `/api/v1/mobile/requests/${mobileId}`,
    getPendingBookings: '/api/v1/mobile/requests/pending',
    sendMessage: (bookingId) => `/api/v1/mobile/requests/${bookingId}/message`,
    updateStatus: (bookingId) => `/api/v1/mobile/requests/${bookingId}/status`,
    acceptBooking: (bookingId) => `/api/v1/mobile/requests/${bookingId}/accept`,
    rejectBooking: (bookingId) => `/api/v1/mobile/requests/${bookingId}/reject`,
    approveBooking: (bookingId) => `/api/v1/mobile/requests/${bookingId}/complete`,
  },

  // Future: Add car, bike, laptop endpoints here
};

export function getEndpointConfig(entityType: EntityType): EndpointConfig {
  return ENDPOINT_CONFIGS[entityType];
}
