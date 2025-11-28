// src/theme/tokens.ts
// LEGACY FILE - Maintained for backward compatibility
//
// ⚠️ DEPRECATED: This file is kept for existing code that uses these imports.
// For new code, please use the updated theme system:
//
// import { colors, typography, spacing, radius, shadows } from '@theme';
//
// New theme provides:
// - Semantic color naming (primary, secondary, success, error, etc.)
// - Expanded color palette with neutrals
// - Typography presets (heading.h1, body.large, etc.)
// - Spacing scale (0-17 with semantic names)
// - Border radius system
// - Shadow/elevation system
//
// This file now re-exports from the new theme system for compatibility.

import { colors as newColors } from './colors';
import { typography as newTypography } from './typography';
import { spacingSystem as newSpacing } from './spacing';
import { radiusSystem as newRadius } from './radius';
import { shadows as newShadows } from './shadows';

// ==========================================
// LEGACY EXPORTS (mapped to new theme)
// ==========================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const colors = {
  // Legacy colors (mapped to new theme)
  bg: newColors.background,
  white: newColors.surface,
  text: newColors.textPrimary,
  textSecondary: newColors.textSecondary,
  textMuted: newColors.textTertiary,
  border: newColors.border,
  borderFocus: newColors.accent,
  primary: newColors.primary,
  primaryLight: newColors.primaryLight,
  stepActive: newColors.accent,
  stepInactive: newColors[300],
  error: newColors.error,
  success: newColors.success,
  overlay: newColors.overlay,
} as const;

export const typography = {
  heading: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
} as const;

export const shadows = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  raised: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
