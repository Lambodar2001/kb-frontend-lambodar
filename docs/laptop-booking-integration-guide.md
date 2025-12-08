# Laptop Booking Integration Guide

## Overview
This guide helps integrate laptop booking flow based on the mobile booking architecture.

## Architecture Summary

### 1. Entity-Based Booking System
- **Core Location**: `src/core/booking/`
- **Pattern**: Unified API for all entity types (mobile, car, laptop, bike)
- **Flow**: Buyer browses → Creates booking → Chat → Seller accepts/rejects → Status updates

---

## Step-by-Step Integration

### Step 1: Add Laptop Entity Type
**File**: `src/core/booking/types/entity.types.ts`

```typescript
// Line 1: Add 'laptop' to EntityType
export type EntityType = 'mobile' | 'car' | 'laptop';

// Add after CarEntity interface:
export interface LaptopEntity extends BookableEntity {
  laptopId: number;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  condition: string;
  year: number;
  description: string;
  isNegotiable: boolean;
  images: string[];
  userId: number;
}
```

### Step 2: Configure API Endpoints
**File**: `src/core/booking/api/endpoints.config.ts`

Add laptop endpoints object in `ENDPOINT_CONFIGS`:

```typescript
laptop: {
  createBooking: '/api/v1/laptop/requests/create',
  getBuyerBookings: (buyerId) => `/api/v1/laptop/requests/buyer/${buyerId}`,
  getBookingById: (bookingId) => `/api/v1/laptop/requests/${bookingId}`,
  getEntityBookings: (laptopId) => `/api/v1/laptop/requests/${laptopId}`,
  getPendingBookings: '/api/v1/laptop/requests/pending',
  sendMessage: (bookingId) => `/api/v1/laptop/requests/${bookingId}/message`,
  updateStatus: (bookingId) => `/api/v1/laptop/requests/${bookingId}/status`,
  acceptBooking: (bookingId) => `/api/v1/laptop/requests/${bookingId}/accept`,
  rejectBooking: (bookingId) => `/api/v1/laptop/requests/${bookingId}/reject`,
  approveBooking: (bookingId) => `/api/v1/laptop/requests/${bookingId}/complete`,
},
```

### Step 3: Update Booking API Payload
**File**: `src/core/booking/api/createBookingApi.ts`

Add laptop block after car block:

```typescript
// In createBooking function (after line 38):
if (entityType === 'laptop') {
  payload = {
    laptopId: request.entityId,
    buyerUserId: request.buyerUserId,
    message: request.message,
  };
}

// In normalizeBooking function (line 136):
entityId: data.mobileId || data.carId || data.laptopId,

// Line 147:
entityData: data.mobile || data.car || data.laptop,
```

### Step 4: Create Entity Configuration
**File**: `src/features/buyer/browse/config/entityTypes.ts` (or similar)

```typescript
export const laptopConfig: EntityConfig<LaptopEntity> = {
  type: 'laptop',
  displayName: 'Laptop',
  icon: 'laptop',
  color: '#8B5CF6',
  apiEndpoint: '/api/v1/laptops',
  detailFields: [
    { key: 'brand', label: 'Brand', icon: 'tag' },
    { key: 'processor', label: 'Processor', icon: 'chip' },
    { key: 'ram', label: 'RAM', icon: 'memory' },
    { key: 'storage', label: 'Storage', icon: 'harddisk' },
    { key: 'condition', label: 'Condition', icon: 'star' },
    { key: 'year', label: 'Year', icon: 'calendar' },
  ],
};
```

---

## Key Flows

### Buyer Flow
1. **Browse**: `CatalogListScreen` → shows laptop list
2. **View Details**: `CatalogDetailScreen` → shows laptop details
3. **Initiate Chat**: Click "Chat" → `ChatRequestModal` opens
4. **Create Booking**: Submit message → calls `useCreateBooking('laptop')`
5. **Navigate to Chat**: Auto-navigates to `BuyerChatThreadScreen`
6. **Chat Thread**: Uses `useBookingThread` hook

### Seller Flow
1. **Pending Requests**: `useBookingList('laptop')` → gets pending bookings
2. **View Chat**: Click request → `SellerChatThreadScreen`
3. **Accept/Reject**: Call `bookingApi.acceptBooking()` or `rejectBooking()`
4. **Chat**: Uses same thread hooks
5. **Complete**: Call `bookingApi.approveBooking()`

### Status Lifecycle
```
PENDING → ACCEPTED → IN_PROGRESS → COMPLETED
         ↓
       REJECTED
```

---

## Code Locations

### Core Booking (Reusable)
- `src/core/booking/api/createBookingApi.ts` - Main API adapter
- `src/core/booking/api/endpoints.config.ts` - Endpoint config
- `src/core/booking/types/` - Type definitions
- `src/core/booking/hooks/useCreateBooking.ts` - Create booking hook
- `src/core/booking/hooks/useBookingThread.ts` - Chat thread hook
- `src/core/booking/hooks/useBookingList.ts` - List bookings hook

### Feature UI
- `src/features/buyer/browse/screens/CatalogDetailScreen.tsx` - Detail view (reusable)
- `src/features/buyer/chat/screens/BuyerChatThreadScreen.tsx` - Buyer chat
- `src/features/seller/chat/screens/SellerChatThreadScreen.tsx` - Seller chat

---

## Usage Example

### Buyer Screen
```tsx
import { useCreateBooking } from '@core/booking/hooks/useCreateBooking';

const { createBooking, loading } = useCreateBooking<LaptopEntity>('laptop');

const handleChat = async (message: string) => {
  const booking = await createBooking(laptopId, buyerId, message);
  navigation.navigate('BuyerChatThread', {
    requestId: booking.bookingId
  });
};
```

### Seller Screen
```tsx
import { useBookingList } from '@core/booking/hooks/useBookingList';

const { bookings, loading } = useBookingList<LaptopEntity>('laptop', sellerId);
```

---

## Backend Requirements

Ensure backend implements these endpoints:
- `POST /api/v1/laptop/requests/create` - Create booking
- `GET /api/v1/laptop/requests/buyer/:buyerId` - Buyer bookings
- `GET /api/v1/laptop/requests/:laptopId` - Entity bookings (seller)
- `GET /api/v1/laptop/requests/pending` - Pending requests
- `POST /api/v1/laptop/requests/:id/message` - Send message
- `PATCH /api/v1/laptop/requests/:id/accept` - Accept booking
- `PATCH /api/v1/laptop/requests/:id/reject` - Reject booking
- `POST /api/v1/laptop/requests/:id/complete` - Complete booking

---

## Testing Checklist

- [ ] Add laptop entity type
- [ ] Configure endpoints
- [ ] Update API payload logic
- [ ] Create entity configuration
- [ ] Test buyer browse flow
- [ ] Test booking creation
- [ ] Test chat functionality
- [ ] Test seller accept/reject
- [ ] Test status updates
- [ ] Verify backend integration

---

## Notes

- **Reusability**: Core booking logic handles all entities
- **Pattern**: Add new entity blocks in existing files
- **ID Mapping**: Backend returns different ID fields (mobileId, carId, laptopId) - normalized to `entityId`
- **User IDs**: Mobile uses `userId`, Car uses `buyerId` - check entity config for correct field
- **Status Management**: Centralized in `src/core/booking/utils/bookingStatus.utils.ts`
