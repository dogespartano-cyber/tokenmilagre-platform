/**
 * Validador de Conteúdo de Artigos
 *
 * Valida se o conteúdo gerado pela IA segue as regras da skill article-creation
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * Valida conteúdo de artigo (news ou educational)
 */
export function validateArticleContent(
  content: string,
  type: 'news' | 'educational'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      errors: ['Conteúdo vazio'],
      warnings: [],
      score: 0
    };
  }

  const trimmedContent = content.trim();

  // =====================================
  // VALIDAÇÕES CRÍTICAS (ERRORS)
  // =====================================

  // 1. NÃO deve começar com H1
  if (trimmedContent.startsWith('# ')) {
    errors.push('❌ Conteúdo começa com H1 (# Título) - PROIBIDO. Deve começar com ## (H2)');
    score -= 20;
  }

  // 2. Verificar tamanho mínimo
  if (trimmedContent.length < 500) {
    errors.push(`❌ Conteúdo muito curto (${trimmedContent.length} caracteres, mínimo 500)`);
    score -= 20;
  }

  // 3. Detectar seção de fontes/referências
  const lowerContent = trimmedContent.toLowerCase();
  if (
    lowerContent.includes('**fontes:**') ||
    lowerContent.includes('## fontes') ||
    lowerContent.includes('## referências') ||
    lowerContent.includes('## sources') ||
    lowerContent.includes('**referências:**')
  ) {
    errors.push('❌ Seção de fontes/referências detectada - PROIBIDO');
    score -= 15;
  }

  // 4. Detectar nota de transparência no conteúdo
  if (
    trimmedContent.includes('📊 Nota de Transparência') ||
    trimmedContent.includes('Nota de Transparência') ||
    lowerContent.includes('## transparência')
  ) {
    errors.push('❌ Nota de transparência no conteúdo - PROIBIDO (template adiciona automaticamente)');
    score -= 10;
  }

  // =====================================
  // VALIDAÇÕES ESPECÍFICAS POR TIPO
  // =====================================

  if (type === 'news') {
    // Notícias DEVEM começar com H2
    if (!trimmedContent.startsWith('## ')) {
      errors.push('❌ Notícia deve começar direto com ## (H2), não com parágrafo');
      score -= 15;
    }

    // Contar seções H2
    const h2Matches = trimmedContent.match(/^## .+$/gm);
    const h2Count = h2Matches ? h2Matches.length : 0;

    if (h2Count < 4) {
      errors.push(`❌ Apenas ${h2Count} seções H2 encontradas (mínimo 4 para notícias)`);
      score -= 20;
    } else if (h2Count > 7) {
      warnings.push(`⚠️ ${h2Count} seções H2 encontradas (recomendado 5-6, máximo 7)`);
      score -= 5;
    }

    // Detectar títulos genéricos
    const genericTitles = ['introdução', 'desenvolvimento', 'conclusão', 'informações'];
    genericTitles.forEach(title => {
      const regex = new RegExp(`^## ${title}`, 'gmi');
      if (regex.test(trimmedContent)) {
        warnings.push(`⚠️ Título genérico detectado: "${title}" (use títulos descritivos)`);
        score -= 5;
      }
    });

  } else if (type === 'educational') {
    // Artigos educacionais PODEM começar com parágrafo introdutório
    // Mas devem ter pelo menos 1 H2
    const h2Matches = trimmedContent.match(/^## .+$/gm);
    const h2Count = h2Matches ? h2Matches.length : 0;

    if (h2Count === 0) {
      errors.push('❌ Artigo educacional deve ter pelo menos 1 seção ## (H2)');
      score -= 15;
    }
  }

  // =====================================
  // VALIDAÇÕES DE QUALIDADE (WARNINGS)
  // =====================================

  // 5. Detectar referências numéricas [1], [2], etc
  const numericRefs = trimmedContent.match(/\[\d+\]/g);
  if (numericRefs && numericRefs.length > 0) {
    warnings.push(`⚠️ ${numericRefs.length} referências numéricas detectadas (ex: [1], [2]) - devem ser removidas`);
    score -= 5;
  }

  // 6. Verificar densidade de seções
  const totalH2AndH3 = (trimmedContent.match(/^#{2,3} /gm) || []).length;
  if (totalH2AndH3 === 0) {
    warnings.push('⚠️ Nenhuma seção (## ou ###) encontrada - estrutura pode estar incorreta');
    score -= 10;
  }

  // 7. Verificar se tem conteúdo além de títulos
  const lines = trimmedContent.split('\n').filter(l => l.trim().length > 0);
  const titleLines = lines.filter(l => l.trim().match(/^#{1,3} /));
  const contentLines = lines.length - titleLines.length;

  if (contentLines < 10) {
    warnings.push('⚠️ Pouco conteúdo textual (muitos títulos, pouco texto)');
    score -= 10;
  }

  // 8. Verificar tamanho máximo razoável (evitar conteúdo excessivo)
  if (trimmedContent.length > 15000) {
    warnings.push(`⚠️ Conteúdo muito longo (${trimmedContent.length} caracteres, recomendado <15000)`);
    score -= 5;
  }

  // =====================================
  // RESULTADO FINAL
  // =====================================

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, Math.min(100, score))
  };
}

/**
 * Formata resultado da validação para exibição
 */
export function formatValidationResult(result: ValidationResult): string {
  const parts: string[] = [];

  if (result.errors.length > 0) {
    parts.push('**Erros Críticos:**');
    result.errors.forEach(err => parts.push(err));
  }

  if (result.warnings.length > 0) {
    if (parts.length > 0) parts.push('');
    parts.push('**Avisos:**');
    result.warnings.forEach(warn => parts.push(warn));
  }

  if (result.isValid) {
    parts.push('');
    parts.push(`✅ **Validação aprovada!** Score: ${result.score}/100`);
  } else {
    parts.push('');
    parts.push(`❌ **Validação falhou.** Score: ${result.score}/100`);
  }

  return parts.join('\n');
}
