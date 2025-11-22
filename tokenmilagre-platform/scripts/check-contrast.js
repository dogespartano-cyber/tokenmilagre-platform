/**
 * Script de Verificação: Contraste WCAG AA
 *
 * Verifica se as combinações de cores atendem aos requisitos WCAG AA
 * - Texto normal: razão de contraste mínima de 4.5:1
 * - Texto grande (18pt+): razão de contraste mínima de 3:1
 *
 * Uso: node scripts/check-contrast.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Converte HEX para RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcula luminância relativa
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula razão de contraste entre duas cores
 * https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verifica se o contraste atende aos requisitos WCAG
 */
function meetsWCAG(ratio, level = 'AA', size = 'normal') {
  if (level === 'AA') {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  } else if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  return false;
}

/**
 * Testa combinações de cores do projeto
 */
function testColorCombinations() {
  const designTokensPath = path.join(process.cwd(), 'styles/design-tokens.css');

  if (!fs.existsSync(designTokensPath)) {
    console.log('⚠️  Arquivo design-tokens.css não encontrado. Usando cores padrão do projeto.\n');
  }

  // Combinações críticas a serem testadas
  const combinations = [
    // Light mode
    {
      name: 'Texto primário em fundo claro',
      foreground: '#2F3942',  // --text-primary
      background: '#F5F7F8',  // --bg-page
      size: 'normal',
      context: 'Body text em light mode'
    },
    {
      name: 'Texto secundário em fundo claro',
      foreground: '#5A6772',  // --text-secondary
      background: '#F5F7F8',  // --bg-page
      size: 'normal',
      context: 'Secondary text em light mode'
    },
    {
      name: 'Accent verde em fundo claro',
      foreground: '#147A5C',  // --color-accent (ajustado para WCAG AA)
      background: '#F5F7F8',  // --bg-page
      size: 'normal',
      context: 'Links e CTAs em light mode'
    },
    {
      name: 'Primary azul em fundo claro',
      foreground: '#0B4A6F',  // --color-primary
      background: '#F5F7F8',  // --bg-page
      size: 'normal',
      context: 'Primary color em light mode'
    },
    {
      name: 'Branco em Accent (botão primário)',
      foreground: '#FFFFFF',  // white
      background: '#147A5C',  // --color-accent (ajustado para WCAG AA)
      size: 'normal',
      context: 'Texto em botão primário'
    },
    {
      name: 'Branco em Primary (botão secundário)',
      foreground: '#FFFFFF',  // white
      background: '#0B4A6F',  // --color-primary
      size: 'normal',
      context: 'Texto em botão secundário'
    },

    // Dark mode
    {
      name: 'Texto primário em fundo escuro',
      foreground: '#F5F7F8',  // --text-primary dark
      background: '#121212',  // --bg-page dark
      size: 'normal',
      context: 'Body text em dark mode'
    },
    {
      name: 'Texto secundário em fundo escuro',
      foreground: '#C4CDD5',  // --text-secondary dark
      background: '#121212',  // --bg-page dark
      size: 'normal',
      context: 'Secondary text em dark mode'
    },
    {
      name: 'Accent verde em fundo escuro',
      foreground: '#22B286',  // --color-accent dark
      background: '#121212',  // --bg-page dark
      size: 'normal',
      context: 'Links e CTAs em dark mode'
    },
    {
      name: 'Accent verde em card escuro',
      foreground: '#22B286',  // --color-accent dark
      background: '#1A2027',  // --bg-card dark
      size: 'normal',
      context: 'Links em cards dark mode'
    },
  ];

  console.log('🎨 Verificando contraste de cores WCAG AA...\n');

  const failures = [];
  const passes = [];

  combinations.forEach(combo => {
    const ratio = getContrastRatio(combo.foreground, combo.background);

    if (ratio === null) {
      console.log(`⚠️  Não foi possível calcular contraste para: ${combo.name}`);
      return;
    }

    const meetsAA = meetsWCAG(ratio, 'AA', combo.size);
    const meetsAAA = meetsWCAG(ratio, 'AAA', combo.size);

    const result = {
      ...combo,
      ratio: ratio.toFixed(2),
      meetsAA,
      meetsAAA,
    };

    if (meetsAA) {
      passes.push(result);
    } else {
      failures.push(result);
    }
  });

  // Exibir resultados
  if (passes.length > 0) {
    console.log('✅ COMBINAÇÕES QUE ATENDEM WCAG AA:\n');
    passes.forEach(p => {
      const level = p.meetsAAA ? 'AAA' : 'AA';
      console.log(`   ${p.name}`);
      console.log(`   FG: ${p.foreground} / BG: ${p.background}`);
      console.log(`   Razão: ${p.ratio}:1 (${level}) - ${p.context}`);
      console.log('');
    });
  }

  if (failures.length > 0) {
    console.log('❌ COMBINAÇÕES QUE NÃO ATENDEM WCAG AA:\n');
    failures.forEach(f => {
      console.log(`   ${f.name}`);
      console.log(`   FG: ${f.foreground} / BG: ${f.background}`);
      console.log(`   Razão: ${f.ratio}:1 (mínimo: ${f.size === 'large' ? '3:1' : '4.5:1'})`);
      console.log(`   Contexto: ${f.context}`);
      console.log('');
    });

    console.log(`\n❌ ${failures.length} combinação(ões) não atende(m) WCAG AA. Ajuste as cores.\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ Todas as ${passes.length} combinações atendem WCAG AA!\n`);
    process.exit(0);
  }
}

// Executar
if (require.main === module) {
  testColorCombinations();
}

module.exports = { getContrastRatio, meetsWCAG, hexToRgb, getLuminance };
