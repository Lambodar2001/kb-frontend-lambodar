# Mobile Booking Flow (Mobile Entity)

This guide explains how the mobile booking/chat flow works across the shared `core` layer and the buyer/seller features. It is intended for onboarding and does not require any code changes.

---

## 1. Where the Pieces Live

```
src
|__ core
|   |__ booking
|       |__ api            # Axios wiring + endpoint config per entity
|       |__ hooks          # Reusable hooks for creation, lists, thread, messaging
|       |__ types          # Booking + entity shape definitions
|       |__ utils          # Status helpers used by buyer/seller UI
|
|__ features
|   |__ buyer
|   |   |__ browse        # Generic catalog list/detail screens (Chat CTA starts here)
|   |   |__ chat          # Buyer chat list + thread UI
|   |   |__ navigation    # Buyer tab stack wiring (Chat tab + catalog stacks)
|   |
|   |__ seller
|       |__ listings      # "My Ads" screens; entry points into buyer requests
|       |__ chat          # Seller request list + chat thread + status buttons
|
|__ shared
    |__ api
        |__ client.ts     # Axios instance that booking APIs call through
```

### 1.1 Screens ↔ Hooks ↔ Endpoints

| Stage | Screen / Component | Hook or Adapter | Endpoint / File |
| --- | --- | --- | --- |
| Buyer browses catalog | `CatalogListScreen`, `CatalogDetailScreen`, `ChatRequestModal` | `useCreateBooking` (only when the chat modal submits) | `POST /api/v1/mobile/requests/create` (`src/core/booking/hooks/useCreateBooking.ts`) |
| Buyer sees chat inbox | `BuyerChatsScreen`, `BuyerChatListScreen` | `useBookingList` | `GET /api/v1/mobile/requests/buyer/:buyerId` |
| Buyer reads thread + sends messages | `BuyerChatThreadScreen`, `ChatInput` | `useBookingThread`, `useSendMessage` | `GET /api/v1/mobile/requests/:bookingId`, `POST /api/v1/mobile/requests/:bookingId/message` |
| Seller opens listing requests | `MyMobilesAdsListScreen`, `ProductDetailsScreen`, `SellerRequestListScreen` | `useEntityBookings` | `GET /api/v1/mobile/requests/:mobileId` |
| Seller chats + manages status | `SellerChatThreadScreen`, `StatusActionButtons` | `useBookingThread`, `useSendMessage`, `createBookingApi('mobile')` actions | `GET /:bookingId`, `POST /:bookingId/message`, `PATCH /status`, `/accept`, `/reject`, `POST /complete` |

Use this table when tracing navigation: screens call hooks, hooks construct a booking adapter for the selected `entityType`, and that adapter maps directly to the endpoint declared in `endpoints.config.ts`.

---

## 2. Core Booking Layer (Shared Between Buyer & Seller)

| File | Responsibility |
| --- | --- |
| `src/core/booking/api/endpoints.config.ts` | Central map of REST endpoints keyed by `EntityType`. Mobile routes live under `/api/v1/mobile/requests/*`. |
| `src/core/booking/api/createBookingApi.ts` | Factory that returns a `BookingApiAdapter` for a given entity. Handles payload shape (mobile vs car), HTTP verb, and normalizes responses. |
| `src/core/booking/hooks/*.ts` | Thin React hooks that wrap the adapter: `useCreateBooking`, `useBookingList`, `useEntityBookings`, `useBookingThread`, `useSendMessage`. |
| `src/core/booking/utils/bookingStatus.utils.ts` | Maps booking status strings to badge styles and determines whether chat input should be disabled. |

### 2.1 API Flow Cheat Sheet

```
Buyer taps Chat on catalog detail
|__ POST /api/v1/mobile/requests/create (createBooking)
    |__ Booking stored server-side
Buyer Chat tab opens
|__ GET /api/v1/mobile/requests/buyer/:buyerId (useBookingList)
Seller My Ads → Requests
|__ GET /api/v1/mobile/requests/:mobileId (useEntityBookings)
Either side opens thread
|__ GET /api/v1/mobile/requests/:bookingId (useBookingThread)
Chat messages
|__ POST /api/v1/mobile/requests/:bookingId/message (useSendMessage)
Status changes
|__ PATCH /api/v1/mobile/requests/:bookingId/status?status=...
|__ PATCH /api/v1/mobile/requests/:bookingId/accept or /reject
|__ POST  /api/v1/mobile/requests/:bookingId/complete (approveBooking)
```

`normalizeBooking` ensures every screen receives a consistent `Booking` object regardless of backend naming (`requestId` vs `bookingId`, `mobileId` vs `carId`, etc.).

---

## 3. Buyer Journey

### 3.1 Discovering an Item (Generic Catalog Screens)

* `createCatalogStack` (`src/features/buyer/browse/navigation/createCatalogStack.tsx`) builds a stack for each entity (`mobileConfig`, `carConfig`, `laptopConfig`).
* `CatalogListScreen` is entity-agnostic: it calls `getAllEntities(config)` and renders cards. Selecting a card pushes to `CatalogDetailScreen` with `{ entityId, entityType }`.
* Because the screens read copy, icons, and API routes from the supplied `EntityConfig`, we reuse the same UI for mobiles, cars, laptops without branching.

### 3.2 Sending the First Message

* `CatalogDetailScreen` (`buyer/browse/screens/CatalogDetailScreen.tsx`) loads full entity data and shows footer actions.
* Pressing **Chat** opens `ChatRequestModal`, which collects the buyer's first message.
* On submit the screen calls `useCreateBooking(config.type)` with `(entityId, bookingUserId, message)`:
  * For mobiles `bookingUserId` is `userId` from `AuthContext`.
  * `useCreateBooking` builds a `CreateBookingRequest`, triggers `createBookingApi('mobile').createBooking`, and surfaces loading/error states to disable the modal button.
  * Duplicate request errors are caught so the buyer sees "Already Requested" and can open the Chat tab instead of spamming.

### 3.3 Managing Chats (Buyer Tab)

* `BuyerTabNavigator` registers a `ChatStack` containing:
  1. `BuyerChatsScreen` – category picker (currently only mobiles enabled).
  2. `BuyerChatListScreen` – fetches bookings via `useBookingList` using the authenticated `buyerId`. Filters (All/Active/Completed) are purely client-side.
  3. `BuyerChatThreadScreen` – loads a single booking via `useBookingThread({ entityType: 'mobile', bookingId, contextId: buyerId })`. Displays `booking.conversation`, status badge (`getBuyerStatusConfig`), and wires `ChatInput` to `useSendMessage`.
* After sending a message the optimistic `updateBooking` keeps the list/thread in sync without a full refetch.
* Chat input is disabled when `isChatDisabled(status)` returns true (Completed/Rejected/Sold).

---

## 4. Seller Journey

### 4.1 Surfacing Buyer Requests

* Sellers live inside `MyMobileAdsStack` (`features/seller/listings/navigation/MyMobileAdsStack.tsx`).
* From **MyMobilesAdsListScreen** or **ProductDetailsScreen** the seller can tap the chat icon, which navigates to `SellerRequestList` with `{ mobileId, mobileTitle }`.
* `SellerRequestListScreen` invokes `useEntityBookings({ entityType: 'mobile', entityId: mobileId })`. That returns every booking tied to the listing, including status and partial conversation. Items render with `BuyerRequestCard`, which uses `getSellerStatusConfig` for badges.

### 4.2 Chatting & Negotiating

* Selecting a request opens `SellerChatThreadScreen` (same stack).
* The screen calls `useBookingThread({ entityType: 'mobile', bookingId, contextId: mobileId })`, so the seller sees the whole conversation. Messages reuse the buyer-facing `MessageBubble` and `ChatInput`.
* The seller chat input also uses `useSendMessage('mobile')`. A UX tweak auto-updates the backend status from `PENDING` to `IN_NEGOTIATION` right before the first seller message by calling `createBookingApi('mobile').updateStatus`.
* Below the messages, `StatusActionButtons` let the seller accept, reject, or complete the deal:
  * Accept/Reject call `updateStatus` with `ACCEPTED` or `REJECTED`.
  * Complete Deal calls `approveBooking`, which also marks the listing as sold server-side per the alert copy.
  * All buttons pipe through a confirmation `Alert` and refresh the booking on success.

---

## 5. Status Lifecycle

Status strings come from the backend. The UI treats them consistently thanks to `getBuyerStatusConfig`, `getSellerStatusConfig`, and `isChatDisabled`.

Typical progression:

1. `PENDING` – request created by buyer, awaiting seller response (seller sees Accept/Reject, chat input enabled).
2. `IN_NEGOTIATION` – seller replied (auto transition) or manually set.
3. `ACCEPTED` – seller accepted terms; buyer sees it under the Completed filter.
4. `COMPLETED` / `SOLD` – seller taps **Complete Deal**, chat locks for both sides.
5. `REJECTED` – either party stops the conversation; chat locks.

---

## 6. Multi-Entity Extensibility Cheat Sheet

* **Configs drive everything:** Add a new entry to `entityConfigs.ts` with API routes, display names, and detail fields. `createCatalogStack` + `Catalog*` screens will work automatically.
* **Booking API:** Extend `EntityType`, `ENDPOINT_CONFIGS`, and payload logic inside `createBookingApi` to support the new entity (e.g., `laptopId`). All existing hooks/screens will start sending/receiving the right shape because they only pass `entityType`.
* **UI reuse:** Buyer chat list/thread and seller request/thread screens are entity-agnostic as long as the normalized booking includes `entityData`. Supply the proper `entityName`/`entityType` via navigation params (see `BuyerChatsScreen`) so the header copy stays correct.

With these building blocks, the booking flow stays centralized in `src/core/booking`, while buyer and seller surfaces simply choose the right hook for their stage in the journey.
