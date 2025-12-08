import { EntityType } from './entity.types';

export type BookingStatus =
  | 'PENDING'
  | 'IN_NEGOTIATION'
  | 'CONFIRMED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'SOLD';

export type SenderType = 'BUYER' | 'SELLER';

export interface BookingMessage {
  senderId: number;
  senderType: SenderType;
  message: string;
  timestamp: string;
  senderName: string;
}

export interface Booking<TEntity = any> {
  bookingId: number;
  requestId?: number;
  entityId: number;
  entityType: EntityType;
  buyerId: number;
  sellerId: number;
  buyerName: string;
  sellerName: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string | null;
  conversation: BookingMessage[];
  messageCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  entityData?: TEntity;
}

export interface CreateBookingRequest {
  entityId: number;
  entityType: EntityType;
  buyerUserId: number;
  message: string;
}

export interface SendMessageRequest {
  bookingId: number;
  senderUserId: number;
  message: string;
}
