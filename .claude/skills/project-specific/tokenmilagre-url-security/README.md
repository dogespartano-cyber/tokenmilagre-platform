# Token Milagre - URL Security System

## 🎯 Visão Geral

Sistema híbrido de verificação de URLs para proteger usuários contra phishing, scams e sites maliciosos.

**Status**: ✅ MVP Implementado (Fase 1)

---

## 📂 Arquivos Criados

### Página Pública
- `app/seguranca/verificador-url/page.tsx` - Página de verificação manual de URLs

### API
- `app/api/check-url/route.ts` - API de verificação (POST /api/check-url)

### Componentes Reutilizáveis
- `app/components/LinkInterceptor.tsx` - HOC para interceptar links externos
- `app/components/URLWarningModal.tsx` - Modal educativo de aviso

### Biblioteca de Segurança
- `lib/url-security/patterns.ts` - Detecção de patterns (typosquatting, homograph, etc)

### Dados
- `lib/data/crypto-scam-domains.json` - Blacklist de domínios maliciosos
- `lib/data/crypto-trusted-domains.json` - Whitelist de domínios confiáveis

---

## 🚀 Como Usar

### 1. Verificação Manual (Página Pública)

Usuários podem acessar `/seguranca/verificador-url` e verificar qualquer URL antes de clicar.

### 2. Adicionar em Artigos (Futuro)

```tsx
import LinkInterceptor from '@/app/components/LinkInterceptor'

export default function ArticlePage({ article }) {
  return (
    <LinkInterceptor>
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </LinkInterceptor>
  )
}
```

### 3. Adicionar em Comentários (Futuro)

```tsx
import LinkInterceptor from '@/app/components/LinkInterceptor'

export default function Comments({ comments }) {
  return (
    <LinkInterceptor showEducationalTips={true}>
      {comments.map(c => <Comment key={c.id} {...c} />)}
    </LinkInterceptor>
  )
}
```

---

## 🔍 Detecções Implementadas

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Blacklist** | Domínios conhecidos como scam | binanse.com |
| **Whitelist** | Domínios confiáveis (skip verificação) | binance.com |
| **Typosquatting** | Erros de digitação intencionais | coinbasse.com |
| **Homograph** | Caracteres Unicode parecidos | metаmask.io (а cirílico) |
| **Keywords** | Palavras suspeitas | free-btc-giveaway.com |
| **TLD Suspeito** | Domínios gratuitos (.tk, .ml) | scam-site.tk |

---

## 📊 Níveis de Ameaça

- 🔴 **Critical**: Phishing confirmado, malware, typosquatting
- 🟡 **Warning**: Domínio suspeito, keywords maliciosas
- 🟠 **Suspicious**: Padrões levemente suspeitos

---

## 🧪 Testando

**Teste 1 - Domínio Seguro**:
```
URL: https://binance.com
Resultado: ✅ Link Seguro
```

**Teste 2 - Typosquatting**:
```
URL: https://binanse.com
Resultado: 🔴 SITE PERIGOSO - Typosquatting de binance.com
```

**Teste 3 - Keyword Scam**:
```
URL: https://free-btc-giveaway.com
Resultado: 🔴 SITE PERIGOSO - Contém "free", "giveaway"
```

---

## 🔄 Próximas Expansões

### Fase 2 (Próximas Sessões)
- [ ] Adicionar em artigos/notícias
- [ ] Google Safe Browsing API
- [ ] Cache em Prisma (evitar verificações repetidas)
- [ ] Dashboard admin de URLs reportadas
- [ ] Estatísticas públicas

### Fase 3 (Futuro)
- [ ] Sistema de report de usuários
- [ ] Votação comunitária
- [ ] Badge "Verificado pela Comunidade"
- [ ] API pública para developers

---

## 🛠️ Manutenção

### Atualizar Blacklist

Editar `lib/data/crypto-scam-domains.json`:

```json
{
  "domains": [
    {
      "domain": "novo-scam.com",
      "type": "phishing",
      "legitimate": "site-real.com",
      "addedAt": "2025-11-10",
      "severity": "critical"
    }
  ]
}
```

### Atualizar Whitelist

Editar `lib/data/crypto-trusted-domains.json`:

```json
{
  "exchanges": [
    "nova-exchange-confiavel.com"
  ]
}
```

---

## 📚 Documentação Completa

Ver: `.claude/skills/tokenmilagre-url-security/SKILL.md`

---

**Criado em**: 2025-11-10
**Versão**: 1.0.0
**Status**: ✅ Pronto para testes
