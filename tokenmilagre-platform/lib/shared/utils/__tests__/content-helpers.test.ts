/**
 * Unit Tests for Content Helpers
 *
 * Tests all content manipulation and formatting utilities
 */

import {
  cleanReferences,
  calculateReadTime,
  truncateText,
  slugify,
  slugifyWithDate,
  extractExcerpt,
  countWords,
  formatViews,
  removeH1FromContent,
  removeSourcesSection,
  validateContentStructure,
  prepareContentForPublication,
} from '../content-helpers';

describe('Content Helpers', () => {
  describe('cleanReferences', () => {
    it('should remove single numeric references', () => {
      const text = 'Bitcoin is a cryptocurrency[1].';
      expect(cleanReferences(text)).toBe('Bitcoin is a cryptocurrency.');
    });

    it('should remove multiple references', () => {
      const text = 'Bitcoin[1] and Ethereum[2] are popular[3].';
      expect(cleanReferences(text)).toBe('Bitcoin and Ethereum are popular.');
    });

    it('should remove sequential references', () => {
      const text = 'This is a fact[1][2][3].';
      expect(cleanReferences(text)).toBe('This is a fact.');
    });

    it('should remove references with spaces', () => {
      const text = 'Bitcoin[ 1 ] and Ethereum[  2  ].';
      expect(cleanReferences(text)).toBe('Bitcoin and Ethereum.');
    });

    it('should remove multiple consecutive spaces but preserve newlines', () => {
      const text = 'Bitcoin    is\nawesome   technology';
      expect(cleanReferences(text)).toBe('Bitcoin is\nawesome technology');
    });

    it('should preserve single newlines', () => {
      const text = 'Line 1[1]\nLine 2[2]\nLine 3';
      expect(cleanReferences(text)).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should trim whitespace', () => {
      const text = '   Bitcoin[1]   ';
      expect(cleanReferences(text)).toBe('Bitcoin');
    });

    it('should handle empty string', () => {
      expect(cleanReferences('')).toBe('');
    });

    it('should handle text without references', () => {
      const text = 'Bitcoin is a cryptocurrency.';
      expect(cleanReferences(text)).toBe('Bitcoin is a cryptocurrency.');
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate read time for average text', () => {
      // 200 words should take 1 minute at 200 wpm
      const words = new Array(200).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(1);
    });

    it('should round up to next minute', () => {
      // 250 words should take 2 minutes at 200 wpm
      const words = new Array(250).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(2);
    });

    it('should use custom words per minute', () => {
      const words = new Array(300).fill('word').join(' ');
      // 300 words at 100 wpm = 3 minutes
      expect(calculateReadTime(words, 100)).toBe(3);
    });

    it('should ignore markdown code blocks', () => {
      const text = '```\n' + new Array(100).fill('code').join(' ') + '\n```\n' +
                   new Array(200).fill('word').join(' ');
      // Should only count the 200 words outside code block
      expect(calculateReadTime(text)).toBe(1);
    });

    it('should ignore inline code', () => {
      const text = 'Normal text `ignored code` more text';
      const words = new Array(200).fill('Normal text more text').join(' ');
      expect(calculateReadTime(words)).toBe(1);
    });

    it('should ignore markdown images', () => {
      const text = '![alt text](image.jpg) ' + new Array(200).fill('word').join(' ');
      expect(calculateReadTime(text)).toBe(1);
    });

    it('should keep link text but remove URL', () => {
      const text = '[Bitcoin](https://bitcoin.org) ' + new Array(199).fill('word').join(' ');
      // Should count "Bitcoin" + 199 words = 200 total
      expect(calculateReadTime(text)).toBe(1);
    });

    it('should remove markdown formatting', () => {
      const text = '**bold** *italic* ~~strikethrough~~ `code` ' +
                   new Array(196).fill('word').join(' ');
      expect(calculateReadTime(text)).toBe(1);
    });

    it('should return minimum 1 minute for very short text', () => {
      expect(calculateReadTime('short')).toBe(1);
      expect(calculateReadTime('')).toBe(1);
    });

    it('should handle very long content', () => {
      const words = new Array(2000).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe(10);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(24); // 20 + '...'
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncateText(text, 150)).toBe('Short');
    });

    it('should truncate at last space', () => {
      const text = 'This is a long text that should truncate';
      const result = truncateText(text, 15);
      expect(result).toBe('This is a long...');
    });

    it('should handle text without spaces', () => {
      const text = 'thisisaverylongtextwithoutanyspaces';
      const result = truncateText(text, 10);
      expect(result).toMatch(/^.{10}\.\.\.$/);
    });

    it('should use default max length', () => {
      const text = new Array(200).fill('word').join(' ');
      const result = truncateText(text);
      expect(result.length).toBeLessThanOrEqual(154); // 150 + '...'
    });

    it('should handle empty string', () => {
      expect(truncateText('')).toBe('');
    });

    it('should handle null/undefined gracefully', () => {
      expect(truncateText(null as any)).toBe(null);
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase', () => {
      expect(slugify('Bitcoin NEWS')).toBe('bitcoin-news');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove accents', () => {
      expect(slugify('Café André')).toBe('cafe-andre');
      expect(slugify('São Paulo')).toBe('sao-paulo');
    });

    it('should remove special characters', () => {
      expect(slugify('Bitcoin @ $50k!')).toBe('bitcoin-50k');
    });

    it('should remove duplicate hyphens', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
    });

    it('should remove leading/trailing hyphens', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('should handle Portuguese characters', () => {
      expect(slugify('Ação Regulação')).toBe('acao-regulacao');
    });

    it('should handle numbers', () => {
      expect(slugify('Bitcoin 2024')).toBe('bitcoin-2024');
    });

    it('should handle complex text', () => {
      expect(slugify('Bitcoin: A Revolução Digital (2024)!')).toBe(
        'bitcoin-a-revolucao-digital-2024'
      );
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('slugifyWithDate', () => {
    it('should generate slug with date suffix', () => {
      const result = slugifyWithDate('Bitcoin News');
      expect(result).toMatch(/^bitcoin-news-\d{8}$/);
    });

    it('should include year, month, and day', () => {
      const result = slugifyWithDate('Test Article');
      const dateMatch = result.match(/-(\d{4})(\d{2})(\d{2})$/);

      expect(dateMatch).toBeTruthy();
      const year = parseInt(dateMatch![1]);
      const month = parseInt(dateMatch![2]);
      const day = parseInt(dateMatch![3]);

      expect(year).toBeGreaterThanOrEqual(2024);
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(31);
    });

    it('should pad month and day with zeros', () => {
      const result = slugifyWithDate('Test');
      // Should be format: test-YYYYMMDD
      expect(result).toMatch(/^test-\d{4}\d{2}\d{2}$/);
    });
  });

  describe('extractExcerpt', () => {
    it('should extract plain text excerpt', () => {
      const content = '**Bold** and *italic* text with more content';
      const result = extractExcerpt(content, 30);
      expect(result).not.toContain('**');
      expect(result).not.toContain('*');
    });

    it('should remove markdown formatting', () => {
      const content = '# Title\n\n**Bold** text `code` [link](url)';
      const result = extractExcerpt(content);
      expect(result).not.toContain('#');
      expect(result).not.toContain('**');
      expect(result).not.toContain('`');
      expect(result).not.toContain('[');
    });

    it('should convert newlines to spaces', () => {
      const content = 'Line 1\nLine 2\nLine 3';
      const result = extractExcerpt(content);
      expect(result).toBe('Line 1 Line 2 Line 3');
    });

    it('should use truncateText', () => {
      const content = new Array(300).fill('word').join(' ');
      const result = extractExcerpt(content, 50);
      expect(result).toContain('...');
      expect(result.length).toBeLessThanOrEqual(54);
    });

    it('should use default max length', () => {
      const content = new Array(300).fill('word').join(' ');
      const result = extractExcerpt(content);
      expect(result.length).toBeLessThanOrEqual(204);
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('Hello world')).toBe(2);
      expect(countWords('One two three four five')).toBe(5);
    });

    it('should ignore markdown formatting', () => {
      expect(countWords('**Hello** *world*')).toBe(2);
    });

    it('should ignore code blocks', () => {
      const text = '```\ncode here\n```\nHello world';
      expect(countWords(text)).toBe(2);
    });

    it('should handle multiple spaces', () => {
      expect(countWords('Hello    world')).toBe(2);
    });

    it('should handle empty string', () => {
      expect(countWords('')).toBe(0);
    });

    it('should handle only markdown', () => {
      expect(countWords('***')).toBe(0);
    });
  });

  describe('formatViews', () => {
    it('should format numbers under 1000', () => {
      expect(formatViews(0)).toBe('0');
      expect(formatViews(500)).toBe('500');
      expect(formatViews(999)).toBe('999');
    });

    it('should format thousands with k suffix', () => {
      expect(formatViews(1000)).toBe('1k');
      expect(formatViews(1234)).toBe('1.2k');
      expect(formatViews(5500)).toBe('5.5k');
    });

    it('should remove .0 from thousands', () => {
      expect(formatViews(2000)).toBe('2k');
      expect(formatViews(10000)).toBe('10k');
    });

    it('should format millions with M suffix', () => {
      expect(formatViews(1000000)).toBe('1M');
      expect(formatViews(1234567)).toBe('1.2M');
      expect(formatViews(5500000)).toBe('5.5M');
    });

    it('should remove .0 from millions', () => {
      expect(formatViews(2000000)).toBe('2M');
      expect(formatViews(10000000)).toBe('10M');
    });

    it('should handle edge cases', () => {
      expect(formatViews(999999)).toBe('1000k');
      expect(formatViews(1500)).toBe('1.5k');
    });
  });

  describe('removeH1FromContent', () => {
    it('should remove H1 from beginning', () => {
      const content = '# Title\n\nContent here';
      expect(removeH1FromContent(content)).toBe('Content here');
    });

    it('should not remove H2 or other headings', () => {
      const content = '## Subtitle\n\nContent';
      expect(removeH1FromContent(content)).toBe('## Subtitle\n\nContent');
    });

    it('should only remove first H1', () => {
      const content = '# Title\n\nContent\n\n# Another Title';
      const result = removeH1FromContent(content);
      expect(result).not.toContain('# Title');
      expect(result).toContain('# Another Title');
    });

    it('should handle content without H1', () => {
      const content = 'No heading here';
      expect(removeH1FromContent(content)).toBe('No heading here');
    });

    it('should trim result', () => {
      const content = '# Title\n\n\n\nContent';
      expect(removeH1FromContent(content).trim()).toBe('Content');
    });
  });

  describe('removeSourcesSection', () => {
    it('should remove Fontes section', () => {
      const content = 'Content\n\n## Fontes\n\n1. Source 1\n2. Source 2';
      expect(removeSourcesSection(content)).toBe('Content');
    });

    it('should remove Referências section', () => {
      const content = 'Content\n\n## Referências\n\nRef 1';
      expect(removeSourcesSection(content)).toBe('Content');
    });

    it('should remove Sources section (English)', () => {
      const content = 'Content\n\n## Sources\n\nSource 1';
      expect(removeSourcesSection(content)).toBe('Content');
    });

    it('should remove References section (English)', () => {
      const content = 'Content\n\n## References\n\nRef 1';
      expect(removeSourcesSection(content)).toBe('Content');
    });

    it('should be case insensitive', () => {
      const content = 'Content\n\n## FONTES\n\nSource';
      expect(removeSourcesSection(content)).toBe('Content');
    });

    it('should handle content without sources', () => {
      const content = 'Content only';
      expect(removeSourcesSection(content)).toBe('Content only');
    });
  });

  describe('validateContentStructure', () => {
    it('should validate content with good structure', () => {
      const content = 'A'.repeat(600) + '\n\n## Section 1\n\n## Section 2\n\n## Section 3';
      const result = validateContentStructure(content);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should error on content too short', () => {
      const content = 'Too short';
      const result = validateContentStructure(content);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Conteúdo muito curto (mínimo 500 caracteres)');
    });

    it('should warn on H1 at start', () => {
      const content = '# Title\n\n' + 'A'.repeat(600);
      const result = validateContentStructure(content);
      expect(result.warnings).toContain('Conteúdo inicia com H1 (deveria ser removido)');
    });

    it('should warn on too few H2 sections', () => {
      const content = 'A'.repeat(600) + '\n\n## Section 1';
      const result = validateContentStructure(content);
      expect(result.warnings).toContain('Conteúdo tem poucas seções H2 (recomendado: 4-7)');
    });

    it('should warn on too many H2 sections', () => {
      let content = 'A'.repeat(600);
      for (let i = 0; i < 15; i++) {
        content += `\n\n## Section ${i}`;
      }
      const result = validateContentStructure(content);
      expect(result.warnings).toContain('Conteúdo tem muitas seções H2 (recomendado: 4-7)');
    });

    it('should warn on numeric references', () => {
      const content = 'A'.repeat(600) + ' with reference[1]';
      const result = validateContentStructure(content);
      expect(result.warnings).toContain(
        'Conteúdo contém referências numéricas [1][2] (devem ser removidas)'
      );
    });

    it('should have both errors and warnings', () => {
      const content = '# Title\n\nShort content[1]';
      const result = validateContentStructure(content);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('prepareContentForPublication', () => {
    it('should remove H1', () => {
      const content = '# Title\n\nContent here';
      const result = prepareContentForPublication(content);
      expect(result).not.toContain('# Title');
    });

    it('should remove sources section', () => {
      const content = 'Content\n\n## Fontes\n\nSource 1';
      const result = prepareContentForPublication(content);
      expect(result).not.toContain('## Fontes');
    });

    it('should clean references', () => {
      const content = 'Content[1] with references[2]';
      const result = prepareContentForPublication(content);
      expect(result).not.toContain('[1]');
      expect(result).not.toContain('[2]');
    });

    it('should normalize excessive newlines', () => {
      const content = 'Line 1\n\n\n\n\nLine 2';
      const result = prepareContentForPublication(content);
      expect(result).toBe('Line 1\n\nLine 2');
    });

    it('should apply all transformations', () => {
      const content = '# Title\n\n\n\nContent[1][2]\n\n\n\n## Fontes\n\nSource';
      const result = prepareContentForPublication(content);
      expect(result).toBe('Content');
    });

    it('should trim final result', () => {
      const content = '   # Title\n\nContent   ';
      const result = prepareContentForPublication(content);
      expect(result).toBe('Content');
    });
  });
});
