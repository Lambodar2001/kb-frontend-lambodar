// src/features/seller/chat/api/chatApi.ts

import api from '@shared/api/client';
import { ChatRequest } from '../types';

const CHAT_API_BASE = '/api/v1/mobile/requests';

/**
 * Get all chat requests for a specific mobile (seller view)
 * @param mobileId - The ID of the mobile listing
 * @returns Promise with array of chat requests for that mobile
 */
export const getMobileRequests = async (mobileId: number): Promise<ChatRequest[]> => {
  try {
    const response = await api.get<ChatRequest[]>(`${CHAT_API_BASE}/${mobileId}`);
    return response.data;
  } catch (error) {
    console.error('[SELLER_CHAT_API] Failed to fetch mobile requests:', error);
    throw error;
  }
};

/**
 * Get a specific chat request by ID
 * @param requestId - The ID of the request
 * @param mobileId - The ID of the mobile (to fetch from correct endpoint)
 * @returns Promise with chat request details
 */
export const getChatRequestById = async (requestId: number, mobileId: number): Promise<ChatRequest> => {
  try {
    // Backend doesn't have GET /requests/{requestId} endpoint
    // Instead, we fetch all requests for the mobile and find the specific one
    console.log('[SELLER_CHAT_API] Fetching request', requestId, 'for mobile', mobileId);
    const response = await api.get<ChatRequest[]>(`${CHAT_API_BASE}/${mobileId}`);
    const allRequests = response.data;
    console.log('[SELLER_CHAT_API] Received', allRequests.length, 'total requests');

    // Find the specific request
    const request = allRequests.find(req => req.requestId === requestId);

    if (!request) {
      console.error('[SELLER_CHAT_API] Request not found:', requestId, 'in', allRequests.map(r => r.requestId));
      throw new Error(`Request with ID ${requestId} not found`);
    }

    console.log('[SELLER_CHAT_API] Found request:', request);
    console.log('[SELLER_CHAT_API] Conversation has', request.conversation?.length || 0, 'messages');
    return request;
  } catch (error) {
    console.error('[SELLER_CHAT_API] Failed to fetch chat request:', error);
    throw error;
  }
};

/**
 * Send a message in a chat request (seller)
 * @param requestId - The ID of the request
 * @param senderUserId - The user ID of the seller
 * @param message - The message to send
 * @returns Promise with updated chat request
 */
export const sendSellerMessage = async (
  requestId: number,
  senderUserId: number,
  message: string
): Promise<ChatRequest> => {
  try {
    const formData = new FormData();
    formData.append('senderUserId', senderUserId.toString());
    formData.append('message', message);

    const response = await api.post<ChatRequest>(
      `${CHAT_API_BASE}/${requestId}/message`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('[SELLER_CHAT_API] Failed to send message:', error);
    throw error;
  }
};

/**
 * Update request status
 * @param requestId - The ID of the request
 * @param status - New status
 * @returns Promise with updated chat request
 */
export const updateRequestStatus = async (
  requestId: number,
  status: 'IN_NEGOTIATION' | 'ACCEPTED' | 'REJECTED'
): Promise<ChatRequest> => {
  try {
    const response = await api.patch<ChatRequest>(
      `${CHAT_API_BASE}/${requestId}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  } catch (error) {
    console.error('[SELLER_CHAT_API] Failed to update status:', error);
    throw error;
  }
};

/**
 * Complete a deal
 * @param requestId - The ID of the request
 * @returns Promise with completed chat request
 */
export const completeDeal = async (requestId: number): Promise<ChatRequest> => {
  try {
    const response = await api.post<ChatRequest>(`${CHAT_API_BASE}/${requestId}/complete`);
    return response.data;
  } catch (error) {
    console.error('[SELLER_CHAT_API] Failed to complete deal:', error);
    throw error;
  }
};
