/**
 * Unit Tests for Level Helpers
 */

import {
  getLevelLabel,
  getLevelColor,
  getLevelGradient,
  getLevelIcon,
  getLevelDescription,
  getLevelConfig,
  getAllLevels,
  isValidLevel,
} from '../level-helpers';

describe('Level Helpers', () => {
  describe('getLevelLabel', () => {
    it('should return label for valid level', () => {
      expect(getLevelLabel('iniciante')).toBe('Iniciante');
      expect(getLevelLabel('intermediario')).toBe('Intermediário');
      expect(getLevelLabel('avancado')).toBe('Avançado');
    });

    it('should return default for invalid level', () => {
      expect(getLevelLabel('invalid')).toBe('Geral');
      expect(getLevelLabel(null)).toBe('Geral');
    });
  });

  describe('getLevelColor', () => {
    it('should return color for valid level', () => {
      expect(getLevelColor('iniciante')).toBe('#22c55e');
      expect(getLevelColor('intermediario')).toBe('#eab308');
      expect(getLevelColor('avancado')).toBe('#ef4444');
    });

    it('should return default for invalid level', () => {
      expect(getLevelColor('invalid')).toBe('#64748b');
    });
  });

  describe('getLevelGradient', () => {
    it('should return gradient for valid level', () => {
      expect(getLevelGradient('iniciante')).toContain('rgba');
    });
  });

  describe('getLevelIcon', () => {
    it('should return icon for valid level', () => {
      const icon = getLevelIcon('iniciante');
      expect(icon).toBeDefined();
      expect(icon).toHaveProperty('iconName');
    });
  });

  describe('getLevelDescription', () => {
    it('should return description for valid level', () => {
      expect(getLevelDescription('iniciante')).toBe('Fundamentos e conceitos básicos');
    });
  });

  describe('getLevelConfig', () => {
    it('should return complete config', () => {
      const config = getLevelConfig('iniciante');
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('color');
      expect(config).toHaveProperty('icon');
      expect(config).toHaveProperty('description');
    });
  });

  describe('getAllLevels', () => {
    it('should return all levels', () => {
      const levels = getAllLevels();
      expect(levels).toHaveLength(3);
      expect(levels).toContain('iniciante');
      expect(levels).toContain('intermediario');
      expect(levels).toContain('avancado');
    });
  });

  describe('isValidLevel', () => {
    it('should validate levels', () => {
      expect(isValidLevel('iniciante')).toBe(true);
      expect(isValidLevel('invalid')).toBe(false);
    });
  });
});
