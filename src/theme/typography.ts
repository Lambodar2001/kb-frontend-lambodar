/**
 * Typography System - Extracted from BuyerHomeScreen & SellerHomeScreen
 * Consistent text styles for the entire app
 */

import { TextStyle } from 'react-native';
import { colors } from './colors';

// ==========================================
// FONT WEIGHTS
// ==========================================
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

// ==========================================
// FONT SIZES
// ==========================================
export const fontSize = {
  xs: 10,     // Small badges, tiny labels
  sm: 11,     // Category names, meta info
  base: 12,   // Quick action labels, captions
  md: 13,     // Product titles (secondary)
  lg: 14,     // Search input, location, body text
  xl: 15,     // View all links, secondary headings
  '2xl': 16,  // Product prices (small)
  '3xl': 18,  // Product prices, brand name, subheadings
  '4xl': 20,  // Section titles, post ad title
  '5xl': 26,  // Banner title
} as const;

// ==========================================
// LINE HEIGHTS
// ==========================================
export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

// ==========================================
// LETTER SPACING
// ==========================================
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.3,
  normal: 0,
  wide: 0.3,
  wider: 0.4,
  widest: 0.5,
} as const;

// ==========================================
// TYPOGRAPHY PRESETS
// ==========================================

// Headings
export const heading = {
  h1: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSize['5xl'] * lineHeight.tight,
  } as TextStyle,

  h2: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSize['4xl'] * lineHeight.tight,
  } as TextStyle,

  h3: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.wide,
    lineHeight: fontSize['3xl'] * lineHeight.tight,
  } as TextStyle,

  h4: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSize.xl * lineHeight.normal,
  } as TextStyle,
} as const;

// Body text
export const body = {
  large: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSize.lg * lineHeight.normal,
  } as TextStyle,

  base: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSize.md * lineHeight.relaxed,
  } as TextStyle,

  small: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: colors.textTertiary,
    letterSpacing: letterSpacing.normal,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,
} as const;

// Labels
export const label = {
  large: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  base: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  small: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
} as const;

// Special purpose text styles
export const special = {
  // Brand name
  brandPrimary: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  brandSecondary: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.secondary,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Prices
  priceHero: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  priceCard: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  priceSmall: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Links
  link: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.link,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Badges
  badge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  // Featured badge
  featured: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#1F2933',
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  // Button text
  button: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textInverse,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  buttonSmall: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textInverse,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Input placeholder
  placeholder: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    color: colors.searchPlaceholder,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Search input
  searchInput: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.searchText,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Location text
  location: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Banner title
  bannerTitle: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.textInverse,
    letterSpacing: letterSpacing.normal,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  } as TextStyle,

  // Category name
  category: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: '#002F34',
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
} as const;

// ==========================================
// COMBINED EXPORT
// ==========================================
export const typography = {
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  heading,
  body,
  label,
  special,

  // Legacy support (from old theme)
  legacy: {
    heading: {
      fontSize: fontSize['3xl'],
      fontWeight: fontWeight.semibold,
      color: colors.text,
    } as TextStyle,
    body: {
      fontSize: fontSize['2xl'],
      color: colors.text,
    } as TextStyle,
    caption: {
      fontSize: fontSize.base,
      color: colors.textMuted,
    } as TextStyle,
  },
} as const;

export type TypographyPreset = keyof typeof typography.heading | keyof typeof typography.body | keyof typeof typography.label | keyof typeof typography.special;
