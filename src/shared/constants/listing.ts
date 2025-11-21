// src/constants/listing.ts

/**
 * Default location for listings when location data is not available
 */
export const DEFAULT_LISTING_LOCATION = 'Pune';

/**
 * Height of the bottom action bar in product details screens
 */
export const ACTION_BAR_HEIGHT = 96;

/**
 * Bottom sheet height for listing menu (Update/Delete actions)
 * Used in both My Ads List and Product Details screens
 * 0.32 = 32% of screen height (provides comfortable spacing for menu items)
 */
export const BOTTOM_SHEET_MENU_HEIGHT = 0.32;

/**
 * Listing status values
 */
export const LISTING_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  SOLD: 'SOLD',
} as const;

/**
 * Display labels for listing status
 */
export const LISTING_STATUS_LABELS = {
  [LISTING_STATUS.ACTIVE]: 'Live',
  [LISTING_STATUS.DRAFT]: 'Draft',
  [LISTING_STATUS.SOLD]: 'Sold',
} as const;

/**
 * Get display label for listing status
 * @param status - The listing status
 * @returns Display label for the status
 */
export const getStatusLabel = (status?: string): string => {
  if (!status) return 'Info';
  return LISTING_STATUS_LABELS[status as keyof typeof LISTING_STATUS_LABELS] ?? status;
};
