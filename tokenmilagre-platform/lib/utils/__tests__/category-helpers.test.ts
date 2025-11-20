/**
 * Unit Tests for Category Helpers
 */

import {
  getCategoryLabel,
  getCategoryIcon,
  getCategoryColor,
  getCategoryDescription,
  getCategoryType,
  getCategoryConfig,
  getAllCategories,
  getCategoriesByType,
  isValidCategory,
  getCategoryGradient,
} from '../category-helpers';

describe('Category Helpers', () => {
  describe('getCategoryLabel', () => {
    it('should return label for valid category', () => {
      expect(getCategoryLabel('bitcoin')).toBe('Bitcoin');
      expect(getCategoryLabel('ethereum')).toBe('Ethereum');
    });

    it('should return default for invalid category', () => {
      expect(getCategoryLabel('invalid')).toBe('Geral');
      expect(getCategoryLabel(null)).toBe('Geral');
    });
  });

  describe('getCategoryIcon', () => {
    it('should return icon for valid category', () => {
      expect(getCategoryIcon('bitcoin')).toBe('₿');
      expect(getCategoryIcon('ethereum')).toBe('◆');
    });

    it('should return default for invalid category', () => {
      expect(getCategoryIcon('invalid')).toBe('📄');
    });
  });

  describe('getCategoryColor', () => {
    it('should return color for valid category', () => {
      expect(getCategoryColor('bitcoin')).toBe('#F7931A');
    });

    it('should return default for invalid category', () => {
      expect(getCategoryColor('invalid')).toBe('#6B7280');
    });
  });

  describe('getCategoryType', () => {
    it('should return correct types', () => {
      expect(getCategoryType('bitcoin')).toBe('news');
      expect(getCategoryType('blockchain')).toBe('educational');
      expect(getCategoryType('defi')).toBe('both');
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', () => {
      const categories = getAllCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('bitcoin');
      expect(categories).toContain('ethereum');
    });
  });

  describe('getCategoriesByType', () => {
    it('should filter educational categories', () => {
      const educational = getCategoriesByType('educational');
      expect(educational).toContain('blockchain');
      expect(educational).not.toContain('bitcoin');
    });

    it('should filter news categories', () => {
      const news = getCategoriesByType('news');
      expect(news).toContain('bitcoin');
    });
  });

  describe('isValidCategory', () => {
    it('should validate categories', () => {
      expect(isValidCategory('bitcoin')).toBe(true);
      expect(isValidCategory('invalid')).toBe(false);
    });
  });

  describe('getCategoryGradient', () => {
    it('should return gradient string', () => {
      const gradient = getCategoryGradient('bitcoin');
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('#F7931A');
    });
  });
});
