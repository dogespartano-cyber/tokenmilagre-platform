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

### Nível de Proteção: **Crítico + Educativo**

- ✅ **Bloquear**: Phishing confirmado, malware, scams críticos
- ⚠️ **Avisar**: Domínios suspeitos, typosquatting, recém-registrados
- 💡 **Educar**: Sempre explicar O QUE é o risco e COMO identificar

---

## 📂 Estrutura de Arquivos

```
tokenmilagre-platform/
├── app/
│   ├── seguranca/
│   │   └── verificador-url/
│   │       └── page.tsx              # Página pública de verificação
│   ├── api/
│   │   └── check-url/
│   │       └── route.ts              # API híbrida (local + Google)
│   └── components/
│       ├── LinkInterceptor.tsx       # HOC para interceptar links
│       ├── URLWarningModal.tsx       # Modal educativo
│       └── URLVerifierForm.tsx       # Form da página pública
├── lib/
│   ├── url-security/
│   │   ├── patterns.ts               # Detecção de patterns maliciosos
│   │   ├── cache.ts                  # Cache de verificações
│   │   ├── google-safe-browsing.ts   # Client da API Google
│   │   └── crypto-domains.ts         # Conhecimento de domínios cripto
│   └── data/
│       ├── crypto-scam-domains.json  # Blacklist atualizada
│       └── crypto-trusted-domains.json # Whitelist (binance, etc)
└── public/
    └── security-tips/
        └── url-safety.md             # Guia educativo
```

---

## 🔧 Componentes Principais

### 1. **LinkInterceptor** (Componente Reutilizável)

**Uso**: Wrapper para interceptar clicks em links externos

```tsx
// Exemplo de uso futuro em artigos
<LinkInterceptor>
  <ArticleContent content={article.content} />
</LinkInterceptor>

// Exemplo em comentários (futuro)
<LinkInterceptor>
  <CommentsList comments={comments} />
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

### 2. **URLWarningModal** (Modal Educativo)

**Tipos de Aviso**:

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

**Exemplo Visual**:

```
┌─────────────────────────────────────┐
│ 🔴 SITE PERIGOSO DETECTADO          │
├─────────────────────────────────────┤
│                                     │
│ binanse.com                         │
│                                     │
│ 🚨 Ameaças detectadas:              │
│ • Typosquatting de "binance.com"    │
│ • Domínio registrado há 2 dias      │
│ • Reportado como phishing           │
│                                     │
│ 💡 Como Identificar Phishing:       │
│ Golpistas trocam letras para criar  │
│ sites falsos (binanse ≠ binance).   │
│ Sempre confira o domínio completo!  │
│                                     │
│ ✅ Site legítimo: binance.com       │
│                                     │
│ [🛡️ Voltar]  [⚠️ Prosseguir]        │
└─────────────────────────────────────┘
```

**Estados**:
- **Critical** (vermelho): Malware, phishing confirmado
- **Warning** (amarelo): Typosquatting, domínio novo
- **Suspicious** (laranja): Sem HTTPS, reportes de usuários

---

### 3. **API /api/check-url** (Híbrida)

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
      "Domínio na blacklist",
      "Google Safe Browsing: phishing"
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
   - binance.com, coinbase.com, kraken.com, etc.
   - Domínios .gov, .edu verificados

2. **Blacklist Local** (crypto-scam-domains.json)
   - Scams conhecidos da comunidade cripto
   - Atualizado semanalmente

3. **Pattern Detection**:
   - Typosquatting (Levenshtein distance)
   - Unicode lookalikes (а vs a)
   - Homograph attacks
   - Domínios muito novos (< 30 dias)

4. **Cache Check** (Prisma DB)
   - Evita chamar API para mesma URL
   - TTL: 7 dias

5. **Google Safe Browsing API**
   - Malware, phishing, unwanted software
   - Base massiva de ameaças

**Rate Limiting**:
- Max 10 verificações/minuto por IP
- Google API: 10k requests/dia (monitorado)

---

## 🗄️ Schema Prisma

```prisma
model URLVerification {
  id          String   @id @default(cuid())
  url         String   @unique
  domain      String   @db.Text

  safe        Boolean
  threatLevel String?  // 'critical' | 'warning' | 'suspicious'
  reasons     String[] // Array de razões
  source      String   // 'local' | 'api' | 'user_report'

  checkedAt   DateTime @default(now())
  expiresAt   DateTime // TTL de 7 dias

  // Analytics
  checksCount Int      @default(1)
  blockedCount Int     @default(0)

  @@index([domain])
  @@index([expiresAt])
}

model UserURLReport {
  id          String   @id @default(cuid())
  url         String
  reportedBy  String?  // User ID (opcional, pode ser anônimo)
  reason      String   // "Phishing", "Scam", etc.
  description String?

  createdAt   DateTime @default(now())

  @@index([url])
}
```

**Migration**:
```bash
npx prisma migrate dev --name add_url_security
```

---

## 📊 Dados - Listas de Domínios

### **crypto-scam-domains.json**

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-10",
  "sources": [
    "CryptoScamDB",
    "PhishTank",
    "Comunidade Token Milagre"
  ],
  "domains": [
    {
      "domain": "binanse.com",
      "type": "typosquatting",
      "legitimate": "binance.com",
      "addedAt": "2025-11-01",
      "severity": "critical"
    },
    {
      "domain": "metamаsk.io",
      "type": "homograph",
      "legitimate": "metamask.io",
      "note": "Usa 'а' cirílico em vez de 'a' latino",
      "severity": "critical"
    },
    {
      "domain": "free-btc-giveaway.com",
      "type": "scam",
      "severity": "critical"
    }
  ]
}
```

### **crypto-trusted-domains.json**

```json
{
  "exchanges": [
    "binance.com",
    "coinbase.com",
    "kraken.com",
    "kucoin.com"
  ],
  "wallets": [
    "metamask.io",
    "phantom.app",
    "ledger.com"
  ],
  "news": [
    "coindesk.com",
    "cointelegraph.com",
    "decrypt.co"
  ],
  "official": [
    "bitcoin.org",
    "ethereum.org"
  ]
}
```

---

## 🎨 Página /seguranca/verificador-url

### Layout

```
┌──────────────────────────────────────────┐
│         🛡️ VERIFICADOR DE LINKS          │
│                                          │
│  Proteja-se contra phishing e scams     │
│  antes de clicar em links suspeitos     │
│                                          │
│  ┌────────────────────────────────┐     │
│  │ https://exemplo.com            │ 🔍  │
│  └────────────────────────────────┘     │
│                                          │
│  [Verificar Segurança]                  │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  📚 Dicas de Segurança:                 │
│                                          │
│  ✅ Como Identificar Links Seguros      │
│  • Verifique o domínio completo         │
│  • Busque HTTPS (cadeado)               │
│  • Desconfie de erros de ortografia     │
│                                          │
│  ❌ Sinais de Alerta:                    │
│  • Promessas de lucro garantido         │
│  • Urgência ("só hoje!")                │
│  • Pedidos de senha/chave privada       │
│                                          │
│  📊 Estatísticas:                        │
│  • 1.234 URLs verificadas               │
│  • 89 ameaças bloqueadas                │
│  • 156 usuários protegidos              │
│                                          │
│  🚩 Reportar Link Suspeito              │
│                                          │
└──────────────────────────────────────────┘
```

### Features da Página

1. **Form de Verificação Manual**
   - Input de URL
   - Botão "Verificar Segurança"
   - Resultado em tempo real

2. **Guia Educativo**
   - Como identificar phishing
   - Tipos comuns de scams cripto
   - Melhores práticas de segurança

3. **Estatísticas em Tempo Real**
   - Total de URLs verificadas
   - Ameaças bloqueadas hoje
   - Top 5 domínios maliciosos reportados

4. **Report Form**
   - Usuários podem reportar URLs suspeitas
   - Vai para review do admin
   - Comunidade ajuda comunidade

---

## 🔍 Pattern Detection - Algoritmos

### 1. **Typosquatting Detection**

```typescript
// Levenshtein distance para detectar similaridade
function isTyposquatting(domain: string, legitDomain: string): boolean {
  const distance = levenshtein(domain, legitDomain)
  const threshold = Math.max(2, legitDomain.length * 0.2)
  return distance <= threshold
}

// Exemplos detectados:
// binanse.com ≈ binance.com (distance: 1)
// coinbasse.com ≈ coinbase.com (distance: 1)
```

### 2. **Homograph Attack Detection**

```typescript
// Detecta caracteres Unicode que parecem ASCII
function hasHomographChars(domain: string): boolean {
  const homographs = {
    'а': 'a', // Cirílico
    'е': 'e',
    'о': 'o',
    'р': 'p',
    'с': 'c',
    // ... mais mapeamentos
  }

  return domain.split('').some(char => char in homographs)
}

// Exemplo: metamаsk.io (а cirílico)
```

### 3. **Suspicious Pattern Detection**

```typescript
interface SuspiciousPatterns {
  keywords: string[]      // ["free", "giveaway", "double", "airdrop"]
  tlds: string[]          // [".tk", ".ml", ".ga"] (free TLDs)
  lengthThreshold: number // Domínios muito longos
}

// Exemplos detectados:
// free-btc-giveaway.com → "free", "giveaway"
// double-your-bitcoin.tk → "double", ".tk"
```

---

## 🚀 Implementação Progressiva

### **Fase 1: MVP** (Esta sessão)
- ✅ Skill criada
- ✅ Página /seguranca/verificador-url
- ✅ LinkInterceptor component
- ✅ API check-url (híbrida)
- ✅ Modal de aviso
- ✅ Listas local (blacklist/whitelist)
- ✅ Pattern detection básico

### **Fase 2: Expansão** (Futuro)
- [ ] Adicionar em artigos/notícias (conteúdo markdown)
- [ ] Google Safe Browsing API integração
- [ ] Dashboard admin de URLs reportadas
- [ ] Estatísticas públicas
- [ ] Browser extension (futuro distante)

### **Fase 3: Comunidade** (Futuro)
- [ ] Sistema de report de usuários
- [ ] Votação comunitária (URL é scam?)
- [ ] Badge "Verificado pela Comunidade"
- [ ] API pública para developers

---

## 🎓 Educação - Conteúdo dos Modais

### **Modal - Typosquatting**

```
💡 O que é Typosquatting?

Golpistas registram domínios com pequenos erros
de digitação para enganar usuários desatentos.

Exemplo Real:
❌ binanse.com (FALSO - 's' trocado)
✅ binance.com (VERDADEIRO)

Como se Proteger:
1. Sempre confira o domínio letra por letra
2. Use bookmarks para sites importantes
3. Digite URLs manualmente, não clique em links
4. Ative 2FA em todas as exchanges

[Saiba Mais] [Voltar com Segurança]
```

### **Modal - Homograph Attack**

```
💡 O que é Ataque Homográfico?

Caracteres Unicode que PARECEM iguais mas
são diferentes (а cirílico vs a latino).

Exemplo Real:
❌ metаmask.io (FALSO - 'а' cirílico)
✅ metamask.io (VERDADEIRO)

Seu navegador pode mostrar idênticos!

Como se Proteger:
1. Use extensões anti-phishing
2. Copie/cole URLs de fontes oficiais
3. Verifique certificado SSL (cadeado)

[Saiba Mais] [Voltar com Segurança]
```

---

## 📊 Analytics & Monitoring

### **Métricas a Coletar**

```typescript
interface URLSecurityMetrics {
  // Performance
  averageCheckTime: number
  cacheHitRate: number
  apiCallsToday: number

  // Segurança
  threatsBlockedToday: number
  threatsByLevel: {
    critical: number
    warning: number
    suspicious: number
  }
  topMaliciousDomains: Array<{domain: string, count: number}>

  // Usuários
  uniqueUsersProtected: number
  urlsReportedByUsers: number
}
```

### **Dashboard Admin** (Futuro)

- Gráfico de ameaças bloqueadas (últimos 30 dias)
- Top 10 domínios maliciosos tentados
- Taxa de falsos positivos (user feedback)
- Performance da API (tempo de resposta)

---

## ⚙️ Configuração - Google Safe Browsing

### **Setup**

1. **Criar API Key**:
   - https://console.cloud.google.com/
   - Ativar "Safe Browsing API"
   - Criar credenciais (API Key)

2. **Environment Variables**:
```env
GOOGLE_SAFE_BROWSING_API_KEY=AIzaSy...
GOOGLE_SAFE_BROWSING_ENABLED=true
```

3. **Rate Limits**:
   - Grátis: 10.000 requests/dia
   - Monitor via `URLVerification.checksCount`

### **Fallback**

Se API falhar ou atingir limite:
- Continuar com verificação local
- Log de erro silencioso
- Aviso ao admin no dashboard

---

## 🧪 Testing Strategy

### **Unit Tests**

```typescript
describe('Pattern Detection', () => {
  it('deve detectar typosquatting', () => {
    expect(isTyposquatting('binanse.com', 'binance.com')).toBe(true)
  })

  it('deve detectar homograph', () => {
    expect(hasHomographChars('metаmask.io')).toBe(true)
  })

  it('deve identificar palavras-chave suspeitas', () => {
    expect(hasSuspiciousKeywords('free-btc-giveaway.com')).toBe(true)
  })
})

describe('API /api/check-url', () => {
  it('deve retornar safe para domínios whitelistados', async () => {
    const result = await checkURL('https://binance.com')
    expect(result.safe).toBe(true)
  })

  it('deve detectar domínio em blacklist', async () => {
    const result = await checkURL('https://binanse.com')
    expect(result.safe).toBe(false)
    expect(result.threat?.level).toBe('critical')
  })
})
```

### **E2E Tests** (Futuro)

- Testar flow completo de click → modal → decisão
- Verificar cache funcionando
- Simular falha da API (fallback)

---

## 📝 Manutenção

### **Atualização de Listas**

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
5. Deploy de nova versão

### **Monitoramento**

- **Falsos Positivos**: Usuários podem reportar
- **Falsos Negativos**: Botão "Reportar Scam"
- **Performance**: Monitorar tempo de resposta
- **API Quota**: Alertar ao atingir 80% do limite

---

## 🎯 Métricas de Sucesso

- **Taxa de Bloqueio**: > 95% de scams conhecidos bloqueados
- **Falsos Positivos**: < 1% de sites legítimos bloqueados
- **Engajamento**: > 50% de usuários leem dicas educativas
- **Comunidade**: > 100 URLs reportadas por usuários/mês
- **Performance**: < 100ms para verificação local, < 500ms total

---

## 🔗 Integração com Outras Páginas

### **Como Adicionar em Artigos** (Futuro)

```tsx
// app/noticias/[slug]/page.tsx
import LinkInterceptor from '@/app/components/LinkInterceptor'

export default function NewsArticle({ article }) {
  return (
    <LinkInterceptor>
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </LinkInterceptor>
  )
}
```

### **Como Adicionar em Comentários** (Futuro)

```tsx
// components/CommentsList.tsx
import LinkInterceptor from '@/app/components/LinkInterceptor'

export default function CommentsList({ comments }) {
  return (
    <LinkInterceptor showEducationalTips={true}>
      {comments.map(comment => (
        <Comment key={comment.id} content={comment.text} />
      ))}
    </LinkInterceptor>
  )
}
```

---

## 🚨 Casos de Uso Críticos

### **1. Phishing de Exchange**

**Cenário**: Usuário clica em link "binanse.com" em comentário fake

**Flow**:
1. LinkInterceptor detecta click
2. Verificação local: typosquatting de "binance.com"
3. Modal vermelho: "SITE PERIGOSO - Phishing detectado"
4. Explica o que é typosquatting
5. Sugere site legítimo: "Você quis dizer binance.com?"
6. Usuário cancela e acessa site correto

**Resultado**: ✅ Credenciais salvas

---

### **2. Giveaway Scam**

**Cenário**: Artigo menciona "free-btc-giveaway.com"

**Flow**:
1. Verificação local: keyword "free", "giveaway"
2. Blacklist: domínio conhecido como scam
3. Modal laranja: "SITE SUSPEITO"
4. Explica que "lucro garantido" é sempre scam
5. Link para guia educativo sobre scams comuns

**Resultado**: ✅ Usuário educado, não perde fundos

---

### **3. Homograph Attack**

**Cenário**: Link para "metаmask.io" (а cirílico)

**Flow**:
1. Pattern detection: homograph encontrado
2. Modal vermelho: "ATAQUE HOMOGRÁFICO DETECTADO"
3. Mostra caracteres invisíveis (highlight)
4. Ensina sobre Unicode lookalikes
5. Link para MetaMask oficial

**Resultado**: ✅ Wallet segura

---

## 📚 Recursos Adicionais

### **Links Úteis**

- [Google Safe Browsing API Docs](https://developers.google.com/safe-browsing)
- [CryptoScamDB](https://cryptoscamdb.org/)
- [PhishTank](https://phishtank.org/)
- [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
- [Unicode Security](https://unicode.org/reports/tr36/)

### **Referências**

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
**Versão**: 1.0.0
**Data**: 2025-11-10
**Status**: ✅ Pronta para implementação

---

## 🚀 Próximos Passos

1. Implementar página `/seguranca/verificador-url`
2. Criar componentes (LinkInterceptor, Modal)
3. Implementar API `/api/check-url`
4. Popular listas de domínios
5. Testes e ajustes
6. Deploy em preview
7. Documentar no README
8. Anunciar para comunidade

**Missão**: Fazer do Token Milagre o site mais seguro de cripto em português 🛡️
