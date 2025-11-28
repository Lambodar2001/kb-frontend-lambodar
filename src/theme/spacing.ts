/**
 * Spacing System - Extracted from BuyerHomeScreen & SellerHomeScreen
 * Consistent spacing scale for margins, padding, and gaps
 */

// ==========================================
// BASE SPACING SCALE (8pt grid system)
// ==========================================
export const spacing = {
  0: 0,
  1: 2,      // 0.125rem - Micro spacing
  2: 4,      // 0.25rem  - Tiny spacing
  3: 6,      // 0.375rem - Extra small
  4: 8,      // 0.5rem   - Small
  5: 10,     // 0.625rem
  6: 12,     // 0.75rem  - Medium
  7: 14,     // 0.875rem
  8: 16,     // 1rem     - Base/Default
  9: 18,     // 1.125rem
  10: 20,    // 1.25rem  - Large
  11: 24,    // 1.5rem   - Extra large
  12: 28,    // 1.75rem
  13: 32,    // 2rem     - 2X large
  14: 40,    // 2.5rem   - 3X large
  15: 48,    // 3rem     - 4X large
  16: 56,    // 3.5rem   - 5X large
  17: 64,    // 4rem     - 6X large
} as const;

// ==========================================
// SEMANTIC SPACING (based on usage patterns)
// ==========================================
export const semanticSpacing = {
  // Component internal spacing
  componentXs: spacing[1],      // 2px  - Badge padding
  componentSm: spacing[2],      // 4px  - Button icon gap
  componentMd: spacing[4],      // 8px  - Button padding vertical
  componentLg: spacing[6],      // 12px - Card padding
  componentXl: spacing[8],      // 16px - Section padding

  // Layout spacing
  layoutXs: spacing[4],         // 8px  - Minimal gap
  layoutSm: spacing[6],         // 12px - Small gap
  layoutMd: spacing[8],         // 16px - Default gap
  layoutLg: spacing[10],        // 20px - Large gap
  layoutXl: spacing[11],        // 24px - Section spacing

  // Screen edges
  screenHorizontal: spacing[8], // 16px - Default horizontal padding
  screenVertical: spacing[8],   // 16px - Default vertical padding

  // Cards & containers
  cardPadding: spacing[6],      // 12px - Card internal padding
  cardPaddingLarge: spacing[9], // 18px - Large card padding
  cardGap: spacing[6],          // 12px - Gap between cards
  cardMargin: spacing[8],       // 16px - Card outer margin

  // List items
  listItemPadding: spacing[6],  // 12px - List item padding
  listItemGap: spacing[4],      // 8px  - Gap between list items
  listGap: spacing[8],          // 16px - Gap between lists

  // Headers & sections
  headerPaddingVertical: spacing[6],    // 12px
  headerPaddingHorizontal: spacing[8],  // 16px
  sectionGap: spacing[10],              // 20px
  sectionPadding: spacing[8],           // 16px

  // Buttons
  buttonPaddingHorizontal: spacing[7],  // 14px
  buttonPaddingVertical: spacing[4],    // 8px
  buttonPaddingLarge: spacing[9],       // 18px
  buttonIconGap: spacing[4],            // 8px

  // Input fields
  inputPaddingHorizontal: spacing[6],   // 12px
  inputPaddingVertical: spacing[4],     // 8px
  inputIconGap: spacing[4],             // 8px

  // Icon buttons
  iconButtonSize: spacing[13],          // 32px (not 34, normalized to grid)
  iconButtonSizeLarge: spacing[15],     // 48px
  iconButtonPadding: spacing[4],        // 8px

  // Badges & pills
  badgePaddingHorizontal: spacing[4],   // 8px
  badgePaddingVertical: spacing[2],     // 4px
  badgePaddingLarge: spacing[7],        // 14px
  badgePaddingVerticalLarge: spacing[3],// 6px

  // Product cards
  productCardGap: spacing[3],           // 6px  - Horizontal gap
  productCardPadding: spacing[3],       // 6px  - Card wrapper padding
  productInfoPadding: spacing[4],       // 8px  - Product info section

  // Search bar
  searchPaddingHorizontal: spacing[6],  // 12px
  searchPaddingVertical: spacing[4],    // 8px

  // Banner
  bannerPadding: spacing[10],           // 20px
  bannerMargin: spacing[8],             // 16px

  // Categories
  categoryIconSize: spacing[16],        // 56px
  categoryGap: spacing[6],              // 12px
  categoryPadding: spacing[6],          // 12px (vertical)

  // Quick actions
  quickActionIconSize: spacing[17],     // 64px (60 normalized to 64)
  quickActionGap: spacing[10],          // 20px

  // Bottom spacing
  bottomSpacing: spacing[11],           // 24px
  bottomSpacingLarge: spacing[14],      // 40px
} as const;

// ==========================================
// INSET SPACING (for SafeAreaView, etc.)
// ==========================================
export const inset = {
  top: spacing[9],       // 18px - Top safe area
  bottom: spacing[11],   // 24px - Bottom safe area
  horizontal: spacing[8],// 16px - Horizontal safe area
} as const;

// ==========================================
// LEGACY SUPPORT
// ==========================================
export const legacySpacing = {
  xs: spacing[2],   // 4
  sm: spacing[4],   // 8
  md: spacing[6],   // 12
  lg: spacing[8],   // 16
  xl: spacing[10],  // 20
  xxl: spacing[11], // 24
  xxxl: spacing[13],// 32
} as const;

// ==========================================
// COMBINED EXPORT
// ==========================================
export const spacingSystem = {
  ...spacing,
  semantic: semanticSpacing,
  inset,
  legacy: legacySpacing,
} as const;

export type SpacingToken = keyof typeof spacing;
export type SemanticSpacingToken = keyof typeof semanticSpacing;
