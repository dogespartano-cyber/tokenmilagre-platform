import { extractClaims, hasEnoughClaims, type Claim } from './gemini-claims';
import { searchMultipleSources, hasSearchAPIsConfigured, getConfiguredAPIs, type SearchResult } from './search-providers';

// Thresholds de verificação (configuráveis)
// 1. CLAIM_VERIFICATION_THRESHOLD: confiança mínima para considerar um claim "verificado"
// 2. ARTICLE_PUBLICATION_THRESHOLD: score médio mínimo para publicar artigo automaticamente
//    (pode ser sobrescrito por parâmetro em factCheckArticle)
export const CLAIM_VERIFICATION_THRESHOLD = 60; // 60% de confiança por claim
export const ARTICLE_PUBLICATION_THRESHOLD = 70; // 70% score geral para publicação

export interface ClaimVerification {
  claim: Claim;
  verified: boolean;
  confidence: number; // 0-100
  sources: SearchResult[];
  reasoning: string;
}

export interface FactCheckResult {
  passed: boolean; // true se score >= threshold
  score: number; // 0-100
  threshold: number; // threshold usado
  totalClaims: number;
  verifiedClaims: number;
  failedClaims: number;
  verifications: ClaimVerification[];
  sources: string[]; // Lista de URLs únicos consultados
  checkedAt: Date;
  searchAPIsUsed: string[];
  status: 'verified' | 'failed' | 'skipped';
}

/**
 * Verifica um claim individual buscando em múltiplas fontes
 */
async function verifyClaim(claim: Claim): Promise<ClaimVerification> {
  try {
    // Buscar informações sobre o claim
    const searchResults = await searchMultipleSources(claim.searchQuery);

    // Se não encontrou nenhum resultado, claim não pôde ser verificado
    if (searchResults.results.length === 0) {
      return {
        claim,
        verified: false,
        confidence: 0,
        sources: [],
        reasoning: 'Nenhuma fonte encontrada para verificar esta informação'
      };
    }

    // Calcular confiança baseado em:
    // 1. Número de fontes encontradas (mais fontes = mais confiança)
    // 2. Diversidade de fontes (Google + Brave = mais confiança)
    const sourceCount = searchResults.results.length;
    const hasMultipleProviders = new Set(searchResults.results.map(r => r.source)).size > 1;

    let confidence = 0;

    // Base: número de fontes (máximo 60 pontos)
    confidence += Math.min(sourceCount * 12, 60);

    // Bonus: múltiplos provedores (+20 pontos)
    if (hasMultipleProviders) {
      confidence += 20;
    }

    // Bonus: claim de alta importância (+20 pontos)
    if (claim.importance === 'high') {
      confidence += 20;
    }

    // Limitar a 100
    confidence = Math.min(confidence, 100);

    // IMPORTANTE: Dois níveis de threshold
    // 1. Claim individual "verificado": confiança >= 60%
    //    (indica que encontramos fontes suficientes para este claim)
    // 2. Artigo aprovado para publicação: score geral >= 70%
    //    (definido no watcher, baseado na média de todos os claims)
    const CLAIM_VERIFICATION_THRESHOLD = 60;
    const verified = confidence >= CLAIM_VERIFICATION_THRESHOLD;

    return {
      claim,
      verified,
      confidence,
      sources: searchResults.results,
      reasoning: verified
        ? `Verificado com ${sourceCount} fonte(s) em ${hasMultipleProviders ? 'múltiplos' : 'um'} provedor(es)`
        : `Baixa confiança: apenas ${sourceCount} fonte(s) encontrada(s)`
    };
  } catch (error) {
    console.error('Erro ao verificar claim:', error);
    return {
      claim,
      verified: false,
      confidence: 0,
      sources: [],
      reasoning: 'Erro ao verificar claim'
    };
  }
}

/**
 * Realiza fact-checking completo de um artigo
 */
export async function factCheckArticle(
  articleContent: string,
  articleTitle: string,
  options: {
    threshold?: number; // Score mínimo para passar (0-100, padrão: ARTICLE_PUBLICATION_THRESHOLD)
    maxClaims?: number; // Máximo de claims para verificar (padrão: 10)
  } = {}
): Promise<FactCheckResult> {
  const threshold = options.threshold || ARTICLE_PUBLICATION_THRESHOLD;
  const maxClaims = options.maxClaims || 10;

  // Verificar se APIs de busca estão configuradas
  if (!hasSearchAPIsConfigured()) {
    console.warn('Nenhuma API de busca configurada. Fact-checking será pulado.');
    return {
      passed: true, // Não bloquear publicação se APIs não configuradas
      score: 0,
      threshold,
      totalClaims: 0,
      verifiedClaims: 0,
      failedClaims: 0,
      verifications: [],
      sources: [],
      checkedAt: new Date(),
      searchAPIsUsed: [],
      status: 'skipped'
    };
  }

  try {
    // 1. Extrair claims do artigo
    console.log('📋 Extraindo claims do artigo...');
    const claimsResult = await extractClaims(articleContent, articleTitle);

    // Se não há claims factuais suficientes, aprovar automaticamente
    if (!hasEnoughClaims(claimsResult)) {
      console.log('ℹ️  Artigo não possui claims factuais verificáveis.');
      return {
        passed: true,
        score: 100, // Artigo sem claims factuais = aprovado
        threshold,
        totalClaims: 0,
        verifiedClaims: 0,
        failedClaims: 0,
        verifications: [],
        sources: [],
        checkedAt: new Date(),
        searchAPIsUsed: getConfiguredAPIs(),
        status: 'verified'
      };
    }

    // Limitar número de claims a verificar
    const claimsToVerify = claimsResult.claims.slice(0, maxClaims);
    console.log(`🔍 Verificando ${claimsToVerify.length} claim(s)...`);

    // 2. Verificar cada claim em paralelo
    const verifications = await Promise.all(
      claimsToVerify.map(claim => verifyClaim(claim))
    );

    // 3. Calcular estatísticas
    const verifiedClaims = verifications.filter(v => v.verified).length;
    const failedClaims = verifications.filter(v => !v.verified).length;

    // 4. Calcular score geral (média de confiança de todos os claims)
    const totalConfidence = verifications.reduce((sum, v) => sum + v.confidence, 0);
    const score = verifications.length > 0
      ? Math.round(totalConfidence / verifications.length)
      : 0;

    // 5. Coletar todas as fontes únicas consultadas
    const allSources = verifications
      .flatMap(v => v.sources.map(s => s.url))
      .filter((url, index, self) => self.indexOf(url) === index); // Remover duplicatas

    // 6. Determinar se passou no fact-check
    const passed = score >= threshold;

    console.log(`✅ Fact-check concluído: ${passed ? 'APROVADO' : 'REPROVADO'} (Score: ${score}/${threshold})`);

    return {
      passed,
      score,
      threshold,
      totalClaims: claimsToVerify.length,
      verifiedClaims,
      failedClaims,
      verifications,
      sources: allSources,
      checkedAt: new Date(),
      searchAPIsUsed: getConfiguredAPIs(),
      status: passed ? 'verified' : 'failed'
    };
  } catch (error) {
    console.error('❌ Erro ao realizar fact-checking:', error);

    // Em caso de erro, não bloquear publicação
    return {
      passed: true,
      score: 0,
      threshold,
      totalClaims: 0,
      verifiedClaims: 0,
      failedClaims: 0,
      verifications: [],
      sources: [],
      checkedAt: new Date(),
      searchAPIsUsed: getConfiguredAPIs(),
      status: 'skipped'
    };
  }
}

/**
 * Gera relatório legível do fact-check
 */
export function generateFactCheckReport(result: FactCheckResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('📊 RELATÓRIO DE FACT-CHECKING');
  lines.push('='.repeat(60));
  lines.push('');

  lines.push(`Status: ${result.passed ? '✅ APROVADO' : '❌ REPROVADO'}`);
  lines.push(`Score: ${result.score}/${result.threshold}`);
  lines.push(`Data: ${result.checkedAt.toLocaleString('pt-BR')}`);
  lines.push(`APIs usadas: ${result.searchAPIsUsed.join(', ') || 'Nenhuma'}`);
  lines.push('');

  lines.push(`Claims analisados: ${result.totalClaims}`);
  lines.push(`✅ Verificados: ${result.verifiedClaims}`);
  lines.push(`❌ Não verificados: ${result.failedClaims}`);
  lines.push('');

  if (result.verifications.length > 0) {
    lines.push('DETALHES DAS VERIFICAÇÕES:');
    lines.push('-'.repeat(60));

    result.verifications.forEach((v, index) => {
      lines.push(`\n${index + 1}. ${v.claim.text}`);
      lines.push(`   Status: ${v.verified ? '✅' : '❌'} | Confiança: ${v.confidence}%`);
      lines.push(`   Fontes: ${v.sources.length}`);
      lines.push(`   Razão: ${v.reasoning}`);
    });
  }

  lines.push('');
  lines.push('='.repeat(60));

  return lines.join('\n');
}
