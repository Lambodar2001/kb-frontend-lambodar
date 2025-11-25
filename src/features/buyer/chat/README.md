# Buyer Chat Feature

Production-ready chat list feature for buyers to view and manage their mobile request conversations.

## 📁 Folder Structure

```
src/features/buyer/chat/
├── api/
│   └── chatApi.ts              # API service for chat requests
├── components/
│   └── ChatRequestCard.tsx     # OLX-style chat card component
├── screens/
│   └── BuyerChatListScreen.tsx # Main chat list screen
├── types/
│   └── index.ts                # TypeScript interfaces
├── index.ts                    # Barrel exports
└── README.md                   # This file
```

## 🎨 Design Features

### OLX-Style Design Elements
- **Clean card layout** with mobile thumbnail, title, and last message preview
- **Status badges** with color-coded indicators (Pending, In Chat, Accepted, Rejected, Completed)
- **Relative timestamps** (Just now, 2h ago, 3d ago)
- **Filter tabs** (All, Active, Completed)
- **Empty states** with call-to-action buttons
- **Pull-to-refresh** functionality
- **Loading states** with appropriate indicators

### Status Color Scheme
- 🟡 **Pending**: Amber (`#F59E0B`)
- 🔵 **In Negotiation**: Blue (`#3B82F6`)
- 🟢 **Accepted**: Green (`#10B981`)
- 🔴 **Rejected**: Red (`#EF4444`)
- ⚪ **Completed**: Gray (`#6B7280`)

## 🔌 API Integration

### Endpoint
```
GET /api/v1/mobile/requests/buyer/{buyerId}
```

### Response Format
```typescript
[
  {
    "requestId": 2,
    "mobileId": 2,
    "buyerId": 1,
    "sellerId": 1,
    "status": "PENDING",
    "createdAt": "2025-11-24T03:49:28.699047Z",
    "updatedAt": null,
    "conversation": [
      {
        "senderId": 10001,
        "senderType": "BUYER",
        "message": "Hi, is this phone available?",
        "timestamp": "2025-11-24T03:49:28.6534631Z"
      }
    ]
  }
]
```

## 📦 Components

### BuyerChatListScreen
Main screen component with:
- Filter tabs (All/Active/Completed)
- Pull-to-refresh
- Empty states
- Error handling
- Search icon (future implementation)

### ChatRequestCard
Reusable card component displaying:
- Mobile thumbnail (80x80)
- Mobile title and price
- Last message preview
- Timestamp (relative)
- Status badge
- Sender indicator (You: for buyer messages)

## 🚀 Usage

### Navigation
The chat screen is integrated into the buyer tab navigator:
```typescript
// Accessible via "Chats" tab in bottom navigation
<Tab.Screen name="Chat" component={BuyerChatListScreen} />
```

### API Usage
```typescript
import { getBuyerChatRequests } from '@features/buyer/chat/api/chatApi';

const requests = await getBuyerChatRequests(buyerId);
```

## 🎯 Features Implemented

✅ **Display all buyer chat requests**
✅ **OLX-style card design**
✅ **Status badges with color coding**
✅ **Last message preview**
✅ **Relative timestamps**
✅ **Filter tabs (All/Active/Completed)**
✅ **Pull-to-refresh**
✅ **Empty states**
✅ **Error handling**
✅ **Loading states**
✅ **Sorted by latest activity**
✅ **Responsive layout**

## 🔮 Future Enhancements

- [ ] Chat detail screen with full conversation
- [ ] Real-time message updates (WebSocket/Polling)
- [ ] Unread message count indicator
- [ ] Search functionality
- [ ] Message composition
- [ ] Image sharing in chat
- [ ] Push notifications for new messages
- [ ] Mobile details integration (thumbnail, title, price from mobile API)
- [ ] Mark as read/unread
- [ ] Delete conversation
- [ ] Archive conversations

## 🎨 Design Specifications

### Colors
- **Primary**: `#0F5E87` (Buyer theme)
- **Background**: `#F7F8F9`
- **Card**: `#FFFFFF`
- **Text Primary**: `#002F34`
- **Text Secondary**: `#6B7280`
- **Border**: `#E5E7EB`

### Typography
- **Header Title**: 24px, Bold (700)
- **Card Title**: 15px, SemiBold (600)
- **Price**: 16px, Bold (700)
- **Message**: 13px, Regular (400)
- **Status**: 11px, SemiBold (600), Uppercase

### Spacing
- **Card Padding**: 16px horizontal, 12px vertical
- **Image Size**: 80x80
- **Border Radius**: 8px (cards), 12px (badges)

## 🧪 Testing

Manual testing checklist:
- [ ] Verify API integration with real data
- [ ] Test pull-to-refresh functionality
- [ ] Verify filter tabs work correctly
- [ ] Check empty states for each filter
- [ ] Test error handling (network failure)
- [ ] Verify chat card tap navigation
- [ ] Check responsive design on different screen sizes
- [ ] Verify status badge colors
- [ ] Test relative timestamp formatting

## 📝 Notes

- Currently displays `Mobile Request #${mobileId}` as placeholder title
- Mobile details (thumbnail, title, price) can be added when backend provides them
- Chat detail screen navigation is prepared but commented out (TODO)
- Search functionality UI is ready but not implemented yet
