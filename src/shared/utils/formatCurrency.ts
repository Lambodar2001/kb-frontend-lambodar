// src/utils/formatCurrency.ts

export const formatINR = (value: number | null | undefined): string => {
  const numeric = typeof value === 'number' && !Number.isNaN(value) ? value : 0;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    const rounded = Math.round(numeric);
    return `INR ${rounded.toLocaleString('en-IN')}`;
  }
};

export const formatMoney = formatINR;

/**
 * Format currency with optional negotiable text
 * @param value - The price value
 * @param negotiable - Whether the price is negotiable
 * @returns Formatted price string with (Negotiable) suffix if applicable
 */
export const formatPriceWithNegotiable = (
  value: number | null | undefined,
  negotiable?: boolean
): string => {
  const base = formatINR(value);
  return negotiable ? `${base} (Negotiable)` : base;
};

/**
 * Format currency for display, with fallback message
 * @param value - The price value
 * @returns Formatted price string or fallback message
 */
export const formatCurrency = (value?: number): string => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return 'Price on request';
};
