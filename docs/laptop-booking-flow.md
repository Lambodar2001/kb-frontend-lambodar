# Laptop Booking Flow Integration Guide

This note reverse-engineers the existing **mobile** booking + chat experience so that a new contributor can mirror it for laptops without hunting through the codebase. All file paths below are workspace-relative.

---

## 1. Core Booking Architecture

The booking system lives under `src/core/booking` and is intentionally entity-agnostic. Each concrete entity (mobile today) only customizes payloads and endpoints.

### Types (`types/`)
- `booking.types.ts` defines the shared `Booking`, `BookingMessage`, and status enum.
- `entity.types.ts` contains the `EntityType` union (currently `'mobile' | 'car'`) and the typed structures for each entity (`MobileEntity`, `CarEntity`, …). This union gates every hook/API, so laptop support starts here by adding `'laptop'` plus a `LaptopEntity` interface that mirrors the mobile shape.

### API Adapter (`api/`)
- `createBookingApi.ts` builds a `BookingApiAdapter` for the requested entity type. It wires the following methods: `createBooking`, `getBuyerBookings`, `getEntityBookings`, `getBookingById`, `sendMessage`, `updateStatus`, `acceptBooking`, `rejectBooking`, and `approveBooking`.
- The file already contains **MOBILE BOOKING BLOCK** comments that show where payloads, fetch logic, and `normalizeBooking()` are specialized. Laptop integration means cloning the mobile branch:
  1. Add a `laptop` entry to `endpoints.config.ts` that points to laptop booking routes.
  2. Extend the `if (entityType === 'mobile')` payload builder with a `else if (entityType === 'laptop')` branch that sends `laptopId`, etc.
  3. Mirror the `getBookingById` fallback strategy if the backend behaves the same (seller context uses entity bookings, buyer context uses buyer bookings).
  4. Teach `normalizeBooking()` how to read laptop ids/data (`data.laptopId`, `data.laptop`).
- `BookingApiAdapter.ts` simply describes the shape every adapter implements, so no extra work is needed once `createBookingApi()` knows about laptops.

### Hooks (`hooks/`)
All UI flows reuse these hooks regardless of entity type:
- `useCreateBooking(entityType)` – wraps `createBookingApi().createBooking()`. Buyers pass `{ entityId, buyerUserId, message }` and get back a normalized `Booking`.
- `useBookingList({ entityType, buyerId })` – fetches all bookings for a buyer. Buyer chat lists use this.
- `useEntityBookings({ entityType, entityId })` – sellers use this to load requests per listing.
- `useBookingThread({ entityType, bookingId, contextId })` – fetches a single booking thread. On the buyer side `contextId` is the buyerId; on the seller side it is the entityId so that `getBookingById` can reuse entity bookings.
- `useSendMessage(entityType)` – wraps `BookingApiAdapter.sendMessage`. Messages are multipart form posts for mobile; keep the same behavior for laptops unless backend differs.

Because these hooks only need a different `EntityType`, once `'laptop'` is added everywhere the UI screens can opt-in by passing `entityType="laptop"`.

### Utilities (`utils/bookingStatus.utils.ts`)
Maps booking status → labels/colors + shared `isChatDisabled` helper. No entity-specific logic here; laptop screens reuse the same helpers.

---

## 2. Mobile Buyer Flow (reference implementation)

1. **Entry point – product details**
   - `src/features/buyer/browse/screens/CatalogDetailScreen.tsx` renders any entity detail view via config.
   - The screen injects `config.type` into `useCreateBooking` (`line ~52`) and `handleChatPress` opens `ChatRequestModal`.
   - On submit (`handleChatSubmit`, line ~109) it calls `createBooking(entityId, bookingUserId, message)`. For mobile, `bookingUserId` is `userId` (seller uses same id structure); cars use `buyerId`.
   - Successful creation navigates to the chat tab (`navigation.navigate('Chat', { screen: 'BuyerChatThread', params: { requestId } })`).

2. **Chat tab overview**
   - `BuyerTabNavigator.tsx` declares a nested stack for chats (screens: `BuyerChatsScreen` → `BuyerChatListScreen` → `BuyerChatThreadScreen`).
   - `BuyerChatsScreen.tsx` shows entity categories. Currently only the `mobile` category is enabled.
     - Laptop enablement means adding `enabled: true` for the laptop card and ensuring the icon/text point to `'laptop'`.

3. **Chat list**
   - `BuyerChatListScreen.tsx` receives `{ entityType, entityName }` via route params. It calls `useBookingList<MobileEntity>({ entityType, buyerId, enabled: !!buyerId })`.
   - Bookings are sorted/filter by status and rendered via `ChatRequestCard`.
   - On press it navigates to `BuyerChatThread` with `requestId`, `mobileTitle`, and `sellerId`.
   - To support laptop chats, reuse this screen as-is – it already treats `entityType` dynamically. The only change is to pass `entityName='Laptop'` from the category entry, and optionally supply better titles/images once laptop data is available in `booking.entityData`.

4. **Chat thread**
   - `BuyerChatThreadScreen.tsx` hardcodes `entityType: 'mobile'` when calling `useBookingThread` and `useSendMessage`.
   - It pulls message history from `booking.conversation` and posts via `sendMessage(requestId, userId, message)`.
   - Follow-up actions (status banner, chat disable rules) read from `@core/booking/utils`.
   - Laptop support requires only making the entity type configurable (read from params or derive from booking). Once the hooks accept `'laptop'`, the UI plumbing is identical.

---

## 3. Mobile Seller Flow (reference implementation)

1. **Navigation**
   - `SellerTabNavigator.tsx` routes sellers to `MyAdsEntryStack` for listing management.
   - `MyMobileAdsStack.tsx` adds the booking-related screens: `SellerRequestListScreen` and `SellerChatThreadScreen`.
   - Each Mobile card in `MyMobilesAdsListScreen.tsx` surfaces an “Chat Requests” button that navigates to `SellerRequestList` with `{ mobileId, mobileTitle }`.

2. **Requests per listing**
   - `SellerRequestListScreen.tsx` calls `useEntityBookings<MobileEntity>({ entityType: 'mobile', entityId: mobileId })` to show every booking tied to that mobile.
   - The list renders `BuyerRequestCard`, which shows latest message snippet + status badge via `getSellerStatusConfig`.
   - Selecting a card pushes `SellerChatThreadScreen`.

3. **Seller chat thread**
   - `SellerChatThreadScreen.tsx` mirrors the buyer screen but passes `contextId: mobileId` to `useBookingThread`.
   - Sellers can update the request status via `StatusActionButtons`:
     - Accept/reject → `mobileApi.updateStatus(requestId, newStatus)`
     - Complete deal → `mobileApi.approveBooking`
   - When the seller sends the first reply while the status is `PENDING`, it auto-updates the status to `IN_NEGOTIATION`.
   - Messages reuse the buyer `MessageBubble` + `ChatInput` components.

4. **Status controls**
   - `StatusActionButtons.tsx` constructs a `createBookingApi('mobile')` adapter inside the component and calls update methods.
   - Laptop requests can share this component once the adapter accepts `'laptop'`. Alternatively, extract a prop for `entityType` if laptop needs a different API.

---

## 4. Data / API Flow Recap

```text
Buyer taps "Chat with seller" (CatalogDetailScreen)
   ↳ useCreateBooking('mobile') → createBookingApi('mobile').createBooking()
       ↳ POST /api/v1/mobile/requests/create (payload includes mobileId + buyerUserId + message)
       ↳ Response normalized via normalizeBooking()
   ↳ Navigation opens BuyerChatThreadScreen (requestId)

Buyer/Seller chat screens
   ↳ useBookingThread('mobile', bookingId, contextId)
       ↳ Attempts to reuse entity bookings (seller) before buyer bookings (buyer)
   ↳ Messages shown via booking.conversation
   ↳ useSendMessage('mobile') → POST /api/v1/mobile/requests/{id}/message (multipart)
   ↳ Status banner uses getBuyerStatusConfig / getSellerStatusConfig

List screens
   ↳ Buyers: useBookingList('mobile', buyerId) → GET /api/v1/mobile/requests/buyer/{buyerId}
   ↳ Sellers: useEntityBookings('mobile', mobileId) → GET /api/v1/mobile/requests/{mobileId}
```

Everything above relies on `useAuth()` to expose `userId`, `buyerId`, and `sellerId`.

---

## 5. Laptop Booking Enablement Checklist

Follow the same layering order as the mobile flow. None of these steps require touching existing mobile screens; you can extend components to accept `entityType` props where needed.

### Core (`src/core/booking`)
1. **Types**
   - Add `'laptop'` to `EntityType` (and extend any union used elsewhere, such as `EntityRegistry`).
   - Create a `LaptopEntity` interface mirroring relevant laptop fields (reference `LaptopDetailsForm` or `/features/seller/listings/components listing` for fields).

2. **API**
   - In `endpoints.config.ts`, add a full `laptop` block pointing to laptop booking endpoints (`/api/v1/laptop/requests/...` or whatever backend exposes).
   - Update `createBookingApi.ts`:
     - Extend the payload builder inside `createBooking` for laptops.
     - Ensure `getBookingById` handles laptop context (seller context should call `getEntityBookings(laptopId)` first).
     - Update `sendMessage` if laptop endpoints require different headers; otherwise reuse the FormData pattern.
     - Update `normalizeBooking` so `entityId` falls back to `data.laptopId` and `entityData` uses `data.laptop`.

3. **Hooks**
   - Hooks already accept a dynamic `EntityType`. Once the union includes `'laptop'`, TypeScript will allow `useCreateBooking<'laptop'>()`, etc.

### Buyer experience
1. **Enable laptop category** – in `BuyerChatsScreen.tsx`, add a laptop entry to `CHAT_CATEGORIES` (copy mobile, set icon/emoji, `enabled: true`).
2. **Thread screen flexibility** – teach `BuyerChatThreadScreen.tsx` to read `entityType` from route params so it can call `useBookingThread({ entityType, ... })` and `useSendMessage(entityType)`. For backward compatibility default to `'mobile'`.
3. **Catalog detail integration** – the detail screen already runs for laptop entities if you pass `laptopConfig`. On `handleChatSubmit`, pass `config.type` to `useCreateBooking`; once `'laptop'` is supported, laptop detail pages will create laptop bookings automatically.
4. **Better metadata (optional)** – `ChatRequestCard` currently shows placeholder images/text. Once `normalizeBooking` returns `booking.entityData` for laptops, you can populate the card with `entityData.brand`, `price`, etc.

### Seller experience
1. **Navigation**
   - `MyLaptopAdsStack.tsx` already exists; add the same `SellerRequestListScreen` + `SellerChatThreadScreen` routes used in `MyMobileAdsStack`.
   - Update `MyLaptopAdsListScreen` cards to render `onChatPress` → `SellerRequestList` just like the mobile list does (`handleChatPress` logic lives around line ~133 in `MyMobilesAdsListScreen.tsx` for reference).

2. **Request list**
   - Reuse `SellerRequestListScreen` by letting it accept `entityType` via params (default `'mobile'`). Alternatively duplicate the screen for laptops and switch `useEntityBookings` to `'laptop'`.

3. **Chat thread + status**
   - Update `SellerChatThreadScreen` so it accepts `entityType` and `entityTitle` props. Pass `'laptop'` for laptop stacks.
   - Inside `StatusActionButtons`, inject an `entityType` prop so the component builds the correct API adapter (`createBookingApi(entityType)`).

4. **Auto-status logic**
   - If laptops should auto-transition from `PENDING` to `IN_NEGOTIATION` when the seller replies, keep the same `createBookingApi('laptop').updateStatus(...)` call where the mobile thread currently does it (line ~95).

### Shared UI cleanups
1. Propagate `entityType`/`entityName` through navigation params so any header text or copy can say “Laptop Request”.
2. Confirm `ChatInput`, `MessageBubble`, and status utilities are agnostic – no changes required.
3. Verify analytics/logging statements that hardcode “mobile” (mostly `console.log` calls in seller thread) are updated to include the new entity type if they help debugging.

---

## 6. Testing Strategy

To validate the new laptop flow:
1. **Buyer smoke test**
   - Browse to a laptop listing (Buyer → Home → Laptop catalog stack).
   - Tap “Chat with seller”, send a message, confirm a new booking appears under Buyer → Chat → Laptop.
2. **Seller smoke test**
   - Seller → My Ads → Laptop listing → Chat button.
   - Ensure laptop requests load, messages sync, and status buttons hit laptop endpoints.
3. **Happy-path conversation**
   - Exchange a few messages between buyer and seller; confirm timestamps/order match and status changes propagate to the buyer list banners.
4. **Edge cases**
   - Reject request, verify buyer chat disables input.
   - Complete deal, make sure other laptop requests for the same listing are rejected if backend enforces it (same rule as mobile).

Once laptops mirror the mobile flow, future entities (bike, etc.) can take the same path with minimal effort.
