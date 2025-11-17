# Token Milagre - URL Security Skill

**Use esta skill quando**: Implementar verificação de URLs, proteção contra phishing, detecção de scams, ou adicionar segurança de links em qualquer parte do site.

---

## 🎯 Objetivo

Proteger usuários do Token Milagre contra links maliciosos (phishing, scams, fake exchanges) através de verificação híbrida (local + API) com modais educativos.

---

## 🏗️ Arquitetura - Abordagem Híbrida

### Fluxo de Verificação

```
Usuário clica em link externo
  ↓
LinkInterceptor captura evento
  ↓
1️⃣ VERIFICAÇÃO LOCAL (< 5ms)
  ├─ Blacklist de domínios conhecidos
  ├─ Pattern matching (typosquatting, unicode)
  ├─ Whitelist (sites confiáveis)
  └─ Se encontrado → Modal de Aviso
  ↓
2️⃣ VERIFICAÇÃO CACHE (< 10ms)
  └─ Verifica resultado anterior no localStorage
  ↓
3️⃣ VERIFICAÇÃO API (200-500ms)
  ├─ Google Safe Browsing API
  ├─ Cache resultado (7 dias)
  └─ Modal se malicioso
  ↓
Continuar navegação ou bloquear
```

### Nível de Proteção

- ✅ **Bloquear**: Phishing confirmado, malware, scams críticos
- ⚠️ **Avisar**: Domínios suspeitos, typosquatting, recém-registrados
- 💡 **Educar**: Sempre explicar O QUE é o risco e COMO identificar

---

## 📂 Estrutura de Arquivos

```
tokenmilagre-platform/
├── app/
│   ├── seguranca/verificador-url/
│   │   └── page.tsx              # Página pública de verificação
│   ├── api/check-url/
│   │   └── route.ts              # API híbrida (local + Google)
│   └── components/
│       ├── LinkInterceptor.tsx       # HOC para interceptar links
│       ├── URLWarningModal.tsx       # Modal educativo
│       └── URLVerifierForm.tsx       # Form da página pública
├── lib/url-security/
│   ├── patterns.ts               # Detecção de patterns maliciosos
│   ├── cache.ts                  # Cache de verificações
│   ├── google-safe-browsing.ts   # Client da API Google
│   └── crypto-domains.ts         # Conhecimento de domínios cripto
└── lib/data/
    ├── crypto-scam-domains.json  # Blacklist atualizada
    └── crypto-trusted-domains.json # Whitelist (binance, etc)
```

---

## 🔧 Componentes Principais

### 1. LinkInterceptor (Componente Reutilizável)

**Uso**: Wrapper para interceptar clicks em links externos

```tsx
<LinkInterceptor>
  <ArticleContent content={article.content} />
</LinkInterceptor>
```

**Props**:
- `children: ReactNode` - Conteúdo com links
- `enabled?: boolean` - Ativar/desativar (default: true)
- `onBlock?: (url: string) => void` - Callback ao bloquear
- `showEducationalTips?: boolean` - Mostrar dicas educativas

**Features**:
- Detecta apenas links **externos** (não token-milagre.com)
- Intercepta `onClick` automaticamente
- Mostra modal antes de redirecionar
- Cache de resultados no client

---

### 2. URLWarningModal (Modal Educativo)

```tsx
type ThreatLevel = 'critical' | 'warning' | 'suspicious'

interface URLThreat {
  url: string
  level: ThreatLevel
  reasons: string[]          // ["Typosquatting de binance.com"]
  educationalTip: string     // Dica de como identificar
  source: 'local' | 'api'    // De onde veio a detecção
  similarLegitDomain?: string // "Você quis dizer binance.com?"
}
```

**Estados**: Critical (vermelho), Warning (amarelo), Suspicious (laranja)

---

### 3. API /api/check-url (Híbrida)

**Endpoint**: `POST /api/check-url`

**Request**:
```json
{
  "url": "https://binanse.com/trade"
}
```

**Response**:
```json
{
  "safe": false,
  "threat": {
    "level": "critical",
    "reasons": [
      "Typosquatting de binance.com",
      "Domínio na blacklist"
    ],
    "educationalTip": "Phishing usa sites falsos para roubar credenciais...",
    "similarLegitDomain": "binance.com",
    "source": "local+api"
  },
  "cached": false,
  "checkedAt": "2025-11-10T14:30:00Z"
}
```

**Verificações (em ordem)**:

1. **Whitelist** (retorna safe imediatamente)
2. **Blacklist Local** (crypto-scam-domains.json)
3. **Pattern Detection** (typosquatting, unicode, homograph, domínios novos)
4. **Cache Check** (Prisma DB, TTL: 7 dias)
5. **Google Safe Browsing API** (malware, phishing)

**Rate Limiting**: Max 10 verificações/minuto por IP

---

## 🗄️ Schema Prisma

```prisma
model URLVerification {
  id          String   @id @default(cuid())
  url         String   @unique
  domain      String   @db.Text

  safe        Boolean
  threatLevel String?  // 'critical' | 'warning' | 'suspicious'
  reasons     String[]
  source      String   // 'local' | 'api' | 'user_report'

  checkedAt   DateTime @default(now())
  expiresAt   DateTime // TTL de 7 dias

  checksCount Int      @default(1)
  blockedCount Int     @default(0)

  @@index([domain])
  @@index([expiresAt])
}

model UserURLReport {
  id          String   @id @default(cuid())
  url         String
  reportedBy  String?  // User ID (opcional, anônimo)
  reason      String
  description String?
  createdAt   DateTime @default(now())

  @@index([url])
}
```

---

## 📊 Listas de Domínios

### crypto-scam-domains.json
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-10",
  "sources": ["CryptoScamDB", "PhishTank", "Comunidade Token Milagre"],
  "domains": [
    {
      "domain": "binanse.com",
      "type": "typosquatting",
      "legitimate": "binance.com",
      "severity": "critical"
    }
  ]
}
```

### crypto-trusted-domains.json
```json
{
  "exchanges": ["binance.com", "coinbase.com", "kraken.com"],
  "wallets": ["metamask.io", "phantom.app", "ledger.com"],
  "news": ["coindesk.com", "cointelegraph.com"],
  "official": ["bitcoin.org", "ethereum.org"]
}
```

---

## 🎨 Página /seguranca/verificador-url

### Features

1. **Form de Verificação Manual** - Input + botão verificar
2. **Guia Educativo** - Como identificar phishing
3. **Estatísticas em Tempo Real** - URLs verificadas, ameaças bloqueadas
4. **Report Form** - Usuários reportam URLs suspeitas

---

## 🔍 Pattern Detection - Algoritmos Core

### 1. Typosquatting Detection
```typescript
// Levenshtein distance para detectar similaridade
function isTyposquatting(domain: string, legitDomain: string): boolean {
  const distance = levenshtein(domain, legitDomain)
  const threshold = Math.max(2, legitDomain.length * 0.2)
  return distance <= threshold
}
// Exemplos: binanse.com ≈ binance.com (distance: 1)
```

### 2. Homograph Attack Detection
```typescript
// Detecta caracteres Unicode que parecem ASCII
function hasHomographChars(domain: string): boolean {
  const homographs = { 'а': 'a', 'е': 'e', 'о': 'o' } // Cirílico
  return domain.split('').some(char => char in homographs)
}
// Exemplo: metamаsk.io (а cirílico)
```

### 3. Suspicious Pattern Detection
```typescript
interface SuspiciousPatterns {
  keywords: string[]      // ["free", "giveaway", "double"]
  tlds: string[]          // [".tk", ".ml", ".ga"] (free TLDs)
  lengthThreshold: number // Domínios muito longos
}
```

---

## 🚀 Implementação Progressiva

### Fase 1: MVP
- ✅ Página /seguranca/verificador-url
- ✅ LinkInterceptor component
- ✅ API check-url (híbrida)
- ✅ Modal de aviso
- ✅ Listas local (blacklist/whitelist)
- ✅ Pattern detection básico

### Fase 2: Expansão (Futuro)
- [ ] Adicionar em artigos/notícias
- [ ] Google Safe Browsing API integração
- [ ] Dashboard admin de URLs reportadas

### Fase 3: Comunidade (Futuro)
- [ ] Sistema de report de usuários
- [ ] Votação comunitária
- [ ] API pública para developers

---

## 🎓 Conteúdo Educativo dos Modais

### Typosquatting
```
💡 O que é Typosquatting?
Golpistas registram domínios com pequenos erros de digitação.

Exemplo: binanse.com (FALSO) vs binance.com (VERDADEIRO)

Como se Proteger:
1. Confira domínio letra por letra
2. Use bookmarks para sites importantes
3. Ative 2FA em todas as exchanges
```

### Homograph Attack
```
💡 O que é Ataque Homográfico?
Caracteres Unicode que PARECEM iguais mas são diferentes.

Exemplo: metаmask.io (а cirílico) vs metamask.io (a latino)

Como se Proteger:
1. Use extensões anti-phishing
2. Copie/cole URLs de fontes oficiais
3. Verifique certificado SSL (cadeado)
```

---

## 📊 Analytics & Monitoring

```typescript
interface URLSecurityMetrics {
  // Performance
  averageCheckTime: number
  cacheHitRate: number
  apiCallsToday: number

  // Segurança
  threatsBlockedToday: number
  threatsByLevel: { critical: number, warning: number, suspicious: number }
  topMaliciousDomains: Array<{domain: string, count: number}>

  // Usuários
  uniqueUsersProtected: number
  urlsReportedByUsers: number
}
```

---

## ⚙️ Configuração - Google Safe Browsing

### Setup
1. Criar API Key em https://console.cloud.google.com/
2. Ativar "Safe Browsing API"
3. Environment Variables:
```env
GOOGLE_SAFE_BROWSING_API_KEY=AIzaSy...
GOOGLE_SAFE_BROWSING_ENABLED=true
```

### Rate Limits
- Grátis: 10.000 requests/dia
- Fallback: Continuar com verificação local se API falhar

---

## 🧪 Testing Strategy

```typescript
describe('Pattern Detection', () => {
  it('deve detectar typosquatting', () => {
    expect(isTyposquatting('binanse.com', 'binance.com')).toBe(true)
  })

  it('deve detectar homograph', () => {
    expect(hasHomographChars('metаmask.io')).toBe(true)
  })
})

describe('API /api/check-url', () => {
  it('deve retornar safe para whitelist', async () => {
    const result = await checkURL('https://binance.com')
    expect(result.safe).toBe(true)
  })

  it('deve detectar blacklist', async () => {
    const result = await checkURL('https://binanse.com')
    expect(result.safe).toBe(false)
    expect(result.threat?.level).toBe('critical')
  })
})
```

---

## 📝 Manutenção

### Atualização de Listas

**Frequência**: Semanal

**Fontes**:
- CryptoScamDB (https://cryptoscamdb.org/api)
- PhishTank (https://phishtank.org/)
- Reportes da comunidade Token Milagre

**Processo**:
1. Script `scripts/update-scam-list.ts`
2. Fetch de APIs externas
3. Merge com reportes de usuários
4. Validação manual (admin review)
5. Deploy

### Monitoramento
- **Falsos Positivos**: Usuários podem reportar
- **Falsos Negativos**: Botão "Reportar Scam"
- **API Quota**: Alertar ao atingir 80% do limite

---

## 🎯 Métricas de Sucesso

- **Taxa de Bloqueio**: > 95% de scams conhecidos bloqueados
- **Falsos Positivos**: < 1% de sites legítimos bloqueados
- **Engajamento**: > 50% de usuários leem dicas educativas
- **Performance**: < 100ms para verificação local, < 500ms total

---

## 🔗 Integração com Outras Páginas

### Em Artigos (Futuro)
```tsx
import LinkInterceptor from '@/app/components/LinkInterceptor'

export default function NewsArticle({ article }) {
  return (
    <LinkInterceptor>
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </LinkInterceptor>
  )
}
```

### Em Comentários (Futuro)
```tsx
<LinkInterceptor showEducationalTips={true}>
  {comments.map(comment => (
    <Comment key={comment.id} content={comment.text} />
  ))}
</LinkInterceptor>
```

---

## 📚 Recursos Adicionais

**Links Úteis**:
- [Google Safe Browsing API Docs](https://developers.google.com/safe-browsing)
- [CryptoScamDB](https://cryptoscamdb.org/)
- [PhishTank](https://phishtank.org/)
- [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance)

**Referências**:
- OWASP: URL Validation Best Practices
- W3C: Content Security Policy
- NIST: Phishing Detection Guidelines

---

## 🎉 Benefícios para a Comunidade

1. **Proteção Real**: Bloqueia ameaças antes do dano
2. **Educação Contínua**: Ensina a identificar scams
3. **Confiança**: Token Milagre = site seguro
4. **Comunidade Ativa**: Usuários reportam ameaças
5. **Transparência**: Open source, código auditável

---

**Skill criada por**: Claude Code
**Last Updated**: 2025-11-17
**Version**: 2.0.0
**Status**: ✅ Pronta para implementação

**Mudanças recentes:**
- ✅ **OTIMIZAÇÃO**: 792 → 398 linhas (-50%)
- ✅ Condensado exemplos verbosos (JSON, modais, casos de uso)
- ✅ Removido redundâncias (casos críticos duplicavam conteúdo)
- ✅ Mantido arquitetura core e algoritmos essenciais
- ✅ Foco em padrões reutilizáveis vs exemplos excessivos

---

**Missão**: Fazer do Token Milagre o site mais seguro de cripto em português 🛡️
