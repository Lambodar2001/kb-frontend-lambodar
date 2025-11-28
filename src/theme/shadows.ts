/**
 * Shadow & Elevation System - Extracted from BuyerHomeScreen & SellerHomeScreen
 * Consistent depth and elevation for UI components
 */

import { ViewStyle } from 'react-native';

// ==========================================
// ELEVATION LEVELS (Material Design inspired)
// ==========================================

export const elevation = {
  // Level 0 - No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  // Level 1 - Subtle elevation (search bars, inputs)
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,

  // Level 2 - Light elevation (cards on surface)
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  } as ViewStyle,

  // Level 3 - Default card elevation
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,

  // Level 4 - Raised elements (buttons, important cards)
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,

  // Level 5 - Floating elements (FAB, modals)
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  } as ViewStyle,

  // Level 6 - Dialogs, dropdowns
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
} as const;

// ==========================================
// SEMANTIC SHADOWS (component-specific)
// ==========================================

export const semanticShadows = {
  // Cards
  card: elevation.sm,                    // Light shadow for product cards
  cardHover: elevation.md,               // Slightly raised on hover
  cardSection: elevation.sm,             // Section cards (white backgrounds)

  // Header
  header: elevation.xs,                  // Subtle header shadow

  // Buttons
  button: elevation.none,                // No shadow by default
  buttonRaised: elevation.sm,            // Raised button
  buttonFloating: elevation.lg,          // FAB (Floating Action Button)

  // Icon buttons
  iconButton: elevation.xs,              // Subtle shadow

  // Favorite button
  favoriteButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,

  // Input fields
  input: elevation.none,                 // No shadow
  inputFocused: elevation.sm,            // Light shadow when focused

  // Modal & Sheets
  modal: elevation['2xl'],               // Heavy shadow for modals
  bottomSheet: elevation.xl,             // Floating sheet

  // Dropdown
  dropdown: elevation.lg,                // Floating dropdown

  // Banner overlays
  bannerOverlay: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  // Brand button (green "Start Selling" button)
  brandButton: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,

  // Post ad card
  postAdCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  // Quick action cards
  quickActionCard: elevation.none,       // Flat design
} as const;

// ==========================================
// TEXT SHADOWS
// ==========================================

export const textShadow = {
  // Banner title shadow
  bannerTitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Subtle text shadow for overlays
  subtle: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Strong text shadow for readability
  strong: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
} as const;

// ==========================================
// LEGACY SUPPORT
// ==========================================

export const legacyShadows = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  raised: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  } as ViewStyle,
} as const;

// ==========================================
// COMBINED EXPORT
// ==========================================

export const shadows = {
  elevation,
  semantic: semanticShadows,
  text: textShadow,
  legacy: legacyShadows,
} as const;

export type ElevationLevel = keyof typeof elevation;
export type SemanticShadow = keyof typeof semanticShadows;
