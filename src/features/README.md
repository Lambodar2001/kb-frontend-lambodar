# Features Folder Structure

This folder contains all feature-based modules organized by role.

## Structure

### `auth/`
Authentication features (Login, Signup)
- Used by: ALL users

### `buyer/`
Buyer-specific features
- `browse/` - Browse and search products
- `favorites/` - Wishlist management
- `orders/` - Order history
- `chat/` - Buyer chat features
- `bidding/` - Live bidding

### `seller/`
Seller-specific features
- `listings/` - MyAds management (view, edit, delete)
- `sell/` - Sell product flow (add new listings)
- `update/` - Update existing listings

### `shared/`
Features used by both buyers and sellers
- `details/` - Product details view
- `chat/` - Chat functionality
- `profile/` - User profile

## How to Use

Each feature folder contains:
- `screens/` - React Native screen components
- `hooks/` - Custom hooks for business logic
- `components/` - Feature-specific components
- `api/` - API calls (where applicable)
- `types/` - TypeScript types (where applicable)

## Current Status

Seller features: ACTIVE (fully implemented)
Buyer features: READY (folders created, awaiting backend APIs)
Shared features: ACTIVE (used by both roles)



1. Buyer browses → MobileListingScreen → API: GET /api/v1/mobiles/getAllMobiles
2. Buyer views details → MobileDetailScreen → API: GET /api/v1/mobiles/{mobileId}
3. Buyer requests/chats → ChatRequestModal → API: POST /api/v1/mobile/requests/create
4. Seller sees requests → SellerRequestListScreen → API: GET /api/v1/mobile/requests/{mobileId}
5. Seller messages → SellerChatThreadScreen → API: POST /api/v1/mobile/requests/{requestId}/message
6. Seller changes status → StatusActionButtons → API: PATCH /api/v1/mobile/requests/{requestId}/status
7. Seller completes deal → API: POST /api/v1/mobile/requests/{requestId}/complete

File Tree (Key Files):

src/
├── features/
│   ├── buyer/
│   │   ├── browse/
│   │   │   ├── screens/
│   │   │   │   ├── MobileListingScreen.tsx
│   │   │   │   └── MobileDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── MobileCard.tsx
│   │   │   │   └── MobileDetailFooter.tsx
│   │   │   └── api/mobilesApi.ts
│   │   └── chat/
│   │       ├── screens/
│   │       │   ├── BuyerChatListScreen.tsx
│   │       │   └── BuyerChatThreadScreen.tsx
│   │       ├── components/
│   │       │   ├── ChatRequestModal.tsx
│   │       │   ├── ChatRequestCard.tsx
│   │       │   ├── MessageBubble.tsx
│   │       │   └── ChatInput.tsx
│   │       └── api/chatApi.ts
│   │
│   └── seller/
│       ├── chat/
│       │   ├── screens/
│       │   │   ├── SellerRequestListScreen.tsx
│       │   │   └── SellerChatThreadScreen.tsx
│       │   ├── components/
│       │   │   ├── BuyerRequestCard.tsx
│       │   │   └── StatusActionButtons.tsx
│       │   └── api/chatApi.ts
│       └── listings/screens/mobile/
│           └── MyMobilesAdsListScreen.tsx
│
└── shared/
├── api/client.ts
└── utils/chatStatus.ts