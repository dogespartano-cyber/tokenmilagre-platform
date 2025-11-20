/**
 * Utility functions for formatting numbers, currencies, and dates
 */

/**
 * Format number as currency (USD or BRL)
 */
export function formatCurrency(
  value: number,
  currency: 'USD' | 'BRL' = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Format number as compact notation (1.2K, 1.2M, etc)
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * Format token price with appropriate decimals
 */
export function formatTokenPrice(price: number): string {
  if (price === 0) return '$0';

  // For very small prices (< 0.000001), show more decimals
  if (price < 0.000001) {
    return `$${price.toFixed(10).replace(/\.?0+$/, '')}`;
  }

  // For small prices (< 0.01), show 6 decimals
  if (price < 0.01) {
    return `$${price.toFixed(6).replace(/\.?0+$/, '')}`;
  }

  // For normal prices, show 2 decimals
  return formatCurrency(price);
}

/**
 * Format percentage with + or - sign
 */
export function formatPercentage(
  value: number,
  options?: { showSign?: boolean; decimals?: number }
): string {
  const { showSign = true, decimals = 2 } = options || {};
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with commas (1,234,567)
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format market cap with compact notation
 */
export function formatMarketCap(value: number): string {
  return `$${formatCompactNumber(value)}`;
}

/**
 * Format volume with compact notation
 */
export function formatVolume(value: number): string {
  return `$${formatCompactNumber(value)}`;
}

/**
 * Format timestamp to relative time (3 seconds ago, 5 minutes ago)
 */
export function formatRelativeTime(timestamp: number | Date): string {
  const now = Date.now();
  const then = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  return `${seconds} segundo${seconds > 1 ? 's' : ''} atrás`;
}

/**
 * Format Solana address (truncate middle)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format progress percentage for bonding curve
 */
export function formatProgress(current: number, target: number): string {
  const percentage = (current / target) * 100;
  return formatPercentage(percentage, { showSign: false, decimals: 1 });
}

/**
 * Calculate and format change between two values
 */
export function formatChange(current: number, previous: number): {
  value: string;
  percentage: string;
  isPositive: boolean;
} {
  const diff = current - previous;
  const percentChange = previous === 0 ? 0 : (diff / previous) * 100;

  return {
    value: formatCurrency(Math.abs(diff)),
    percentage: formatPercentage(percentChange),
    isPositive: diff >= 0,
  };
}

/**
 * Format token amount with appropriate decimals
 */
export function formatTokenAmount(amount: number, symbol = ''): string {
  const formatted = amount >= 1000
    ? formatCompactNumber(amount)
    : formatNumber(amount, 2);

  return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Get color for percentage change
 */
export function getChangeColor(value: number): string {
  if (value > 0) return '#10B981'; // green
  if (value < 0) return '#EF4444'; // red
  return '#6B7280'; // gray
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | number, locale = 'pt-BR'): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time to locale string
 */
export function formatTime(date: Date | number, locale = 'pt-BR'): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
