/**
 * Color Palette - Extracted from BuyerHomeScreen & SellerHomeScreen
 * Industry-standard semantic color system for Kharido Becho app
 */

// ==========================================
// BRAND COLORS
// ==========================================
export const brand = {
  primary: '#0F172A',        // Dark blue-gray (Kharido brand color)
  primaryLight: '#1E293B',   // Lighter variant
  secondary: '#22C55E',      // Green (Becho/action color)
  secondaryLight: '#34D399', // Lighter green
  secondaryDark: '#16A34A',  // Darker green
  accent: '#3A77FF',         // Blue for links/accents
  accentLight: '#60A5FA',    // Lighter blue
} as const;

// ==========================================
// NEUTRAL COLORS (Grays)
// ==========================================
export const neutral = {
  50: '#F9FAFB',
  100: '#F7F8F9',
  200: '#F3F4F6',
  300: '#E5E7EB',
  400: '#D1D5DB',
  500: '#9CA3AF',
  600: '#6B7280',
  700: '#4B5563',
  800: '#374151',
  900: '#1F2937',
  950: '#0F172A',
} as const;

// ==========================================
// SEMANTIC COLORS
// ==========================================
export const semantic = {
  // Backgrounds
  background: '#F7F8F9',           // Main app background
  surface: '#FFFFFF',              // Cards, modals, sheets
  surfaceSecondary: '#F3F4F6',     // Secondary surfaces

  // Text
  textPrimary: '#0F172A',          // Headings, important text
  textSecondary: '#374151',        // Body text
  textTertiary: '#6B7280',         // Muted text
  textQuaternary: '#9CA3AF',       // Placeholder text
  textInverse: '#FFFFFF',          // Text on dark backgrounds

  // Borders
  border: '#E5E7EB',               // Default borders
  borderLight: '#F3F4F6',          // Subtle borders
  borderDark: '#D1D5DB',           // Emphasized borders

  // States
  success: '#22C55E',              // Success messages, confirmations
  successLight: '#DCFCE7',         // Success backgrounds
  successDark: '#16A34A',          // Success hover states

  warning: '#FACC15',              // Warnings, featured badges
  warningLight: '#FEF3C7',         // Warning backgrounds
  warningDark: '#EAB308',          // Warning hover states

  error: '#EF4444',                // Errors, destructive actions
  errorLight: '#FEE2E2',           // Error backgrounds
  errorDark: '#DC2626',            // Error hover states

  info: '#3A77FF',                 // Information, links
  infoLight: '#DBEAFE',            // Info backgrounds
  infoDark: '#2563EB',             // Info hover states
} as const;

// ==========================================
// FUNCTIONAL COLORS
// ==========================================
export const functional = {
  // Interactive elements
  link: '#3A77FF',
  linkHover: '#2563EB',
  linkVisited: '#7C3AED',

  // Overlays
  overlay: 'rgba(15, 23, 42, 0.35)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(255, 255, 255, 0.95)',

  // Shadows
  shadowColor: '#000000',

  // Special
  heart: '#FF6B6B',                // Favorite/like icon
  badge: '#EF4444',                // Notification badges
  featured: '#FACC15',             // Featured tag
} as const;

// ==========================================
// COMPONENT-SPECIFIC COLORS
// ==========================================
export const components = {
  // Headers
  headerBackground: '#FFFFFF',
  headerBorder: '#E5E7EB',

  // Search
  searchBackground: '#F3F4F6',
  searchPlaceholder: '#9CA3AF',
  searchText: '#111827',
  searchIcon: '#6B7280',

  // Buttons
  buttonPrimary: '#22C55E',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#F3F4F6',
  buttonSecondaryText: '#0F172A',

  // Cards
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',
  cardShadow: 'rgba(0, 0, 0, 0.04)',

  // Brand badge
  brandBadgeBackground: '#E5F3F5',
  brandBadgeIcon: '#0F172A',
} as const;

// ==========================================
// LEGACY SUPPORT (for gradual migration)
// ==========================================
export const legacy = {
  // Old colors from original theme
  bg: semantic.background,
  white: semantic.surface,
  text: semantic.textPrimary,
  textSecondary: semantic.textSecondary,
  textMuted: semantic.textTertiary,
  border: semantic.border,
  borderFocus: brand.accent,
  primary: brand.primary,
  primaryLight: brand.primaryLight,
  stepActive: brand.accent,
  stepInactive: neutral[300],
  error: semantic.error,
  success: semantic.success,
  overlay: functional.overlay,
} as const;

// ==========================================
// COMBINED EXPORT
// ==========================================
export const colors = {
  ...brand,
  ...neutral,
  ...semantic,
  ...functional,
  ...components,
  ...legacy,
} as const;

export type ColorToken = keyof typeof colors;
