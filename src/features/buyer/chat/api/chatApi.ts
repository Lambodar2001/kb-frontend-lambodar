// src/features/buyer/chat/api/chatApi.ts

import api from '@shared/api/client';
import { ChatRequest } from '../types';

const CHAT_API_BASE = '/api/v1/mobile/requests';

/**
 * Get all chat requests for a buyer
 * @param buyerId - The ID of the buyer
 * @returns Promise with array of chat requests
 */
export const getBuyerChatRequests = async (buyerId: number): Promise<ChatRequest[]> => {
  try {
    const response = await api.get<ChatRequest[]>(`${CHAT_API_BASE}/buyer/${buyerId}`);
    return response.data;
  } catch (error) {
    console.error('[CHAT_API] Failed to fetch buyer chat requests:', error);
    throw error;
  }
};

/**
 * Get a specific chat request by ID
 * @param requestId - The ID of the request
 * @param buyerId - The ID of the buyer (to fetch from correct endpoint)
 * @returns Promise with chat request details
 */
export const getChatRequestById = async (requestId: number, buyerId: number): Promise<ChatRequest> => {
  try {
    // Backend doesn't have GET /requests/{requestId} endpoint
    // Instead, we fetch all buyer's requests and find the specific one
    console.log('[CHAT_API] Fetching request', requestId, 'for buyer', buyerId);
    const response = await api.get<ChatRequest[]>(`${CHAT_API_BASE}/buyer/${buyerId}`);
    const allRequests = response.data;
    console.log('[CHAT_API] Received', allRequests.length, 'total requests');

    // Find the specific request
    const request = allRequests.find(req => req.requestId === requestId);

    if (!request) {
      console.error('[CHAT_API] Request not found:', requestId, 'in', allRequests.map(r => r.requestId));
      throw new Error(`Request with ID ${requestId} not found`);
    }

    console.log('[CHAT_API] Found request:', request);
    console.log('[CHAT_API] Conversation has', request.conversation?.length || 0, 'messages');
    return request;
  } catch (error) {
    console.error('[CHAT_API] Failed to fetch chat request:', error);
    throw error;
  }
};

/**
 * Create a new chat request
 * @param mobileId - The ID of the mobile listing
 * @param buyerUserId - The user ID of the buyer
 * @param message - Initial message to seller
 * @returns Promise with created chat request
 */
export const createChatRequest = async (
  mobileId: number,
  buyerUserId: number,
  message: string
): Promise<ChatRequest> => {
  try {
    const response = await api.post<ChatRequest>(`${CHAT_API_BASE}/create`, {
      mobileId,
      buyerUserId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error('[CHAT_API] Failed to create chat request:', error);
    throw error;
  }
};

/**
 * Send a message in a chat request
 * @param requestId - The ID of the request
 * @param senderUserId - The user ID of the sender
 * @param message - The message to send
 * @returns Promise with updated chat request
 */
export const sendChatMessage = async (
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
    console.error('[CHAT_API] Failed to send message:', error);
    throw error;
  }
};
