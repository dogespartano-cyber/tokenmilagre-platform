# Problemas Conhecidos e Lições Aprendidas

**Última atualização:** 2025-11-07
**Projeto:** Token Milagre Platform

Este documento registra problemas conhecidos encontrados durante o desenvolvimento e suas soluções, para referência futura e para evitar repetição dos mesmos erros.

---

## 📋 Índice

1. [Erros de Deploy no Vercel](#erros-de-deploy-no-vercel)
2. [Problemas com Prisma](#problemas-com-prisma)
3. [Next.js 15](#nextjs-15)
4. [TypeScript](#typescript)
5. [Dependências](#dependências)

---

## Erros de Deploy no Vercel

### Contexto

Durante a implementação das Fases 1-4 de expansão de conteúdo (novembro 2025), encontramos **6 erros sequenciais** de deploy no Vercel. Cada erro só aparecia depois que o anterior era corrigido.

---

## 🔴 Erro 1: Importação Incorreta do Prisma

### Sintomas
```
Error: Attempted import error: '@/lib/prisma' does not contain a default export
```

### Causa Raiz
O arquivo `/lib/prisma.ts` exporta o Prisma Client como **named export** (`export const prisma`), mas os novos arquivos de API estavam tentando importá-lo como **default export**.

### Código Incorreto
```typescript
// ❌ ERRADO
import prisma from '@/lib/prisma';
```

### Solução
```typescript
// ✅ CORRETO
import { prisma } from '@/lib/prisma';
```

### Arquivos Afetados
- `app/api/community-stories/route.ts`
- `app/api/community-stories/[slug]/route.ts`
- `app/api/social-projects/route.ts`
- `app/api/social-projects/[slug]/route.ts`
- `app/api/project-map/route.ts`
- `app/api/gamification/award-points/route.ts`
- `app/api/user-progress/route.ts`

### Lição Aprendida
✅ **Sempre verificar se a exportação é default ou named antes de importar**
✅ **Manter consistência no padrão de exportação em toda a codebase**

---

## 🔴 Erro 2: Parâmetros de Rota do Next.js 15

### Sintomas
```
Type error: Type "{ params: { slug: string; }; }" is not a valid type
for the function's second argument
```

### Causa Raiz
O Next.js 15 mudou a API de rotas dinâmicas. Os parâmetros agora são uma **Promise** que precisa ser aguardada com `await`.

### Código Incorreto (Next.js 14)
```typescript
// ❌ ERRADO (padrão antigo)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params; // Acesso direto
}
```

### Solução (Next.js 15)
```typescript
// ✅ CORRETO (padrão novo)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // Precisa de await
}
```

### Arquivos Afetados
- `app/api/community-stories/[slug]/route.ts`
- `app/api/social-projects/[slug]/route.ts`

### Lição Aprendida
✅ **No Next.js 15+, sempre usar `await params` em rotas dinâmicas**
✅ **Consultar a documentação oficial quando atualizar major versions**

### Referência
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [Dynamic Routes Migration](https://nextjs.org/docs/app/api-reference/file-conventions/route)

---

## 🔴 Erro 3: Dependência Faltando (lucide-react)

### Sintomas
```
Error: Cannot find module 'lucide-react' or its corresponding type declarations
```

### Causa Raiz
Componentes usavam ícones do pacote `lucide-react`, mas o pacote não estava listado em `package.json`.

### Código com Erro
```typescript
import { Heart, CheckCircle2, TrendingUp } from 'lucide-react';
// ❌ Erro: módulo não encontrado
```

### Solução
Adicionar dependência ao `package.json`:
```json
{
  "dependencies": {
    "lucide-react": "^0.468.0"
  }
}
```

### Arquivos Afetados
- `components/CommunityStoryCard.tsx`
- `components/SocialProjectCard.tsx`
- `components/InteractiveTool.tsx`

### Lição Aprendida
✅ **Sempre adicionar pacotes ao package.json imediatamente após usá-los**
✅ **Verificar imports antes de fazer commit**
✅ **Usar `npm install <pacote>` em vez de só importar**

---

## 🔴 Erro 4: Prop Inválido em Componentes lucide-react

### Sintomas
```
Type error: Type '{ className: string; title: string; }' is not assignable to type...
Property 'title' does not exist
```

### Causa Raiz
Os componentes SVG do `lucide-react` não aceitam o atributo HTML `title`. Eles têm um conjunto restrito de props permitidas.

### Código Incorreto
```typescript
// ❌ ERRADO
<CheckCircle2 className="w-4 h-4 text-blue-500" title="Verificado" />
```

### Solução
```typescript
// ✅ CORRETO - usar aria-label para acessibilidade
<CheckCircle2 className="w-4 h-4 text-blue-500" aria-label="Verificado" />

// OU envolver em um elemento com title
<span title="Verificado">
  <CheckCircle2 className="w-4 h-4 text-blue-500" />
</span>
```

### Arquivo Afetado
- `components/CommunityStoryCard.tsx:83`

### Lição Aprendida
✅ **Componentes de bibliotecas têm suas próprias restrições de props**
✅ **Usar `aria-label` em vez de `title` para acessibilidade em SVGs**
✅ **Consultar a documentação da biblioteca antes de usar atributos HTML padrão**

### Referência
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [ARIA Labels Best Practices](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html)

---

## 🔴 Erro 5: Variável de Ambiente DIRECT_URL Não Configurada

### Sintomas
```
Error: Environment variable not found: DIRECT_URL.
  -->  prisma/schema.prisma:13
   |
12 |   url      = env("DATABASE_URL")
13 |   directUrl = env("DIRECT_URL")
   |
Error code: P1012
```

### Causa Raiz
O Prisma schema exigia a variável de ambiente `DIRECT_URL` que não estava configurada no Vercel. O `directUrl` é opcional e usado apenas para connection pooling avançado.

### Código Incorreto
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // ❌ Variável não configurada
}
```

### Solução
Remover a configuração `directUrl` se não for necessária:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ Apenas DATABASE_URL
}
```

### Quando Usar directUrl
O `directUrl` só é necessário quando você usa **connection pooling** como PgBouncer:
- `url`: Aponta para a conexão pooled (para queries)
- `directUrl`: Aponta para a conexão direta (para migrações)

### Lição Aprendida
✅ **Não adicionar configurações opcionais sem necessidade**
✅ **Documentar quando `directUrl` é realmente necessário**
✅ **Verificar variáveis de ambiente antes de fazer deploy**

### Referência
- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

## 🔴 Erro 6: Database Schema Não Sincronizado

### Sintomas (6a: Coluna Inexistente)
```
Error [PrismaClientKnownRequestError]:
Invalid `prisma.article.findFirst()` invocation:

The column `Article.warningLevel` does not exist in the current database.
Code: P2022
```

### Causa Raiz
O código esperava colunas novas (como `Article.warningLevel`) que foram adicionadas ao Prisma schema, mas nunca foram criadas no banco de dados de produção.

### Sintomas (6b: Baseline Migration)
```
Error: P3005
The database schema is not empty. Read more about how to baseline
an existing production database: https://pris.ly/d/migrate-baseline
```

### Causa Raiz do 6b
O banco de dados já tinha tabelas, mas o Prisma Migrate não sabia quais migrações tinham sido aplicadas. Isso ocorre quando:
- O banco foi criado com `prisma db push` em vez de migrations
- Ou migrações foram aplicadas manualmente via SQL
- Ou o projeto não usou Prisma Migrate desde o início

### Tentativa de Solução (Falhou)
```json
// ❌ Tentativa 1: usar prisma migrate deploy
{
  "scripts": {
    "build": "prisma migrate deploy && next build"
  }
}
```
**Resultado:** Erro P3005 (schema não vazio, precisa de baseline)

### Solução Final
```json
// ✅ Solução: usar prisma db push
{
  "scripts": {
    "build": "prisma db push --accept-data-loss && next build"
  }
}
```

### Por Que Funciona

**prisma migrate deploy:**
- Executa migrações rastreadas em `prisma/migrations`
- Exige que o banco esteja "limpo" ou tenha baseline configurado
- Mantém histórico completo de mudanças
- Ideal para projetos que usaram Prisma Migrate desde o início

**prisma db push:**
- Sincroniza o schema diretamente com o banco
- Não requer histórico de migrações
- Idempotente (pode executar múltiplas vezes)
- Adiciona novas colunas/tabelas sem perder dados existentes
- Ideal para bancos sem histórico de migração rastreado

### Lição Aprendida
✅ **Usar `prisma db push` quando o banco não tem histórico de migrações**
✅ **Usar `prisma migrate deploy` apenas em projetos com migrations desde o início**
✅ **O flag `--accept-data-loss` permite execução não-interativa**
✅ **Documentar qual estratégia de migração o projeto usa**

### Referência
- [Prisma Migrate vs DB Push](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)
- [Baseline Existing Database](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)

---

## Problemas com Prisma

### Resumo das Melhores Práticas

#### Importação
```typescript
// ✅ SEMPRE usar named import
import { prisma } from '@/lib/prisma';
```

#### Migrações
```bash
# Desenvolvimento (com histórico)
npx prisma migrate dev --name nome_da_migracao

# Produção (com histórico desde início)
npx prisma migrate deploy

# Produção (sem histórico ou baseline)
npx prisma db push --accept-data-loss
```

#### Environment Variables
```env
# Mínimo necessário
DATABASE_URL="postgresql://..."

# Apenas se usar connection pooling
DIRECT_URL="postgresql://..."  # Conexão direta (sem pool)
```

---

## Next.js 15

### Mudanças Importantes

#### 1. Parâmetros de Rota (Route Params)
```typescript
// ✅ Next.js 15
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
}
```

#### 2. SearchParams também são Promise
```typescript
// ✅ Next.js 15
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
}
```

### Referência
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

---

## TypeScript

### Named vs Default Exports

#### Quando Usar Named Export
```typescript
// lib/utils.ts
export const formatDate = (date: Date) => { ... }
export const formatCurrency = (value: number) => { ... }

// outro-arquivo.ts
import { formatDate, formatCurrency } from '@/lib/utils';
```

**Vantagens:**
- Múltiplas exportações no mesmo arquivo
- Auto-complete e refactoring melhores
- Imports explícitos

#### Quando Usar Default Export
```typescript
// components/Button.tsx
export default function Button({ children }: Props) { ... }

// outro-arquivo.tsx
import Button from '@/components/Button';
```

**Vantagens:**
- Componentes React principais
- Um conceito principal por arquivo
- Imports mais simples

### Lição Aprendida
✅ **Preferir named exports para utilities e múltiplas funções**
✅ **Usar default export para componentes React principais**
✅ **Manter consistência em toda a codebase**

---

## Dependências

### Checklist Antes de Deploy

- [ ] Todos os imports têm o pacote correspondente em `package.json`
- [ ] Versões de pacotes relacionados são compatíveis (ex: prisma e @prisma/client)
- [ ] Dependências de desenvolvimento estão em `devDependencies`
- [ ] Dependências de produção estão em `dependencies`

### Como Adicionar Dependências

```bash
# Dependência de produção
npm install pacote@versao

# Dependência de desenvolvimento
npm install -D pacote@versao

# Atualizar pacote específico
npm install pacote@latest
```

### Pacotes Críticos do Projeto

| Pacote | Versão Atual | Tipo | Notas |
|--------|--------------|------|-------|
| next | 15.5.4 | prod | App Router, RSC |
| react | 19.x | prod | Versão compatível com Next 15 |
| prisma | 6.19.0 | dev | CLI e ferramentas |
| @prisma/client | 6.19.0 | prod | Runtime client |
| lucide-react | 0.468.0 | prod | Ícones SVG |
| typescript | 5.x | dev | Type checking |

### Lição Aprendida
✅ **Manter versões do `prisma` e `@prisma/client` sincronizadas**
✅ **Testar localmente antes de fazer deploy**
✅ **Documentar dependências críticas e suas versões**

---

## 🎯 Resumo das Lições Aprendidas

### Ordem dos Erros (Sequencial)

Os erros aparecem em **cascata** porque o build é sequencial:

```
1. npm install
   ↓
2. prisma generate (postinstall)
   ↓
3. prisma db push (build script)
   ↓
4. next build (compila TypeScript)
   ↓
5. Geração de páginas estáticas
```

Cada etapa só executa se a anterior funcionar. Por isso descobrimos um erro de cada vez.

### Top 5 Ações Preventivas

1. **✅ Verificar Importações**: Named vs default exports
2. **✅ Consultar Docs da Versão**: Next.js 15 mudou APIs importantes
3. **✅ Adicionar Dependências**: Sempre usar npm install, não só importar
4. **✅ Testar Localmente**: Executar `npm run build` antes de deploy
5. **✅ Sincronizar Schema**: Usar `prisma db push` em bancos sem histórico

---

## 📚 Recursos Úteis

### Documentação Oficial
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lucide Icons](https://lucide.dev/)

### Troubleshooting
- [Vercel Build Logs](https://vercel.com/docs/deployments/logs)
- [Prisma Error Codes](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [Next.js Error Messages](https://nextjs.org/docs/messages)

---

## 📝 Histórico de Atualizações

| Data | Autor | Mudanças |
|------|-------|----------|
| 2025-11-07 | Claude | Criação inicial com 6 erros de deploy documentados |

---

**Nota:** Este documento deve ser atualizado sempre que novos problemas significativos forem encontrados e resolvidos.
