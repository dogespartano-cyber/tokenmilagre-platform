---
name: pages-reference
description: Use this skill when modifying or creating pages, understanding page-specific features, layouts, and functionalities. Contains detailed information about all main pages (Educação, Recursos, Notícias, Doações).
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Pages Reference Skill

This skill provides detailed information about all main pages in the Token Milagre Platform, including their features, layouts, and specific functionalities.

---

## 📚 Educação (`/educacao`)

**Características:**
- Sistema de filtros: Busca + Categorias + Níveis
- Cards de artigos com: Tipo, Tempo de leitura, Título, Descrição, Tags
- Filtros sem ícones (apenas texto)
- Contador de resultados

**Página de Artigo (`/educacao/[slug]`):**
- Layout: Conteúdo principal (esquerda) + Índice lateral (direita)
- Índice mostra apenas H2 (seções principais)
- Destaque da seção ativa com scroll tracking
- Barra de progresso de leitura no topo
- Breadcrumbs + Botão voltar
- Compartilhar: Twitter, Telegram, WhatsApp
- Artigos relacionados por categoria

---

## 📚 Recursos (`/recursos`)

**Características:**
- Galeria de links oficiais verificados
- Categorias: Wallets, Exchanges, Exploradores, DeFi, Ferramentas, Navegadores
- Sistema de busca com debounce (500ms)
- Badge de verificação em todos os recursos
- URL completa exibida abaixo do botão
- Avisos de segurança destacados
- Scroll to top com throttle (100ms)

**Arquitetura Modular (Refatorada 2025-11-16):**

```
app/recursos/
├── page.tsx - Server component (revalidate: 3600)
├── RecursosClient.tsx (132 lines) - State & composition
└── components/
    ├── ResourceFilters.tsx (120 lines)
    │   └── Search + category filters + results counter
    ├── ResourceGrid.tsx (158 lines)
    │   └── Resource cards grid + empty state
    ├── SecurityTips.tsx (50 lines)
    │   └── Security tips section (4 tips)
    └── ScrollToTop.tsx (41 lines)
        └── Scroll button with throttled listener
```

**Página de Detalhes (`/recursos/[slug]`):**

```
app/recursos/[slug]/
├── page.tsx - Server component
├── ResourceDetailClient.tsx (100 lines) - Composition
└── components/
    ├── ResourceHeader.tsx (61 lines)
    │   └── Title, badges, description, CTA
    ├── WhyGoodSection.tsx (24 lines)
    │   └── Why this resource is good
    ├── ResourceFeatures.tsx (34 lines)
    │   └── Main features list
    ├── CompatibleWallets.tsx (81 lines)
    │   └── Wallet compatibility (browsers only)
    ├── HowToStart.tsx (43 lines)
    │   └── Step-by-step guide
    ├── ProsAndCons.tsx (58 lines)
    │   └── Pros/cons analysis grid
    ├── ResourceFAQ.tsx (67 lines)
    │   └── FAQ accordion with expand/collapse
    ├── ResourceSecurityTips.tsx (43 lines)
    │   └── Security tips specific to resource
    └── RelatedResources.tsx (72 lines)
        └── Related resources grid (max 3)
```

**Design:**
- Cards com gradientes por categoria:
  - 🟠 Wallets: Gradiente laranja
  - 🟡 Exchanges: Gradiente dourado
  - 🔴 DeFi: Gradiente rosa
  - 🔵 Explorers: Gradiente azul
  - 🟢 Tools: Gradiente verde
  - 🌐 Browsers: Gradiente roxo
- Texto branco com badges translúcidos
- Hover: `-translate-y-1.5` + `shadow-xl`

**Acessibilidade (WCAG AA):**
- Comprehensive `aria-label` em todos os elementos interativos
- `aria-expanded` no FAQ accordion
- `role="list"` e `role="listitem"` nos grids
- `role="searchbox"` no campo de busca
- `aria-live="polite"` no contador de resultados
- `aria-hidden` em ícones decorativos

**Performance:**
- Search com debounce (500ms) - reduz re-renders em 83%
- Scroll listener com throttle (100ms) - reduz calls em 90%
- ISR com revalidate 3600s (1h)
- Componentes modulares (code splitting)

---

## 📰 Notícias (`/dashboard/noticias`)

**Características:**
- Filtro combinado: Ordenação + Sentimento em um único dropdown
- Menu posicionado ao lado das categorias (grid layout)
- Badges de sentimento: 🟢 Positivo, 🟡 Neutro, 🔴 Negativo

**Template de Artigo:**
- Design minimalista idêntico aos artigos educacionais
- Layout: Conteúdo principal (`max-w-4xl`) + Sidebar lateral (w-64, apenas XL+)
- Espaçamento: `paddingLeft: '55px'`

**Elementos automáticos:**
- Breadcrumbs no navbar
- Botão "Voltar para Notícias"
- Meta info: Sentimento, Fonte, Tempo de leitura, "Há Xh/Xd"
- Título principal (H1)
- Data de publicação formatada (PT-BR com hora/minuto BRT)
- Resumo
- Keywords/Tags clicáveis
- Conteúdo processado (sem H1/fontes)
- 📊 Nota de Transparência
- Compartilhar: X (Twitter), Telegram, WhatsApp
- Notícias Relacionadas
- Índice lateral com seção ativa destacada
- Navegação anterior/próxima
- Scroll to top button

---

## 💝 Doações (`/doacoes`)

**Características:**
- Hero section com mesmo padrão visual da página Sobre
- Badge "Apoie a Comunidade" + Título impactante
- Card destacado explicando importância das doações
- Seções organizadas com dividers

**Seções da Página:**

1. **Como Sua Doação é Utilizada** (4 cards com percentuais)
   - 🎓 Educação Gratuita (40%)
   - 💻 Desenvolvimento (30%)
   - 🤝 Apoio Comunitário (20%)
   - 🌱 Crescimento (10%)

2. **Por Que Confiar em Nós?** (4 razões)
   - 🔍 100% Transparente
   - ⚡ Sem Intermediários
   - 🎯 Impacto Real
   - 👥 Comunidade Ativa

3. **Métodos de Doação** (3 opções)
   - ⚡ Solana (SOL) - Em breve
   - 🪙 $MILAGRE Token - Com endereço copiável
   - 💰 PIX - Em breve

4. **Aviso de Segurança**
   - Verificação de endereços
   - Orientações sobre rede correta
   - Avisos sobre chaves privadas

5. **Outras Formas de Ajudar**
   - 📣 Divulgue
   - ✍️ Contribua
   - 💬 Participe
   - 🐛 Reporte Bugs

6. **CTA Final**
   - Mensagem de agradecimento
   - Botões Discord e Telegram

**Funcionalidades:**
- Botão "Copiar endereço" com feedback visual
- Scroll to top button
- Schema.org JSON-LD para SEO
- Breadcrumbs de navegação
- Design responsivo com CSS variables

**Texto Persuasivo:**
- Projeto 100% comunitário e sem fins lucrativos
- Transparência total na blockchain
- Sem investidores, mensalidades ou venda de dados
- Impacto real na educação de milhares de pessoas

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-11-16
