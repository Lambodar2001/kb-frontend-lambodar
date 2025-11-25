// src/features/buyer/chat/types/index.ts

export type RequestStatus = 'PENDING' | 'IN_NEGOTIATION' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export type SenderType = 'BUYER' | 'SELLER';

export interface ConversationMessage {
  senderId: number;
  senderType: SenderType;
  message: string;
  timestamp: string;
}

export interface ChatRequest {
  requestId: number;
  mobileId: number;
  buyerId: number;
  sellerId: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string | null;
  conversation: ConversationMessage[];
}

export interface ChatRequestWithMobileDetails extends ChatRequest {
  mobileTitle?: string;
  mobileImage?: string;
  mobilePrice?: number;
}
