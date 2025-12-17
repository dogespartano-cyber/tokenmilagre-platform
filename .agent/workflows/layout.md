---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Guia de resolução de problemas de layout, tipografia e markdown no projeto
---

# Agente de Layout, Design e Tipografia

Este documento consolida as soluções encontradas para problemas comuns de interface, layout e formatação de conteúdo no projeto $MILAGRE.

---

## REGRA CRÍTICA: Sem Emojis

**NUNCA use emojis em conteúdo educacional.** Isso inclui:
- Títulos e headings (`###`)
- Corpo do texto
- Campos `icon` em `securityTips`
- Listas e enumerações
- Conclusões e CTAs

Mantenha o conteúdo limpo, profissional e focado em texto.

---

## 1. Tailwind v4 e Plugin Typography

### Problema
O projeto usa **Tailwind v4** (`@import "tailwindcss"` no globals.css), mas o plugin `@tailwindcss/typography` é para **Tailwind v3** e não é compatível.

### Solução
Estilos `.prose` customizados foram adicionados manualmente no final de `app/globals.css`:

```css
/* Ver seção "PROSE STYLES - Article Typography" em globals.css */
.prose h2 { ... }
.prose p { ... }
.prose blockquote { ... }
/* etc. */
```

### Variáveis de Tema para Artigos
```css
--text-article-title: #111827;   /* Light mode */
--text-article-body: #374151;
--bg-article-quote: #F9FAFB;
--border-article: #E5E7EB;
```

---

## 2. Sidebar Dinâmica

### Localização
`app/components/layout/Sidebar.tsx`

### Lógica de Detecção
```typescript
const currentSlug = pathname?.startsWith('/educacao/')
    ? pathname.replace('/educacao/', '').split('/')[0]
    : null;
const isTrilhaMode = currentSlug ? isGuiaEssencialSlug(currentSlug) : false;
```

### Comportamento
- **Modo Normal**: Menu padrão com DnD
- **Modo Trilha**: Lista de artigos do Guia Essencial + botão "Voltar ao Menu"

### Fonte de dados
`lib/education/guia-essencial.ts` - contém `GUIA_ESSENCIAL_TRILHA` e `isGuiaEssencialSlug()`

---

## 3. Template de Artigo Educacional

### Arquivos
- `app/educacao/[slug]/page.tsx` - Server Component (busca dados)
- `app/educacao/[slug]/GuiaEssencialClient.tsx` - Template "Comece por Aqui"
- `app/educacao/[slug]/ArtigoEducacionalClient.tsx` - Template padrão

### Estrutura do GuiaEssencialClient
1. Barra de progresso de leitura (topo)
2. Layout flex: `main` (conteúdo) + `aside` (ToC à direita)
3. ToC dinâmico extraído dos headings do markdown
4. Navegação Anterior/Próximo no rodapé

### Detecção de Headings para ToC
```typescript
const h2Match = line.match(/^## (.+)$/);
const h3Match = line.match(/^### (.+)$/);
```

---

## 4. Larguras e Espaçamentos

### Referência: Grokipedia
- Conteúdo principal: ~1052px (sem max-width fixo, expande com flex)
- ToC sidebar: ~224px (`w-56`)

### Classes Tailwind
```tsx
<main className="flex-1 min-w-0">
<aside className="hidden lg:block w-56 shrink-0">
```

### Espaçamentos de Texto (prose)
```css
.prose h2 { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-article); }
.prose p { margin-bottom: 1.5rem; line-height: 1.8; }
```

---

## 5. Markdown no Banco de Dados

### Seed de Artigos
- `prisma/seeds/seguranca-primeiro.ts` - dados do artigo
- `prisma/seeds/seed-seguranca-primeiro.ts` - script de inserção

### Executar Seed
```bash
npx tsx prisma/seeds/seed-seguranca-primeiro.ts
```

### Verificar Conteúdo no Banco
```bash
npx tsx -e "
const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const article = await prisma.article.findFirst({ 
    where: { slug: 'seguranca-primeiro' }, 
    select: { content: true } 
  });
  console.log(article.content.substring(0, 500));
}
main().finally(() => prisma.\$disconnect());
"
```

---

## 6. Troubleshooting Comum

### Markdown não renderiza
1. Verificar se `ReactMarkdown` está importado e usado
2. Verificar se `.prose` classes estão no globals.css
3. Verificar se conteúdo no banco tem quebras de linha (`\n`)

### Classes Tailwind não funcionam
1. Limpar cache: `rm -rf .next`
2. Reiniciar dev server
3. Verificar se classe está no `content` do tailwind.config.js

### ToC não aparece
1. Verificar se artigo tem headings `##` ou `###`
2. Verificar função `slugify()` em `lib/shared/utils/content-helpers.ts`

---

## 7. Arquivos Relevantes

| Arquivo | Propósito |
|---------|-----------|
| `app/globals.css` | Variáveis de tema + estilos .prose |
| `tailwind.config.js` | Configuração Tailwind v4 |
| `app/components/layout/Sidebar.tsx` | Sidebar dinâmica |
| `lib/education/guia-essencial.ts` | Constantes da trilha |
| `app/educacao/[slug]/GuiaEssencialClient.tsx` | Template de artigo |
