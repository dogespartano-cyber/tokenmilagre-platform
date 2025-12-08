/**
 * Unit Tests for Date Helpers
 */

import {
  formatDate,
  getRelativeTime,
  formatDateTime,
  formatDateLong,
  getMonthName,
  isToday,
  isThisWeek,
  addDays,
  daysBetween,
} from '../date-helpers';

describe('Date Helpers', () => {
  const testDate = new Date('2024-11-05T15:30:00');

  describe('formatDate', () => {
    it('should format date as DD/MM/YYYY', () => {
      expect(formatDate(testDate)).toBe('05/11/2024');
    });

    it('should include time when requested', () => {
      expect(formatDate(testDate, true)).toBe('05/11/2024 às 15:30');
    });

    it('should handle string dates', () => {
      expect(formatDate('2024-11-05')).toMatch(/05\/11\/2024/);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "agora mesmo" for recent dates', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('agora mesmo');
    });

    it('should handle minutes correctly', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      expect(getRelativeTime(date)).toBe('há 5 minutos');
    });

    it('should handle hours correctly', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toBe('há 3 horas');
    });

    it('should handle days correctly', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toBe('há 2 dias');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      expect(formatDateTime(testDate)).toBe('05/11/2024, 15:30');
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format', () => {
      expect(formatDateLong(testDate)).toBe('5 de novembro de 2024');
    });
  });

  describe('getMonthName', () => {
    it('should return correct month names', () => {
      expect(getMonthName(0)).toBe('Janeiro');
      expect(getMonthName(10)).toBe('Novembro');
      expect(getMonthName(11)).toBe('Dezembro');
    });

    it('should handle invalid month', () => {
      expect(getMonthName(13)).toBe('Mês inválido');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('should return false for other dates', () => {
      expect(isToday(new Date('2020-01-01'))).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('should return true for dates in last 7 days', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(isThisWeek(yesterday)).toBe(true);
    });

    it('should return false for old dates', () => {
      const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      expect(isThisWeek(oldDate)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const result = addDays(testDate, 5);
      expect(result.getDate()).toBe(10);
    });

    it('should subtract days with negative number', () => {
      const result = addDays(testDate, -3);
      expect(result.getDate()).toBe(2);
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date('2024-11-01');
      const date2 = new Date('2024-11-05');
      expect(daysBetween(date1, date2)).toBe(4);
    });

    it('should work with reversed dates', () => {
      const date1 = new Date('2024-11-05');
      const date2 = new Date('2024-11-01');
      expect(daysBetween(date1, date2)).toBe(4);
    });
  });
});
