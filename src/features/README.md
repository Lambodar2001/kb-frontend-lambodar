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
