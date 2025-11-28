/**
 * Kharido Becho Design System
 *
 * Complete theme system extracted from BuyerHomeScreen & SellerHomeScreen
 * Provides consistent colors, typography, spacing, radius, and shadows
 *
 * Usage:
 * ```typescript
 * import { colors, typography, spacing, radius, shadows } from '@theme';
 *
 * // Using colors
 * <View style={{ backgroundColor: colors.background }} />
 *
 * // Using typography presets
 * <Text style={typography.heading.h2}>Welcome</Text>
 *
 * // Using semantic spacing
 * <View style={{ padding: spacing.semantic.cardPadding }} />
 *
 * // Using shadows
 * <View style={shadows.semantic.card} />
 * ```
 */

// ==========================================
// EXPORTS
// ==========================================

export { colors } from './colors';
export type { ColorToken } from './colors';

export { typography } from './typography';
export type { TypographyPreset } from './typography';

export { spacingSystem as spacing } from './spacing';
export type { SpacingToken, SemanticSpacingToken } from './spacing';

export { radiusSystem as radius } from './radius';
export type { RadiusToken, SemanticRadiusToken } from './radius';

export { shadows } from './shadows';
export type { ElevationLevel, SemanticShadow } from './shadows';

// ==========================================
// LEGACY EXPORTS (for backward compatibility)
// ==========================================

// Export old tokens.ts structure
export { colors as legacyColors, spacing as legacySpacing } from './tokens';

// ==========================================
// CONVENIENCE EXPORTS
// ==========================================

import { colors } from './colors';
import { typography } from './typography';
import { spacingSystem } from './spacing';
import { radiusSystem } from './radius';
import { shadows } from './shadows';

/**
 * Complete theme object
 * Use this when you need access to all theme tokens
 */
export const theme = {
  colors,
  typography,
  spacing: spacingSystem,
  radius: radiusSystem,
  shadows,
} as const;

/**
 * Commonly used tokens for quick access
 */
export const tokens = {
  // Colors
  primary: colors.primary,
  secondary: colors.secondary,
  success: colors.success,
  error: colors.error,
  warning: colors.warning,

  // Spacing
  space: spacingSystem.semantic,

  // Typography
  text: typography.special,

  // Shadows
  shadow: shadows.semantic,
} as const;

export default theme;
