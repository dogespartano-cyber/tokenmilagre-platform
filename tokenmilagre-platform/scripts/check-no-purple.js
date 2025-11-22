/**
 * Script de Verificação: Ausência de Cores Roxas
 *
 * Este script verifica se há cores roxas (purple, violet, magenta) no código
 *
 * Uso: node scripts/check-no-purple.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Cores roxas a serem detectadas (valores HEX aproximados)
const PURPLE_PATTERNS = [
  // Hexadecimais roxos comuns
  /#[0-9a-fA-F]{3,8}/g, // Todos os hexadecimais para análise
  // Palavras-chave
  /purple/gi,
  /violet/gi,
  /magenta/gi,
  /indigo/gi, // Indigo pode ser roxo dependendo do tom
  /orchid/gi,
  /plum/gi,
  /lavender/gi,

  // Tailwind classes roxas
  /bg-purple/gi,
  /text-purple/gi,
  /border-purple/gi,
  /bg-violet/gi,
  /text-violet/gi,
  /border-violet/gi,
  /bg-fuchsia/gi,
  /text-fuchsia/gi,
  /border-fuchsia/gi,
];

// Hexadecimais roxos específicos do projeto antigo
const SPECIFIC_PURPLE_HEXES = [
  '#6a0572',  // Roxo profundo usado anteriormente
  '#8b5cf6',  // Violet-500
  '#7c3aed',  // Violet-600
  '#a855f7',  // Fuchsia-500
  '#9333ea',  // Purple-600
];

/**
 * Verifica se uma cor hex é roxa
 * Roxo geralmente está na faixa: R < 200, G < 150, B > 150
 */
function isPurpleHex(hex) {
  // Remove # e converte para RGB
  const cleanHex = hex.replace('#', '');

  let r, g, b;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return false;
  }

  // Heurística para detectar roxo:
  // - Blue (b) maior que Red (r)
  // - Blue (b) significativamente maior que Green (g)
  // - Red (r) > Green (g) geralmente
  const isBlueish = b > r && b > g;
  const hasRedTinge = r > g;
  const blueDominant = b > 150;

  return isBlueish && hasRedTinge && blueDominant;
}

/**
 * Busca cores roxas em um arquivo
 */
function checkFileForPurple(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  const lines = content.split('\n');

  // Verificar hexadecimais específicos
  SPECIFIC_PURPLE_HEXES.forEach(purpleHex => {
    const regex = new RegExp(purpleHex.replace('#', '#?'), 'gi');
    lines.forEach((line, index) => {
      if (regex.test(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          color: purpleHex,
          snippet: line.trim(),
          severity: 'high'
        });
      }
    });
  });

  // Verificar palavras-chave roxas
  const keywordPatterns = [/purple/gi, /violet/gi, /magenta/gi, /indigo/gi, /fuchsia/gi];
  keywordPatterns.forEach(pattern => {
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          color: pattern.source,
          snippet: line.trim(),
          severity: 'medium'
        });
      }
    });
  });

  // Verificar todos os hexadecimais se são roxos
  lines.forEach((line, index) => {
    const hexMatches = line.match(/#[0-9a-fA-F]{3,6}/g);
    if (hexMatches) {
      hexMatches.forEach(hex => {
        if (isPurpleHex(hex)) {
          violations.push({
            file: filePath,
            line: index + 1,
            color: hex,
            snippet: line.trim(),
            severity: 'medium'
          });
        }
      });
    }
  });

  return violations;
}

/**
 * Função principal
 */
function main() {
  console.log('🔍 Verificando ausência de cores roxas...\n');

  const filesToCheck = [
    ...glob.sync('app/**/*.{tsx,ts,jsx,js,css}', { cwd: process.cwd() }),
    ...glob.sync('components/**/*.{tsx,ts,jsx,js,css}', { cwd: process.cwd() }),
    ...glob.sync('styles/**/*.{css,scss}', { cwd: process.cwd() }),
  ];

  let allViolations = [];

  filesToCheck.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const violations = checkFileForPurple(fullPath);
      if (violations.length > 0) {
        allViolations = allViolations.concat(violations);
      }
    }
  });

  // Remover duplicatas
  const uniqueViolations = Array.from(
    new Map(allViolations.map(v => [`${v.file}:${v.line}:${v.color}`, v])).values()
  );

  if (uniqueViolations.length === 0) {
    console.log('✅ Nenhuma cor roxa detectada! O projeto está limpo.\n');
    process.exit(0);
  } else {
    console.log(`❌ Encontradas ${uniqueViolations.length} ocorrências de cores roxas:\n`);

    // Agrupar por arquivo
    const byFile = uniqueViolations.reduce((acc, v) => {
      if (!acc[v.file]) acc[v.file] = [];
      acc[v.file].push(v);
      return acc;
    }, {});

    Object.entries(byFile).forEach(([file, violations]) => {
      console.log(`📁 ${file}`);
      violations.forEach(v => {
        const severity = v.severity === 'high' ? '🔴' : '🟡';
        console.log(`   ${severity} Linha ${v.line}: ${v.color}`);
        console.log(`      ${v.snippet.substring(0, 80)}${v.snippet.length > 80 ? '...' : ''}`);
      });
      console.log('');
    });

    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  main();
}

module.exports = { checkFileForPurple, isPurpleHex };
