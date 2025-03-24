
/**
 * Utility functions for formatting different types of data
 */

/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2
  }).format(value);
};

/**
 * Format a large number with appropriate suffixes (T, B, M)
 */
export const formatLargeNumber = (num: number | null | undefined) => {
  // Add null/undefined check
  if (num === null || num === undefined) {
    return 'N/A';
  }
  
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + ' T';
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + ' B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + ' M';
  }
  return num.toLocaleString();
};
