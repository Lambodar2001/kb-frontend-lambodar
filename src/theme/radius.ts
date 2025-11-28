/**
 * Border Radius System - Extracted from BuyerHomeScreen & SellerHomeScreen
 * Consistent corner rounding for UI components
 */

// ==========================================
// BASE RADIUS SCALE
// ==========================================
export const radius = {
  none: 0,
  xs: 4,      // Subtle rounding
  sm: 8,      // Small rounding
  md: 10,     // Medium rounding (product cards)
  lg: 12,     // Large rounding (categories, cards)
  xl: 16,     // Extra large rounding (sections)
  '2xl': 20,  // 2X large rounding
  '3xl': 24,  // 3X large rounding
  full: 999,  // Pills, circular buttons
} as const;

// ==========================================
// SEMANTIC RADIUS (component-specific)
// ==========================================
export const semanticRadius = {
  // Buttons
  button: radius.full,            // 999 - Pill-shaped buttons
  buttonSmall: radius.lg,         // 12  - Small squared buttons
  iconButton: radius.full,        // 999 - Circular icon buttons

  // Cards
  card: radius.md,                // 10  - Product cards
  cardLarge: radius.lg,           // 12  - Large feature cards
  cardSection: radius.xl,         // 16  - Section containers

  // Input fields
  input: radius.full,             // 999 - Search bar (pill-shaped)
  inputSquare: radius.lg,         // 12  - Square input fields

  // Badges & Pills
  badge: radius.full,             // 999 - Notification badges
  pill: radius.full,              // 999 - Location pill
  tag: radius.sm,                 // 8   - Feature tags

  // Images
  image: radius.md,               // 10  - Product images
  imageSmall: radius.sm,          // 8   - Small thumbnails
  avatar: radius.full,            // 999 - Profile pictures

  // Categories
  category: radius.lg,            // 12  - Category icons
  categorySmall: radius.md,       // 10  - Small category icons

  // Modal & Overlays
  modal: radius.xl,               // 16  - Modal windows
  sheet: radius.xl,               // 16  - Bottom sheets
  dropdown: radius.lg,            // 12  - Dropdown menus

  // Banner
  banner: radius.lg,              // 12  - Promotional banners

  // Brand logo
  brandLogo: radius.full,         // 999 - Circular brand badge

  // Quick actions
  quickAction: radius.xl,         // 16  - Quick action icon boxes
} as const;

// ==========================================
// LEGACY SUPPORT
// ==========================================
export const legacyRadius = {
  xs: radius.xs,    // 4
  sm: radius.sm,    // 8
  md: radius.lg,    // 12
  lg: radius.xl,    // 16
  xl: radius['2xl'],// 20
} as const;

// ==========================================
// COMBINED EXPORT
// ==========================================
export const radiusSystem = {
  ...radius,
  semantic: semanticRadius,
  legacy: legacyRadius,
} as const;

export type RadiusToken = keyof typeof radius;
export type SemanticRadiusToken = keyof typeof semanticRadius;
