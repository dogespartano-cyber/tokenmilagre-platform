# 📝 Histórico de Atualizações - Token Milagre Platform

Este arquivo contém o histórico detalhado de todas as atualizações, mudanças e implementações do projeto Token Milagre Platform.

Para diretrizes e padrões atuais, consulte o arquivo `CLAUDE-MEMORY.md`.

---

## 2025-10-31: 📊 REORGANIZAÇÃO COMPLETA DO DASHBOARD ADMIN

### 🎯 Reorganização de Estrutura de Rotas

**Motivação**: Chat AI estava na rota principal `/dashboard`, dificultando acesso ao painel admin.

**Nova Estrutura de Rotas**:
```
/dashboard              → Painel Admin (stats + cards)
/dashboard/chat         → Chat AI Assistant (full screen)
/dashboard/artigos      → Gerenciar artigos
/dashboard/usuarios     → Gerenciar usuários
/dashboard/criar-artigo → Gerar artigos com IA
```

**Estrutura Antiga (REMOVIDA)**:
```
/dashboard              → Chat AI (full screen) ❌
/dashboard/admin        → Painel Admin ❌
/dashboard/admin/artigos → Gerenciar artigos ❌
/dashboard/admin/usuarios → Gerenciar usuários ❌
```

**Mudanças Realizadas**:
1. ✅ Criado `/dashboard/chat/page.tsx` - Chat AI em página dedicada
2. ✅ Substituído `/dashboard/page.tsx` pelo painel admin
3. ✅ Movido `/dashboard/admin/artigos` → `/dashboard/artigos`
4. ✅ Movido `/dashboard/admin/usuarios` → `/dashboard/usuarios`
5. ✅ Deletada pasta `/dashboard/admin/` completa
6. ✅ Atualizados links em 5 arquivos:
   - `app/dashboard/artigos/page.tsx` (Voltar ao Dashboard)
   - `app/dashboard/usuarios/page.tsx` (Voltar ao Dashboard)
   - `app/login/page.tsx` (Redirect ADMIN → /dashboard)
   - `app/dashboard/chat/page.tsx` (Menu com Dashboard)
   - `components/UserDropdown.tsx` (Link Painel Admin)

**Resultado**: URLs mais limpas, navegação intuitiva, sem `/admin` nas rotas.

---

### 🎨 Dashboard com Tema Padrão (Header + Sidebar + Footer)

**Motivação**: Dashboard estava isolado sem navegação padrão do site.

**Mudanças em `app/layout-root.tsx`**:
1. ✅ Removida variável `isDashboard` e todas condições `!isDashboard`
2. ✅ Sidebar agora exibe link "Admin" (visível apenas para ADMIN)
3. ✅ Header, sidebar e footer aparecem em `/dashboard`
4. ✅ Margem esquerda `lg:ml-72` aplicada permanentemente

**Configuração DashboardHeader Adicionada**:
```typescript
'/dashboard': {
  title: 'Painel Administrativo',
  description: 'Gerencie todo o conteúdo e configurações da plataforma'
}
```

**Página Simplificada** (`/dashboard/page.tsx`):
- Removido layout customizado (fundo escuro, header próprio)
- Usa `container mx-auto px-4 py-8` (padrão do site)
- Cards de estatísticas (4 cards) e ferramentas administrativas (4 cards)
- Totalmente integrado com CSS variables do tema
- Ícone `faComments` para card "Chat AI"

**Exceção**: `/dashboard/chat` manteve layout full screen (melhor experiência para chat).

---

### 🔒 Proteção SEO - Dashboard NÃO Indexável

**Motivação**: Dashboard admin não pode aparecer no Google nem buscadores.

**3 Camadas de Proteção Implementadas**:

**1. Meta Tags no Layout** (`app/dashboard/layout.tsx`):
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,        // Não indexar
    follow: false,       // Não seguir links
    nocache: true,       // Não cachear
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true, // Não indexar imagens
    },
  },
};
```

**2. robots.txt Atualizado** (`public/robots.txt`):
```txt
# Bloquear área administrativa
Disallow: /dashboard/
Disallow: /login
Disallow: /api/
```

**3. Autenticação** (já existente):
- `<AdminRoute allowEditor={false}>` protege acesso
- Middleware NextAuth garante autenticação

**Resultado**:
- ❌ Google NÃO indexará `/dashboard`
- ❌ Bots NÃO rastrearão essas páginas
- ❌ Páginas NÃO aparecerão nos resultados de busca
- ✅ Somente usuários autenticados ADMIN têm acesso

---

### 🐛 Correção CRÍTICA - Página Gerenciar Artigos

**Problema**: Página `/dashboard/artigos` exibia erro "Erro ao buscar artigos".

**Bugs Identificados**:

**1. Filtro `published='all'` não funcionava** (`/api/articles/route.ts:48-58`):

**ANTES (BUG)**:
```typescript
if (published !== null) {
  where.published = published === 'true';
} else {
  where.published = true;
}
// Resultado: published='all' era tratado como true → mostrava só rascunhos
```

**DEPOIS (CORRIGIDO)**:
```typescript
if (published === 'all') {
  // Não filtrar - mostrar todos
} else if (published === 'true') {
  where.published = true;
} else if (published === 'false') {
  where.published = false;
} else if (!published) {
  where.published = true; // Padrão
}
```

**2. Incompatibilidade de formato de dados**:
- `/api/articles` retorna dados TRANSFORMADOS: `summary`, `publishedAt`, `author` (string)
- Página admin espera dados BRUTOS: `excerpt`, `createdAt`, `author` (objeto)

**Solução Implementada**:

**Criada nova rota** `app/api/admin/articles/route.ts`:
```typescript
// GET /api/admin/articles
// - Retorna dados brutos do banco (não transformados)
// - Protegida por autenticação (ADMIN/EDITOR apenas)
// - Formato compatível com interface AdminArticle
// - Sem _count de comments (não existe no schema)
```

**Página atualizada** (`app/dashboard/artigos/page.tsx:65`):
```typescript
// ANTES
const response = await fetch(`/api/articles?${params}`);

// DEPOIS
const response = await fetch(`/api/admin/articles?${params}`);
```

**Resultado**:
- ✅ Página lista todos os artigos corretamente
- ✅ Filtros funcionam (tipo, status, busca)
- ✅ Dados exibidos corretamente (título, excerpt, autor, data, status)
- ✅ Ações funcionam (visualizar, deletar, toggle publicar)

---

### 🧹 Limpeza de Conteúdo - Remoção de Referências Numéricas

**Problema**: Últimos 10 posts de notícias continham referências numéricas `[1]`, `[5]`, `[1][2]`, etc.

**Script Criado**: `scripts/remove-references.js`

**Funcionalidade**:
- Busca últimos 10 artigos de tipo `news`
- Remove padrões regex: `/\[\d+\](\[\d+\])*/g`
- Limpa tanto `content` quanto `excerpt`
- Atualiza no banco de dados PostgreSQL (via Prisma)

**Padrões Removidos**:
- `[1]`, `[2]`, `[3]`... (referências simples)
- `[1][2]`, `[5][10]`, `[12][15]`... (referências múltiplas)

**Resultado da Execução**:
```
🔍 Total analisado: 10 artigos
✅ Artigos atualizados: 3
```

**Artigos Limpos**:
1. "Bitcoin despenca para US$ 107.782 após Fed e tensão geopolítica"
2. "Saylor prevê Bitcoin a US$ 150 mil até 2025: o que isso significa para o mercado?"
3. "Bitcoin atinge US$ 112 mil com impulso de investidores institucionais e ETFs"

**Comando para re-executar**:
```bash
node scripts/remove-references.js
```

**Script reutilizável**: Pode ser rodado novamente se novos artigos tiverem referências.

---

### 📊 Resumo de Arquivos

**Criados (3)**:
- `app/dashboard/chat/page.tsx` - Chat AI em página dedicada
- `app/api/admin/articles/route.ts` - API admin com dados brutos
- `scripts/remove-references.js` - Script de limpeza de referências

**Modificados (9)**:
- `app/dashboard/page.tsx` - Painel admin com tema padrão
- `app/dashboard/layout.tsx` - Meta tags noindex SEO
- `app/dashboard/artigos/page.tsx` - Usa nova API admin
- `app/dashboard/usuarios/page.tsx` - Link atualizado
- `app/login/page.tsx` - Redirect ADMIN para /dashboard
- `app/layout-root.tsx` - Remove condições isDashboard
- `app/api/articles/route.ts` - Corrige filtro published='all'
- `components/UserDropdown.tsx` - Link Painel Admin atualizado
- `public/robots.txt` - Bloqueia /dashboard/, /login, /api/

**Deletados (1)**:
- `app/dashboard/admin/` - Diretório completo (page.tsx, layout.tsx)

---

### 🎯 Impacto

**UX**:
- ✅ Navegação mais clara e intuitiva
- ✅ Dashboard integrado ao tema do site
- ✅ URLs limpas sem `/admin`

**SEO**:
- ✅ Dashboard completamente protegido contra indexação
- ✅ 3 camadas de segurança (meta tags + robots.txt + auth)

**Funcionalidade**:
- ✅ Página Gerenciar Artigos 100% funcional
- ✅ API admin dedicada com formato correto
- ✅ 3 artigos limpos sem referências numéricas

**Arquitetura**:
- ✅ Separação clara: `/api/articles` (público) vs `/api/admin/articles` (admin)
- ✅ Estrutura de rotas mais lógica
- ✅ Script reutilizável para limpeza futura

---

## 2025-10-28: 🔒 CORREÇÕES DE SEGURANÇA CRÍTICAS + MELHORIAS NA CRIAÇÃO DE ARTIGOS

### Motivação

**Problemas Críticos de Segurança Identificados:**
- API key da Perplexity exposta no cliente (localStorage, DevTools, Network tab)
- API `/api/generate-article` sem autenticação - qualquer um podia gerar artigos
- Author ID hardcoded ao invés de usar sessão do usuário
- Body parsing duplicado causando erro "Body has already been read"

**Problemas de UX:**
- Página de login genérica sem identidade visual
- Redirecionamento fixo para `/dashboard` (404)
- Editores não podiam acessar criação de artigos
- Navegação confusa com botão Admin duplicado
- Sem confirmação antes de publicar artigos

### ✅ Correções de Segurança Implementadas

#### 1. **API de Geração de Artigos - Autenticação**

**Arquivo**: `app/api/generate-article/route.ts`

**Antes (VULNERÁVEL):**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { apiKey } = body; // ← API key vinda do cliente!

  // Sem autenticação
  // Qualquer um podia chamar
}
```

**Depois (SEGURO):**
```typescript
export async function POST(request: NextRequest) {
  // Verificar autenticação
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: 'Não autenticado' },
      { status: 401 }
    );
  }

  // Verificar permissão ADMIN ou EDITOR
  if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
    return NextResponse.json(
      { success: false, error: 'Sem permissão. Apenas ADMIN e EDITOR podem gerar artigos.' },
      { status: 403 }
    );
  }

  // API key do servidor (variável de ambiente)
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'API key não configurada no servidor' },
      { status: 500 }
    );
  }
}
```

**Mudanças:**
- ✅ Autenticação obrigatória via NextAuth
- ✅ Apenas ADMIN e EDITOR podem gerar artigos
- ✅ API key movida para `.env` (nunca exposta)
- ✅ Retorna 401 se não autenticado
- ✅ Retorna 403 se sem permissão
- ✅ Interface `GenerateArticleRequest` removeu `apiKey: string`

#### 2. **Remoção de API Key do Cliente**

**Arquivo**: `app/dashboard/criar-artigo/page.tsx`

**Removido:**
```typescript
// State
const [apiKey, setApiKey] = useState('');

// localStorage (VULNERÁVEL)
useEffect(() => {
  const saved = localStorage.getItem('perplexity_api_key');
  if (saved) setApiKey(saved);
}, []);

useEffect(() => {
  if (apiKey) {
    localStorage.setItem('perplexity_api_key', apiKey);
  }
}, [apiKey]);

// Campo no formulário
<input
  type="password"
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
  placeholder="pplx-..."
/>

// Enviado na requisição (INSEGURO)
body: JSON.stringify({ apiKey })
```

**Agora:**
```typescript
// API key NÃO existe mais no cliente
// Requisição limpa, sem apiKey
body: JSON.stringify({
  topic,
  type,
  category,
  level,
  model
})
```

**Benefícios:**
- ✅ API key nunca trafega pela rede
- ✅ Não aparece em DevTools
- ✅ Não fica em localStorage
- ✅ Impossível extrair do cliente

#### 3. **Author ID Dinâmico**

**Arquivo**: `app/dashboard/criar-artigo/page.tsx`

**Antes (HARDCODED):**
```typescript
const handlePublish = async () => {
  const response = await fetch('/api/articles', {
    body: JSON.stringify({
      authorId: 'cmggcrcr40001ijinifhwp0zq' // ← ID fixo!
    })
  });
}
```

**Depois (DINÂMICO):**
```typescript
import { useSession } from 'next-auth/react';

export default function CriarArtigoPage() {
  const { data: session } = useSession();

  const confirmPublish = async () => {
    if (!session?.user?.id) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }

    const response = await fetch('/api/articles', {
      body: JSON.stringify({
        authorId: session.user.id // ← Pega da sessão!
      })
    });
  }
}
```

**Benefícios:**
- ✅ Artigo sempre associado ao usuário correto
- ✅ Validação de sessão antes de publicar
- ✅ Suporta múltiplos autores

#### 4. **Variável de Ambiente**

**Arquivo**: `.env`

**Adicionado:**
```bash
# Perplexity AI API Key (para geração de artigos)
PERPLEXITY_API_KEY="pplx-xxxxxxxxxxxx"
```

**Configuração Vercel:**
1. Dashboard → Settings → Environment Variables
2. Add: `PERPLEXITY_API_KEY` = `pplx-...`
3. Scope: Production
4. Redeploy

### ✅ Correções de Bugs

#### 5. **Fix "Body has already been read"**

**Arquivo**: `app/api/admin/users/[id]/route.ts`

**Antes (ERRO):**
```typescript
// Linha 51: Primeira leitura
if (session.user.id === id) {
  const body = await request.json(); // ← Lê body
  if (body.role && body.role !== 'ADMIN') {
    return NextResponse.json(...);
  }
}

// Linha 61: Segunda leitura (ERRO!)
const body = await request.json(); // ← Body já foi lido!
```

**Depois (CORRIGIDO):**
```typescript
// Parse body UMA VEZ no início
const body = await request.json();
const { name, email, role, password } = body;

// Usa variáveis já extraídas
if (session.user.id === id) {
  if (role && role !== 'ADMIN') {
    return NextResponse.json(...);
  }
}
```

### ✅ Melhorias de UX Implementadas

#### 6. **Redesign Completo da Página de Login**

**Arquivo**: `app/login/page.tsx`

**Mudanças Visuais:**

**Antes:**
```typescript
<h1>🌟 TokenMilagre</h1>
<p>Área Administrativa</p>
<input placeholder="admin@tokenmilagre.xyz" />

{/* Credenciais de teste */}
<p>Admin: admin@tokenmilagre.xyz / admin123</p>
<p>Editor: editor@tokenmilagre.xyz / editor123</p>
```

**Depois:**
```typescript
{/* Logo com efeitos da página Token */}
<div className="relative w-32 h-32">
  {/* Anéis animados */}
  <div className="absolute inset-0 animate-spin-slow">
    <div className="rounded-full border-2 border-dashed border-yellow-400/30"></div>
  </div>
  <div className="absolute inset-2 animate-spin-reverse">
    <div className="rounded-full border-2 border-dashed border-purple-400/30"></div>
  </div>

  {/* Glow effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-pink-300/30 to-purple-300/30 blur-2xl animate-pulse"></div>

  {/* Logo */}
  <Image
    src="/images/TOKEN-MILAGRE-Hero.webp"
    alt="$MILAGRE"
    width={128}
    height={128}
    className="drop-shadow-2xl rounded-full"
    priority
  />
</div>

<h1>Token Milagre</h1>
<input placeholder="seu@email.com" />

{/* Credenciais removidas */}
```

**Animações CSS:**
```css
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
.animate-spin-reverse {
  animation: spin-reverse 15s linear infinite;
}
```

**Removido:**
- ❌ Emoji "🌟" do título
- ❌ Texto "Área Administrativa"
- ❌ Placeholder "admin@tokenmilagre.xyz"
- ❌ Seção "Credenciais de teste"
- ❌ Informação "O dashboard é público..."

**Adicionado:**
- ✅ Logo $MILAGRE com anéis girando
- ✅ Glow effect pulsante
- ✅ Hover scale effect
- ✅ Design minimalista e profissional

#### 7. **Redirecionamento Baseado em Role**

**Arquivo**: `app/login/page.tsx`

**Antes (404 ERROR):**
```typescript
if (result?.error) {
  setError('Credenciais inválidas');
} else {
  router.push('/dashboard'); // ← Rota não existe!
  router.refresh();
}
```

**Depois (INTELIGENTE):**
```typescript
if (result?.error) {
  setError('Credenciais inválidas');
} else {
  const session = await getSession();

  if (session?.user?.role) {
    switch (session.user.role) {
      case 'ADMIN':
        router.push('/dashboard/admin');
        break;
      case 'EDITOR':
        router.push('/dashboard/criar-artigo');
        break;
      case 'VIEWER':
        router.push('/dashboard/noticias');
        break;
      default:
        router.push('/');
    }
  } else {
    router.push('/');
  }

  router.refresh();
}
```

**Fluxo:**
| Role | Destino | Descrição |
|------|---------|-----------|
| **ADMIN** | `/dashboard/admin` | Painel administrativo completo |
| **EDITOR** | `/dashboard/criar-artigo` | Criar artigos com IA |
| **VIEWER** | `/dashboard/noticias` | Visualizar notícias |
| *Outro/Erro* | `/` | Página inicial |

#### 8. **Acesso para EDITOR na Criação de Artigos**

**Arquivo**: `app/dashboard/criar-artigo/page.tsx`

**Antes:**
```typescript
<AdminRoute allowEditor={false}> {/* ← Só ADMIN */}
  <div>...</div>
</AdminRoute>
```

**Depois:**
```typescript
<AdminRoute allowEditor={true}> {/* ← ADMIN e EDITOR */}
  <div>...</div>
</AdminRoute>
```

**Benefício:**
- Editores agora podem gerar e publicar artigos

#### 9. **Modal de Confirmação Antes de Publicar**

**Arquivo**: `app/dashboard/criar-artigo/page.tsx`

**Adicionado:**
```typescript
const [showConfirmModal, setShowConfirmModal] = useState(false);

const confirmPublish = async () => {
  // Lógica de publicação
  setShowConfirmModal(false);
};

{/* Botão Publicar */}
<button onClick={() => setShowConfirmModal(true)}>
  Publicar
</button>

{/* Modal */}
{showConfirmModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="rounded-2xl p-6 border-2">
      <h3>Confirmar Publicação</h3>
      <p>Tem certeza que deseja publicar este artigo? Ele ficará visível publicamente.</p>

      <button onClick={() => setShowConfirmModal(false)}>
        Cancelar
      </button>
      <button onClick={confirmPublish}>
        Confirmar
      </button>
    </div>
  </div>
)}
```

**Benefício:**
- Previne publicações acidentais
- Confirma intenção do usuário

#### 10. **Remover Botão Admin Duplicado**

**Arquivo**: `app/layout-root.tsx`

**Antes:**
- Botão "Admin" na sidebar
- Link "Admin" no dropdown do navbar
- **Redundância confusa**

**Depois:**
```typescript
{/* Admin Link - REMOVIDO da sidebar */}
{/* Acesso via UserDropdown no navbar apenas */}
```

**Benefício:**
- Interface mais limpa
- Sem confusão com duplicatas
- Acesso centralizado no navbar

### 📊 Comparação de Segurança

| Aspecto | ❌ Antes (Vulnerável) | ✅ Agora (Seguro) |
|---------|---------------------|-------------------|
| **API Key** | Exposta no cliente (localStorage) | Protegida no servidor (.env) |
| **Autenticação API** | Sem verificação | ADMIN/EDITOR verificados |
| **Author ID** | Hardcoded | Dinâmico da sessão |
| **Acesso** | Qualquer um podia chamar | Apenas autenticados |
| **Body Parsing** | Duplicado (erro) | Uma vez (correto) |
| **Login UX** | Genérico | Identidade visual $MILAGRE |
| **Redirecionamento** | 404 | Baseado em role |
| **Publicação** | Direta | Com confirmação |

### 📁 Arquivos Modificados

#### Segurança:
- **`app/api/generate-article/route.ts`**
  - + Imports: `getServerSession`, `authOptions`
  - + Autenticação ADMIN/EDITOR
  - + API key do `.env`
  - - Removido `apiKey` do body
  - **186 inserções, 118 deleções**

- **`app/dashboard/criar-artigo/page.tsx`**
  - + Import: `useSession`
  - + `const { data: session } = useSession()`
  - + Modal de confirmação
  - + `authorId: session.user.id`
  - + `allowEditor={true}`
  - - Removido state `apiKey`
  - - Removido useEffect localStorage
  - - Removido campo API key
  - - Removido import `faKey`

#### Bugs:
- **`app/api/admin/users/[id]/route.ts`**
  - Fix: Body parsing movido para o início

#### UX:
- **`app/login/page.tsx`**
  - + Import: `Image`, `getSession`
  - + Logo com anéis animados
  - + Redirecionamento por role
  - + Animações CSS
  - - Removido emoji do título
  - - Removido "Área Administrativa"
  - - Removido credenciais de teste
  - - Removido placeholder email

- **`app/layout-root.tsx`**
  - - Removido botão Admin da sidebar (linhas 145-169)

#### Ambiente:
- **`.env`**
  - + `PERPLEXITY_API_KEY="pplx-..."`

### 🚀 Deploy

**Commits:**
- `83ac6b9` - feat: Adicionar painel administrativo completo
- `ef0dd37` - feat: Correções de segurança críticas e melhorias

**Git Status:** Sincronizado com `origin/main`

**Vercel:**
- Deploy automático iniciado
- **Ação necessária:** Adicionar `PERPLEXITY_API_KEY` nas variáveis de ambiente

### 🔐 Checklist de Segurança

- [x] API key nunca exposta no cliente
- [x] Autenticação obrigatória em endpoints sensíveis
- [x] Verificação de roles (RBAC)
- [x] Author ID dinâmico da sessão
- [x] Body parsing sem duplicação
- [x] Variáveis de ambiente configuradas
- [x] Modal de confirmação para ações críticas
- [x] Redirecionamento seguro baseado em role

### 📚 Documentação

**Para usar o sistema de geração de artigos:**

1. **Login:** Como ADMIN ou EDITOR
2. **Acessar:** `/dashboard/criar-artigo`
3. **Preencher:** Tópico, tipo, categoria, modelo
4. **Gerar:** Sistema usa API key do servidor automaticamente
5. **Editar:** Modo edição ou preview
6. **Publicar:** Confirmar no modal

**Configuração Produção:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add `PERPLEXITY_API_KEY` = `pplx-...`
3. Redeploy

---

## 2025-10-27: 💰 PÁGINAS DE CRIPTOMOEDAS + HEADER COMPARTILHADO

### Motivação

- Eliminar código duplicado do header (velocímetro, título, botões, ticker) entre Home, Gráficos e Notícias
- Criar páginas detalhadas para cada criptomoeda com dados do CoinGecko
- Tornar o rastreador de mercado interativo com links clicáveis
- Atualizar favicon com logo do Token Milagre
- Implementar sistema de cache para otimizar chamadas à API

### ✅ Mudanças Implementadas

#### 1. **Header Compartilhado - DashboardHeader Component**

**Novo Arquivo**: `app/components/DashboardHeader.tsx`

**Motivação**: Header era duplicado em 3 páginas (~250 linhas cada), causando:
- Lag ao trocar de página (remontagem completa)
- Dificuldade de manutenção
- Código duplicado (~750 linhas total)

**Funcionalidades**:
- Velocímetro Fear & Greed Index
- Título e descrição dinâmicos por página
- Botões de ação (Discord, Telegram, Pump.fun)
- TradingView Ticker Widget
- Animação do velocímetro ao mudar de rota
- Animação de fade-in nos títulos

**Props**:
```typescript
interface DashboardHeaderProps {
  title: string;
  description: string;
}
```

**Animações Implementadas**:
```typescript
// Re-anima ao mudar pathname
const pathname = usePathname();
useEffect(() => {
  // Animação do velocímetro
  const timer = setTimeout(() => {
    const targetValue = fearGreed?.value || 50;
    const step = (targetValue - gaugeValue) / 30;
    // ... animação suave
  }, 100);
}, [fearGreed, pathname]);

// Títulos com fade-in cascata
useEffect(() => {
  setAnimateTitle(false);
  const timer = setTimeout(() => setAnimateTitle(true), 100);
}, [title, pathname]);
```

**Arquivo**: `app/layout-root.tsx`

**Integração**:
```typescript
const dashboardHeaderConfig: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Token Milagre',
    description: 'Explore o mercado cripto...'
  },
  '/graficos': {
    title: 'Gráficos e Análises de Mercado',
    description: 'Visualize tendências...'
  },
  '/dashboard/noticias': {
    title: 'Notícias Cripto',
    description: 'Fique atualizado...'
  }
};

const headerConfig = dashboardHeaderConfig[pathname];

{headerConfig && (
  <div className="container mx-auto px-4 py-8">
    <DashboardHeader
      title={headerConfig.title}
      description={headerConfig.description}
    />
  </div>
)}
```

**Arquivos Modificados**:
- `app/page.tsx`: Removidas linhas 333-584 (~250 linhas)
- `app/graficos/page.tsx`: Removidas linhas 115-366 (~250 linhas)
- `app/dashboard/noticias/page.tsx`: Removidas linhas 322-573 (~250 linhas)

**Resultado**: ~750 linhas de código duplicado eliminadas

#### 2. **Sistema de Páginas de Criptomoedas**

**Novo Arquivo**: `app/cripto/[slug]/page.tsx`

**Página Dinâmica**: `/cripto/bitcoin`, `/cripto/ethereum`, etc.

**Seções Implementadas**:

1. **Hero Section**
   - Logo da criptomoeda
   - Nome e símbolo
   - Preço atual com variação 24h (verde/vermelho)
   - Badges: Rank e blockchain

2. **Grid de Estatísticas** (2×3 layout)
   - Market Cap
   - Volume 24h
   - High 24h / Low 24h
   - Circulating Supply
   - Total Supply
   - Max Supply

3. **All-Time High (ATH) / All-Time Low (ATL)**
   - Cards lado a lado
   - Valores e datas formatadas

4. **Descrição**
   - Texto completo em português (fallback inglês)
   - Sanitização HTML (dangerouslySetInnerHTML)

5. **Links Importantes**
   - Website oficial
   - Whitepaper
   - Links sociais (Twitter, Telegram, Reddit)

**Client Component**: Usa `'use client'` para fetch de dados

```typescript
const [crypto, setCrypto] = useState<CryptoData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCrypto = async () => {
    const response = await fetch(`/api/crypto/${slug}`);
    const result = await response.json();
    if (result.success) {
      setCrypto(result.data);
    }
  };
  fetchCrypto();
}, [slug]);
```

#### 3. **API Route - Cryptocurrency Data**

**Novo Arquivo**: `app/api/crypto/[slug]/route.ts`

**Funcionalidades**:
- Busca no banco de dados (cache local)
- Cache de 5 minutos por moeda
- Fetch automático do CoinGecko se dados estiverem desatualizados
- Upsert no banco de dados

**Fluxo**:
```typescript
1. Buscar no PostgreSQL (prisma.cryptocurrency.findUnique)
2. Se existe e < 5min → retornar cache
3. Se não existe ou expirado → fetch CoinGecko
4. Salvar/atualizar no banco (upsert)
5. Retornar dados atualizados
```

**Cache Strategy**:
```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

if (crypto) {
  const timeSinceUpdate = Date.now() - crypto.lastUpdated.getTime();
  if (timeSinceUpdate < CACHE_DURATION) {
    return NextResponse.json({
      success: true,
      data: crypto,
      cached: true,
    });
  }
}
```

**CoinGecko API Integration**:
```typescript
const response = await fetch(
  `https://api.coingecko.com/api/v3/coins/${coingeckoId}?localization=pt&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
);
```

**Blockchain Detection**:
```typescript
let blockchain = 'Própria';
if (data.asset_platform_id === 'ethereum') blockchain = 'Ethereum';
else if (data.asset_platform_id === 'solana') blockchain = 'Solana';
else if (data.asset_platform_id === 'binance-smart-chain') blockchain = 'BSC';
else if (data.asset_platform_id === 'polygon-pos') blockchain = 'Polygon';
```

#### 4. **Modelo Cryptocurrency - Prisma Schema**

**Arquivo**: `prisma/schema.prisma`

**Novo Model**:
```prisma
model Cryptocurrency {
  id                String   @id @default(cuid())

  // Identificadores
  coingeckoId       String   @unique
  symbol            String
  name              String
  slug              String   @unique

  // Dados de Mercado
  currentPrice      Float?
  marketCap         Float?
  marketCapRank     Int?
  totalVolume       Float?
  high24h           Float?
  low24h            Float?
  priceChange24h    Float?
  priceChangePercentage24h Float?
  circulatingSupply Float?
  totalSupply       Float?
  maxSupply         Float?
  ath               Float?
  athDate           DateTime?
  atl               Float?
  atlDate           DateTime?

  // Informações Descritivas
  description       String?
  homepage          String?
  whitepaper        String?
  blockchain        String?

  // Links sociais (JSON)
  socialLinks       String?

  // Imagens
  imageSmall        String?
  imageLarge        String?

  // Metadados
  lastUpdated       DateTime @default(now())
  createdAt         DateTime @default(now())

  @@index([symbol])
  @@index([slug])
  @@index([marketCapRank])
}
```

**Migração**: Aplicada com `npx prisma db push`

#### 5. **Script de Seed - Popular Database**

**Novo Arquivo**: `scripts/seed-cryptocurrencies.ts`

**Funcionalidades**:
- Popula banco com top 50 criptomoedas do CoinGecko
- Rate limiting: 6 segundos entre requisições (10 calls/min)
- Error handling com contadores de sucesso/erro
- Logs detalhados do progresso

**Lista de Moedas** (Top 10 inicial):
```typescript
const TOP_CRYPTOS = [
  { coingeckoId: 'bitcoin', slug: 'bitcoin' },
  { coingeckoId: 'ethereum', slug: 'ethereum' },
  { coingeckoId: 'tether', slug: 'tether' },
  { coingeckoId: 'binancecoin', slug: 'bnb' },
  { coingeckoId: 'solana', slug: 'solana' },
  { coingeckoId: 'ripple', slug: 'xrp' },
  { coingeckoId: 'cardano', slug: 'cardano' },
  { coingeckoId: 'dogecoin', slug: 'dogecoin' },
  { coingeckoId: 'polygon', slug: 'polygon' },
  { coingeckoId: 'chainlink', slug: 'chainlink' },
];
```

**Execução**: `npx tsx scripts/seed-cryptocurrencies.ts`

**Rate Limiting**:
```typescript
await new Promise((resolve) => setTimeout(resolve, 6000));
```

**Nota**: População também ocorre sob demanda via API route

#### 6. **CustomCryptoScreener - Links Interativos**

**Arquivo**: `components/CustomCryptoScreener.tsx`

**Mudança**: Nomes de moedas agora são links

**Antes**:
```typescript
<div className="flex items-center gap-3">
  <img src={info.row.original.image} alt={info.getValue()} />
  <div>
    <p>{info.getValue()}</p>
    <p>{info.row.original.symbol}</p>
  </div>
</div>
```

**Depois**:
```typescript
import Link from 'next/link';

<Link href={`/cripto/${slug}`} className="flex items-center gap-3 hover:opacity-70">
  <img src={info.row.original.image} alt={info.getValue()} />
  <div>
    <p>{info.getValue()}</p>
    <p>{info.row.original.symbol}</p>
  </div>
</Link>
```

#### 7. **Favicon - Logo Token Milagre**

**Novos Arquivos**:
- `public/favicon.ico` (226KB, multi-size: 16x16, 32x32, 48x48)
- `public/apple-touch-icon.png` (51KB, 180x180)
- `public/icon-192.png` (57KB, 192x192)
- `public/icon-512.png` (296KB, 512x512)

**Geração**: Usando ImageMagick a partir do logo existente

**Arquivo**: `app/layout.tsx`

**Configuração**:
```typescript
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
  apple: '/apple-touch-icon.png',
  shortcut: '/favicon.ico',
}
```

#### 8. **Next.js Config - CoinGecko Images**

**Arquivo**: `next.config.ts`

**Problema**: Next.js Image component bloqueava imagens externas

**Solução**: Adicionar `remotePatterns`

```typescript
images: {
  unoptimized: false,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'coin-images.coingecko.com',
      port: '',
      pathname: '/coins/images/**',
    },
  ],
}
```

**Benefícios**:
- Otimização automática de imagens (resize, WebP)
- Lazy loading
- Blur placeholder

### 🐛 Correções de Bugs

#### 1. **Erro: Cannot read properties of undefined (reading 'cryptocurrency')**

**Arquivo**: `scripts/seed-cryptocurrencies.ts`

**Problema**: Import errado do Prisma Client
```typescript
// ❌ Errado
import { PrismaClient } from '../lib/generated/prisma';
const prisma = new PrismaClient();
```

**Solução**:
```typescript
// ✅ Correto
import { prisma } from '../lib/prisma';
```

**Alinhamento**: Mesmo padrão usado em todas API routes

#### 2. **Erro: Cannot read properties of undefined (reading 'findUnique')**

**Arquivo**: `app/api/crypto/[slug]/route.ts`

**Mesmo problema**: Import incorreto do Prisma

**Solução**: Atualizado para `import { prisma } from '@/lib/prisma'`

#### 3. **Build Error - Next.js 15 Params Type**

**Arquivo**: `app/api/crypto/[slug]/route.ts`

**Erro da Vercel**:
```
Type error: Route "app/api/crypto/[slug]/route.ts" has an invalid "GET" export:
  Type "{ params: { slug: string; }; }" is not a valid type for the function's second argument.
```

**Causa**: Next.js 15 mudou a assinatura dos route handlers - `params` agora é uma Promise

**Antes**:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
```

**Depois**:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
```

**Commits**:
- Fix inicial: `7cc512e`
- Fix Next.js 15: `1dd0702`

### 📊 Estatísticas

**Arquivos Criados**: 9
- `app/components/DashboardHeader.tsx`
- `app/cripto/[slug]/page.tsx`
- `app/api/crypto/[slug]/route.ts`
- `scripts/seed-cryptocurrencies.ts`
- `public/favicon.ico`
- `public/apple-touch-icon.png`
- `public/icon-192.png`
- `public/icon-512.png`

**Arquivos Modificados**: 8
- `app/page.tsx` (~250 linhas removidas)
- `app/graficos/page.tsx` (~250 linhas removidas)
- `app/dashboard/noticias/page.tsx` (~250 linhas removidas)
- `app/layout-root.tsx` (+29 linhas)
- `app/layout.tsx` (favicon config)
- `components/CustomCryptoScreener.tsx` (links)
- `next.config.ts` (remotePatterns)
- `prisma/schema.prisma` (+48 linhas)

**Código**:
- Linhas Adicionadas: ~1,389
- Linhas Removidas: ~955
- Resultado Líquido: +434 linhas
- Código Duplicado Eliminado: ~750 linhas

**Database**:
- Novo Model: Cryptocurrency
- Campos: 27
- Índices: 3 (symbol, slug, marketCapRank)

### 🎯 Resultado Final

**Performance**:
- ✅ Header persiste entre navegações (sem lag)
- ✅ Cache de 5 minutos reduz chamadas API
- ✅ População sob demanda (não precisa seed)
- ✅ Imagens otimizadas automaticamente

**User Experience**:
- ✅ Animações suaves no header
- ✅ Links clicáveis no rastreador de mercado
- ✅ Páginas detalhadas com dados completos
- ✅ Favicon personalizado
- ✅ Loading states durante fetch

**Code Quality**:
- ✅ ~750 linhas duplicadas eliminadas
- ✅ Padrão consistente de imports Prisma
- ✅ Type-safe com TypeScript
- ✅ Compatível com Next.js 15

**API Integration**:
- ✅ CoinGecko API v3 (público, sem key)
- ✅ Rate limiting respeitado (6s delay)
- ✅ Error handling robusto
- ✅ Fallbacks (PT → EN → null)

### 🚀 Commits

**Principal**:
```
7cc512e - feat: Adicionar páginas de criptomoedas e otimizar header compartilhado
```

**Fix Build**:
```
1dd0702 - fix: Corrigir tipo de params em API route para Next.js 15
```

### 📝 Notas Técnicas

**Prisma Import Pattern** (estabelecido):
```typescript
// ✅ Sempre usar
import { prisma } from '@/lib/prisma';  // API routes
import { prisma } from '../lib/prisma'; // Scripts

// ❌ Nunca usar
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();
```

**Next.js 15 Route Handlers**:
```typescript
// Params agora é Promise
{ params }: { params: Promise<{ slug: string }> }
const { slug } = await params;
```

**CoinGecko Rate Limit**:
- Free tier: ~10-50 calls/minute
- Script usa: 6s delay (10 calls/min)
- Produção: Cache de 5min reduz necessidade

---

## 2025-10-26: 🎨 REDESIGN HOME + PÁGINA GRÁFICOS OTIMIZADA

### Motivação

- Melhorar aproveitamento de espaço na home page
- Integrar velocímetro Fear & Greed com cards de mercado
- Padronizar design da página de Gráficos com outras páginas
- Substituir carousel por grid de cards mais eficiente
- Aumentar número de notícias visíveis na home

### ✅ Mudanças Implementadas

#### 1. **Últimas Notícias - Grid de 3 Colunas**

**Arquivo**: `app/page.tsx`

**Alterações**:
- Grid alterado de `md:grid-cols-2` para `md:grid-cols-2 lg:grid-cols-3`
- Número de notícias exibidas aumentado de 4 para 6
- Layout resultante: 2 linhas × 3 colunas no desktop

```typescript
// Antes
.slice(0, 4);
<div className="grid md:grid-cols-2 gap-4">

// Depois
.slice(0, 6);
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### 2. **Aprenda sobre Cripto - Novo Design com Cards**

**Arquivo**: `app/page.tsx`

**Mudanças**:
- ❌ Removido carousel completo (slides, botões, indicadores)
- ✅ Adicionado grid de 4 cards: `md:grid-cols-2 lg:grid-cols-4`
- ✅ Design idêntico à página de Educação:
  - Badge de nível com ícone (iniciante/intermediário/avançado)
  - Cores dinâmicas: verde (#22c55e), amarelo (#eab308), vermelho (#ef4444)
  - Gradiente de fundo sutil baseado no nível
  - Glow effect no topo ao hover
  - Tempo de leitura
  - Footer com "Ler artigo" + seta animada

**Helper functions adicionadas**:
```typescript
const getLevelGradient = (level: string | null) => { ... }
const getLevelColor = (level: string | null) => { ... }
const getLevelIcon = (level: string | null) => { ... }
```

**Imports adicionados**:
```typescript
import { faSeedling, faGraduationCap, faRocket, faBook } from '@fortawesome/free-solid-svg-icons';
```

#### 3. **Ferramentas Essenciais - 4º Card Adicionado**

**Arquivo**: `app/page.tsx`

**Alterações**:
- Adicionado card "Phantom" (carteira Solana)
- Grid alterado de `md:grid-cols-3` para `md:grid-cols-2 lg:grid-cols-4`
- Total de 4 recursos em destaque

```typescript
{
  name: 'Phantom',
  category: 'Wallet',
  description: 'Carteira principal do ecossistema Solana',
  gradient: 'linear-gradient(135deg, #AB9FF2 0%, #9388E5 100%)',
  stats: '7M+ usuários',
  verified: true,
  url: '/recursos/phantom'
}
```

#### 4. **Hero Reimaginado - Velocímetro Integrado**

**Arquivo**: `app/page.tsx`

**Layout Desktop (lg+)**:
- Grid de 3 colunas: `lg:grid-cols-[1fr_auto_1fr]`
- **Coluna Esquerda**: Capitalização Total + Volume 24h (empilhados verticalmente)
- **Coluna Central**: Velocímetro Fear & Greed (destaque)
- **Coluna Direita**: Dominância BTC + Dominância ETH (empilhados verticalmente)

**Layout Mobile/Tablet**:
- Grid 2×2 com os 4 cards de estatísticas (versão compacta)
- Velocímetro centralizado abaixo (versão reduzida: 300px × 220px)
- IDs SVG únicos para mobile: `rainbowGradientMobile`, `intensiveGlowMobile`

**Estrutura**:
```typescript
<div className="space-y-6">
  {/* Mobile: Cards 2x2 */}
  <div className="lg:hidden grid grid-cols-2 gap-4">
    {/* 4 cards compactos */}
  </div>

  {/* Mobile: Velocímetro */}
  <div className="lg:hidden">
    {/* Velocímetro menor */}
  </div>

  {/* Desktop: Layout 3 colunas */}
  <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr]">
    {/* Cards esquerda + Velocímetro central + Cards direita */}
  </div>
</div>
```

#### 5. **Página Gráficos - Padronização e Otimização**

**Arquivo**: `app/graficos/page.tsx`

**Hero Section - Estilo Educação**:
```typescript
// Estrutura igual à página de Educação
<div className="container mx-auto px-4 py-8">
  <div className="space-y-16">
    <div className="space-y-6 max-w-3xl">
      {/* Badge */}
      <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold">
        Gráficos
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Gráficos e Análises de Mercado
      </h1>

      {/* Descrição */}
      <p className="text-xl leading-relaxed">...</p>
    </div>
  </div>
</div>
```

**Títulos Padronizados**:
- H1 (hero): `text-4xl md:text-5xl font-bold leading-tight`
- H2 (seções): `text-3xl font-bold font-[family-name:var(--font-poppins)] mb-2`
- H3 (subseções): `text-xl font-bold font-[family-name:var(--font-poppins)] mb-3`
- H4 (widgets): `text-lg font-bold mb-3`

**Descrições Padronizadas**:
- Todas: `text-lg leading-relaxed` com `color: var(--text-secondary)`

**Layout 100% Aproveitado**:
- Container padrão: `container mx-auto px-4 py-8`
- Conteúdo usa 100% da largura disponível
- Títulos limitados a `max-w-3xl` (consistente com outras páginas)

**Seções Ajustadas**:
- ✅ Removido título duplicado "Análise de Mercado Cripto"
- ✅ Mapa de Calor - S&P 500
- ✅ Mapa de Mercado de Criptomoedas
- ✅ Crypto Bubbles - Visualização Interativa
- ✅ Acompanhe $MILAGRE
- ✅ Widgets de análise técnica (BTC/ETH/SOL)

### 🐛 Correções de Bugs

**Erro de Build - Chaves Desbalanceadas**:
- **Problema**: Faltava fechar `<div className="space-y-6">` do hero integrado
- **Solução**: Adicionado fechamento `</div>` após o grid desktop
- **Linhas**: `app/page.tsx:810`

### 📊 Estatísticas

**Arquivos Modificados**: 2
- `app/page.tsx` (mudanças principais)
- `app/graficos/page.tsx` (padronização completa)

**Linhas Adicionadas**: ~250
**Linhas Removidas**: ~180
**Componentes Removidos**: 1 (carousel completo)
**Componentes Adicionados**: Grid de cards educacionais, layout hero integrado

### 🎯 Resultado Final

**Home Page**:
- Layout hero mais integrado e visualmente equilibrado
- Velocímetro como ponto focal central no desktop
- Mais notícias visíveis (6 vs 4)
- Cards educacionais modernos substituindo carousel
- 4 ferramentas essenciais em destaque

**Página Gráficos**:
- Design consistente com outras páginas (Educação, Recursos)
- Aproveitamento de 100% da largura para gráficos
- Tipografia padronizada e hierarquia clara
- Melhor legibilidade com `text-lg` nas descrições

### 🔄 Próximos Passos Sugeridos

- [ ] Considerar adicionar mais recursos em "Ferramentas Essenciais"
- [ ] Avaliar adicionar filtros na seção "Últimas Notícias"
- [ ] Considerar adicionar mais gráficos de análise técnica
- [ ] Testar performance com 6 notícias vs 4

---

## 2025-10-25 (tarde): 🗄️ MIGRAÇÃO RECURSOS 100% PARA BANCO DE DADOS

### Motivação

- Eliminar inconsistência: artigos e notícias usavam PostgreSQL, mas recursos tinham fallback hardcoded
- Centralizar todos os dados em single source of truth
- Facilitar gerenciamento via Prisma Studio
- Preparar sistema para crescimento escalável
- Simplificar código removendo lógica de fallback

### 🔍 Situação Anterior

**Recursos usavam sistema híbrido**:
- Dados hardcoded em `lib/data/resources-data.ts`
- `lib/resources.ts` tentava Prisma primeiro
- Se banco vazio ou erro → fallback silencioso para hardcoded
- Inconsistente com artigos/notícias que eram 100% banco

**Problemas identificados**:
- ❌ Duplicação de dados (código + banco)
- ❌ Fallback silencioso mascarava problemas
- ❌ Dificuldade para adicionar novos recursos
- ❌ Inconsistência arquitetural

### ✅ Mudanças Implementadas

#### 1. **Remoção do Fallback Hardcoded**

**Arquivo**: `lib/resources.ts`

**Antes**:
```typescript
// ❌ Código antigo
try {
  const dbResources = await prisma.resource.findMany(...);
  if (dbResources.length > 0) {
    return dbResources.map(parseResource);
  }
  // Fallback para dados hardcoded
  console.log('⚠️ Database empty, using hardcoded resources');
  return hardcodedResources;
} catch (error) {
  // Fallback em caso de erro
  return hardcodedResources;
}
```

**Depois**:
```typescript
// ✅ Código novo (100% Prisma)
const dbResources = await prisma.resource.findMany({
  where,
  orderBy: { name: 'asc' },
});
return dbResources.map(parseResource);
```

**Funções simplificadas**:
- `getAllResources()` - sem try-catch, sem fallback
- `getResourceBySlug()` - retorna null se não encontrar
- `getAllResourceSlugs()` - direto do banco
- `getRelatedResources()` - apenas Prisma

**Arquivos modificados**:
- ❌ Deletado: `lib/data/resources-data.ts`
- ✅ Simplificado: `lib/resources.ts` (-120 linhas)
- 📦 Backup: Movido para `/home/destakar/Trabalho/resources-data.backup.ts`

#### 2. **Adicionar Modelo Resource ao Schema**

**Arquivo**: `prisma/schema.prisma`

**Novo modelo Resource** (+54 linhas):
```prisma
model Resource {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  category    String   // wallets, exchanges, browsers, defi, explorers, tools
  verified    Boolean  @default(true)

  // Básico
  shortDescription String
  officialUrl      String
  platforms        String   // JSON array
  tags             String   // JSON array

  // Hero section
  heroTitle       String
  heroDescription String
  heroGradient    String

  // Why good section
  whyGoodTitle   String
  whyGoodContent String  // JSON array

  // Features
  features String  // JSON array

  // How to start
  howToStartTitle String
  howToStartSteps String  // JSON array

  // Pros and Cons
  pros  String  // JSON array
  cons  String  // JSON array

  // FAQ
  faq String  // JSON array

  // Security tips
  securityTips String  // JSON array

  // Opcionais
  showCompatibleWallets Boolean @default(false)
  relatedResources      String? // JSON array

  // Metadados
  views         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lastVerified  DateTime @default(now())

  @@index([slug])
  @@index([category])
  @@index([verified])
}
```

**Por que campos JSON**:
- PostgreSQL suporta JSONB nativamente
- Flexibilidade para adicionar campos
- Compatível com estrutura existente
- Parse simples com `JSON.parse()`

#### 3. **Garantir Dados de Seed em Produção**

**Arquivo**: `prisma/additional-resources.ts` (101KB, 18 recursos)

Contém dados completos de:
- **4 Wallets**: MetaMask, Phantom, Ledger, Trust Wallet
- **2 Browsers**: Brave, Firefox
- **3 Exchanges**: Binance, Coinbase, Kraken
- **2 Explorers**: Etherscan, Solscan
- **2 DeFi**: Uniswap, Raydium, Aave
- **3 Tools**: CoinGecko, CoinMarketCap, DeFi Llama
- **1 Blockchain Explorer**: Blockchain.com

**Arquivo**: `app/api/admin/seed-resources/route.ts`

**Funções**:
```typescript
// POST /api/admin/seed-resources
// Popula banco com 18 recursos em produção
// Requer autenticação ADMIN

// GET /api/admin/seed-resources
// Verifica quantidade de recursos no banco
// Retorna: { count: 18, resources: [...] }
```

**Fix aplicado** (commit 6aa0170):
```typescript
// ❌ ANTES (causava erro TypeScript)
const { PrismaClient } = await import('@/lib/generated/prisma');
const prismaTemp = new PrismaClient();
await prismaTemp.resource.upsert(...);

// ✅ DEPOIS (correto)
await prisma.resource.upsert(...);
```

#### 4. **Verificação e Testes**

**Banco local verificado**:
```bash
✅ Total de recursos no banco: 18
✅ Recursos: Brave, Firefox, MetaMask, Phantom, Ledger, Trust Wallet,
            Binance, Coinbase, Kraken, Etherscan, Solscan,
            Uniswap, Raydium, Aave, CoinGecko, CoinMarketCap,
            DeFi Llama, Blockchain Explorer
```

**Testes de funções** (sem fallback):
```
✅ getAllResources() - 18 recursos
✅ getAllResources({ verified: true }) - 18 recursos verificados
✅ getAllResources({ category: "wallets" }) - 4 wallets
✅ getResourceBySlug("metamask") - MetaMask encontrado
✅ getAllResourceSlugs() - 18 slugs
✅ getRelatedResources("wallets", "metamask", 3) - 3 relacionados
```

**Build TypeScript**:
```bash
✅ npx tsc --noEmit - Sem erros
```

### 🚀 Deploy e Correções

#### Tentativa 1 (commit 7f9b59e) - ❌ FALHOU
**Problema**: Schema sem modelo Resource
**Erro**: `Property 'resource' does not exist on type 'PrismaClient'`
**Razão**: `schema.prisma` não estava commitado

#### Tentativa 2 (commit 6aa0170) - ❌ FALHOU
**Problema**: Fix da API de seed, mas schema ainda faltando
**Erro**: Mesmo erro TypeScript
**Razão**: Apenas corrigiu API, mas modelo Resource ausente

#### Tentativa 3 (commit eabbbcf) - ✅ PASSOU
**Fix**: Adicionar modelo Resource ao schema
**Resultado**: Build passou na Vercel!
**Deploy**: https://tokenmilagre.xyz

### 📊 Estado Final do Projeto

| Conteúdo | Fonte de Dados | Fallback | Status |
|----------|----------------|----------|--------|
| **Artigos Educacionais** | PostgreSQL (Prisma) | Nenhum | ✅ 100% |
| **Notícias** | PostgreSQL (Prisma) | Nenhum | ✅ 100% |
| **Recursos** | PostgreSQL (Prisma) | ~~Hardcoded~~ **Nenhum** | ✅ 100% |

**Arquitetura unificada**: Todos os conteúdos agora seguem o mesmo padrão!

### ⚠️ Passo Crítico Pós-Deploy

**Se banco de produção estiver vazio de recursos**:

Fazer login como ADMIN e executar:
```bash
POST https://tokenmilagre.xyz/api/admin/seed-resources
Authorization: Bearer <token-admin>
```

Isso populará os 18 recursos no PostgreSQL de produção.

**Verificar antes**:
```bash
GET https://tokenmilagre.xyz/api/admin/seed-resources
# Retorna: { count: 18, resources: [...] }
```

Se `count >= 18`, banco já tem dados e não precisa seed!

### 🎯 Benefícios Alcançados

✅ **Single source of truth** - Todos dados centralizados no PostgreSQL
✅ **Consistência arquitetural** - Mesmo padrão de artigos e notícias
✅ **Código mais limpo** - Removidas 120 linhas de lógica de fallback
✅ **Gerenciável** - Recursos editáveis via Prisma Studio
✅ **Escalável** - Fácil adicionar novos recursos via admin
✅ **Performance** - Menos código executado, queries diretas
✅ **Transparência** - Erros agora aparecem claramente (não mascarados)

### 🐛 Lições Aprendidas

1. **Sempre commitar schema.prisma**: Modelo faltando causou 2 builds falhados
2. **Verificar git status antes de push**: `schema.prisma` estava modificado mas não commitado
3. **Usar instância Prisma existente**: Evitar criar `new PrismaClient()` em API routes
4. **Testar TypeScript localmente**: `npx tsc --noEmit` antes de push

### 📝 Commits da Migração

```bash
7f9b59e - refactor: Migrar recursos 100% para banco de dados PostgreSQL
6aa0170 - fix: Corrigir importação do Prisma no seed de recursos
eabbbcf - feat: Adicionar modelo Resource ao schema Prisma ✅
```

### 📚 Arquivos Modificados

```
lib/resources.ts                          # Simplificado (-120 linhas)
lib/data/resources-data.ts                # Deletado
prisma/schema.prisma                      # +54 linhas (modelo Resource)
prisma/additional-resources.ts            # Novo (101KB, dados seed)
app/api/admin/seed-resources/route.ts     # Corrigido
```

**Backup criado**:
```
/home/destakar/Trabalho/resources-data.backup.ts
prisma/additional-resources.backup.ts
```

### 🔄 Próximos Passos (Sugestões)

1. ✅ Criar endpoint público GET `/api/resources` (sem autenticação)
2. ✅ Adicionar paginação em `getAllResources()`
3. ✅ Implementar cache ISR nas páginas de recursos
4. ✅ Criar página admin para CRUD de recursos via UI
5. ✅ Migrar `platforms` e `tags` para campos relacionados (tabelas separadas)

---

## 2025-10-25 (manhã): 🚀 EXPANSÃO PÁGINA DE RECURSOS + SERVER MANAGER SCRIPT

### Motivação

- Expandir conteúdo educativo da seção Recursos
- Criar páginas detalhadas para navegadores e wallets principais
- Resolver problemas de servidor em loop de forma eficiente
- Dar controle total ao usuário sobre gerenciamento do servidor

### 📚 Melhorias na Página de Recursos (Brave como Modelo)

**Arquivo**: `lib/data/resources-data.ts` + `app/recursos/[slug]/ResourceDetailClient.tsx`

**Tipo `ResourceDetail` atualizado com novos campos**:
```typescript
interface ResourceDetail {
  // ... campos existentes
  showCompatibleWallets?: boolean;  // Condicional - só navegadores
  faq: { question: string; answer: string; }[];
  relatedResources?: string[];  // Slugs de recursos relacionados
}
```

**Nova seção: FAQ (Perguntas Frequentes)**:
- Accordion expansível (apenas 1 pergunta aberta por vez)
- 4 perguntas educativas por recurso
- Ícone rotativo indicando estado (aberto/fechado)
- Exemplo Brave: "Brave é grátis?", "Funciona no celular?", "Quanto BAT posso ganhar?"

**Nova seção: Recursos Relacionados**:
- Grid com 3 cards de recursos similares/complementares
- Links clicáveis para `/recursos/{slug}`
- Animação hover com elevação
- Condicional - só aparece se houver recursos relacionados

**Seção "Wallets Compatíveis" agora condicional**:
- Só aparece se `showCompatibleWallets === true`
- Apenas navegadores (Brave, Firefox) têm essa seção
- Wallets (MetaMask, Phantom) não mostram essa seção
- Título e descrição dinâmicos com nome do recurso

**Ordem final das seções**:
1. Hero + Badges
2. Por que é bom
3. Recursos Principais
4. **Wallets Compatíveis** (condicional)
5. Como Começar
6. Prós e Contras
7. **FAQ** (nova ✨)
8. Dicas de Segurança
9. **Recursos Relacionados** (nova ✨)

### 🆕 Criação de 3 Novas Páginas de Recursos

#### 1️⃣ **Firefox** (`/recursos/firefox`)

**Categoria**: Navegador
**Gradiente**: Laranja (#FF7139 → #E66000)
**Destaques**:
- Código 100% open-source (Mozilla)
- Multi-Account Containers (exclusivo)
- DNS sobre HTTPS nativo
- Proteção contra fingerprinting
- `showCompatibleWallets: true`

**FAQ específico**:
- Firefox vs Chrome em privacidade
- Compatibilidade com wallets Web3
- O que são Multi-Account Containers
- Performance comparada

**Recursos relacionados**: Brave, MetaMask, Phantom

---

#### 2️⃣ **MetaMask** (`/recursos/metamask`)

**Categoria**: Wallet
**Gradiente**: Laranja (#F6851B → #E2761B)
**Destaques**:
- 30+ milhões de usuários ativos
- Suporte todas redes EVM (Ethereum, Polygon, BSC, Arbitrum, etc)
- Swap integrado com comparação de DEXs
- WalletConnect para DApps mobile
- `showCompatibleWallets: false` (é wallet, não navegador)

**FAQ específico**:
- Segurança e não-custodial
- Suporte para Solana/Bitcoin (não tem)
- Recuperação de senha vs seed phrase
- Como adicionar redes (Polygon, BSC)

**Dicas de segurança**:
- NUNCA compartilhar seed phrase
- Verificar URLs antes de conectar
- Usar hardware wallet (Ledger/Trezor)
- Revogar aprovações antigas (Revoke.cash)

**Recursos relacionados**: Phantom, Brave, Uniswap

---

#### 3️⃣ **Phantom** (`/recursos/phantom`)

**Categoria**: Wallet
**Gradiente**: Roxo (#AB9FF2 → #7B61FF)
**Destaques**:
- Wallet dominante do Solana
- Suporte a NFTs e cNFTs comprimidos
- Staking de SOL integrado (~7% APY)
- Transações ultra-rápidas (~400ms, ~$0.00025)
- Multi-chain: Solana + Ethereum + Polygon
- `showCompatibleWallets: false`

**FAQ específico**:
- Segurança Phantom
- Suporte Ethereum (sim, agora tem)
- Diferença NFT vs cNFT
- Como fazer staking de SOL

**Dicas de segurança específicas Solana**:
- Cuidado com airdrops falsos
- Sites falsos de mint de NFT
- NFTs maliciosos na wallet

**Recursos relacionados**: MetaMask, Brave, Raydium

---

### 🔧 Server Manager Script Interativo

**Arquivo criado**: `/home/destakar/Trabalho/server-manager.sh`

**Problema resolvido**:
- Servidor entrando em loop infinito (CPU 78%+)
- Processos zombie Node.js acumulando
- Dificuldade para diagnosticar e corrigir problemas

**Funcionalidades implementadas**:

**1. Menu Interativo (estilo gemini-central.sh)**:
```
╔══════════════════════════════════════════════════════════════════╗
║        🚀 SERVER MANAGER - Token Milagre Platform 🚀            ║
╚══════════════════════════════════════════════════════════════════╝

Status: ● Next.js ONLINE (PID: 15766)

1. 🚀 Iniciar Servidor
2. 🛑 Parar Servidor
3. 🔄 Reiniciar Servidor
4. 📊 Ver Status
5. 💀 Kill Server (Forçar Encerramento)
6. 📋 Ver Logs
7. 🧹 Limpar Processos Node.js
0. 👋 Sair
```

**2. Detecção Automática de Loop**:
```typescript
check_server_health(PID) {
  // Se CPU > 70% → Loop detectado
  return 2  // Status: EM LOOP
}
```

**Output quando detecta loop**:
```
🔹 Next.js Server: EM LOOP! (PID: 9191)
   ⚠ CPU: 78.6% | MEM: 18.7%
   ⚠ Servidor travado em loop infinito
   💡 Use opção 5 (Kill Server) para corrigir
```

**3. Get PID Mais Robusto**:
```bash
# Usa ss/netstat em vez de lsof (mais confiável)
ss -tulpn | grep :3000 | grep -oP 'pid=\K[0-9]+'
```

**4. Monitoramento de Recursos**:
- Mostra CPU% e MEM% em tempo real
- Detecta processos zombie
- Sugere ações corretivas

**5. Limpeza Inteligente**:
```bash
# Mata apenas processos ativos
pkill -9 -f "next-server"

# Informa sobre zombies (limpam sozinhos)
print_info "Processos zombie serão limpos automaticamente"
```

**6. Modo Linha de Comando**:
```bash
./server-manager.sh status    # Ver status
./server-manager.sh start     # Iniciar
./server-manager.sh stop      # Parar
./server-manager.sh restart   # Reiniciar
./server-manager.sh kill      # Forçar encerramento
./server-manager.sh clean     # Limpar processos
```

**7. Alias Recomendado**:
```bash
alias srv='/home/destakar/Trabalho/server-manager.sh'
# Uso: srv, srv status, srv restart
```

**Resultado**: Problema de loop resolvido em segundos. CPU do novo servidor estabilizou em ~15-20%.

---

### 🔄 Atualização na Skill project-context

**Arquivo**: `.claude/skills/project-context/SKILL.md`

**Mudança**: Removido auto-start do servidor

**Antes**:
```yaml
allowed-tools: Read, Bash
# Seção completa "Auto-Start Development Server"
# Iniciava automaticamente npm run dev
```

**Depois**:
```yaml
allowed-tools: Read
# Auto-start removido
# Nota adicionada: Use server-manager.sh
```

**Justificativa**:
- Problemas de loop tornaram auto-start problemático
- Script dedicado oferece melhor controle e diagnóstico
- Usuário prefere gerenciamento manual

---

### 🐛 Correções de Bugs

**1. Erro de Sintaxe - resources-data.ts**

**Arquivo**: `lib/data/resources-data.ts:607`

**Erro**:
```typescript
features: [
  { icon: '📱', title: '...', description: '...' },
},  // ❌ ERRADO - Fecha objeto em vez de array
```

**Correção**:
```typescript
features: [
  { icon: '📱', title: '...', description: '...' },
],  // ✅ CORRETO - Fecha array
```

**Sintoma**: `Parsing ecmascript source code failed`
**Build bloqueado**: Sim
**Resolvido**: ✅

---

### 📊 Estatísticas desta Atualização

**Linhas de código adicionadas**: ~500+
**Arquivos modificados**: 4
**Arquivos criados**: 1 (server-manager.sh)
**Novas páginas**: 3 (Firefox, MetaMask, Phantom)
**Novas seções por página**: 2 (FAQ, Recursos Relacionados)
**Bugs corrigidos**: 2

**Recursos agora com páginas dedicadas**: 4/18 (22%)
- ✅ Brave (navegador)
- ✅ Firefox (navegador)
- ✅ MetaMask (wallet EVM)
- ✅ Phantom (wallet Solana)

**Próximos recursos sugeridos**:
- Ledger (hardware wallet)
- Trust Wallet (wallet multicurrency)
- Uniswap (DEX Ethereum)
- Raydium (DEX Solana)

---

### 🎯 Melhorias de UX

1. **Conteúdo educativo expandido**: Usuários têm informações completas sobre navegadores e wallets principais
2. **FAQ reduz dúvidas**: Perguntas comuns respondidas diretamente na página
3. **Navegação cross-sell**: Recursos relacionados incentivam exploração
4. **Transparência total**: Prós e contras honestos ajudam decisões informadas
5. **Gerenciamento servidor**: Script elimina frustração com loops e travamentos

---

### 🔗 Commits Relacionados

```bash
# A fazer (se necessário):
git add lib/data/resources-data.ts
git add app/recursos/[slug]/ResourceDetailClient.tsx
git add app/recursos/page.tsx
git commit -m "feat: Adicionar páginas Firefox, MetaMask e Phantom + FAQ e Recursos Relacionados"
```

**Nota**: Script `server-manager.sh` está fora do projeto (`/home/destakar/Trabalho/`) e não será versionado.

---

**Próximas tarefas sugeridas**:
1. Criar páginas para Ledger, Trust Wallet, Uniswap, Raydium
2. Adicionar imagens/screenshots nas páginas de recursos
3. Implementar sistema de avaliação/comentários de usuários
4. Criar comparativos (ex: "MetaMask vs Phantom: Qual escolher?")

---

## 2025-10-24 (tarde - update 2): 🔧 MELHORIAS NAS SKILLS E AUTO-START DO SERVIDOR

### Motivação

- Documentar erro comum "Module not found" para evitar repetição
- Automatizar inicialização do servidor de desenvolvimento
- Melhorar experiência de onboarding em novas sessões

### 🔴 Aprendizado Adicionado: Erro "Module not found"

**Skill atualizada**: `article-creation`

**Nova seção adicionada** (linha 307-347):
- **Sintoma**: `Error: Cannot find module '../lib/generated/prisma'`
- **Causa raiz**: Script criado fora da estrutura do projeto
- **Explicação técnica**: Caminhos relativos calculados do diretório do script
- **Solução visual**: Comparação de scripts em `/tmp/` vs `scripts/`
- **Regra de ouro**: SEMPRE criar em `tokenmilagre-platform/scripts/`

**Exemplo didático**:
```javascript
// ❌ /tmp/verify.js → Procura em /lib/generated/prisma
// ✅ scripts/verify.js → Procura em tokenmilagre-platform/lib/generated/prisma
```

**Benefício**: Futuras sessões e equipe evitarão esse erro comum

### 🚀 Auto-Start do Servidor de Desenvolvimento

**Skill atualizada**: `project-context`

**Nova funcionalidade**:
1. **Check automático** - Verifica se porta 3000 está em uso (`lsof -i :3000`)
2. **Start automático** - Se não estiver rodando: `npm run dev > /dev/null 2>&1 &`
3. **Notificação inteligente**:
   - Se iniciar servidor: Informa usuário "✅ Servidor iniciado"
   - Se já estiver rodando: Silent skip (não mostra nada)

**Mudanças técnicas**:
- Frontmatter atualizado: `allowed-tools: Read, Bash`
- Nova seção "🚀 Auto-Start Development Server" (linhas 42-78)
- Instruções Claude atualizadas com passo 2: auto-start

**Exceção documentada**:
- Esta é uma exceção explícita à regra "SEMPRE PERGUNTAR"
- Justificativas: pedido explícito do usuário, não destrutivo, melhora workflow
- Equivalente ao comando "Rode o servidor" (execução imediata)

### 🎯 Impacto nas Próximas Sessões

**Workflow otimizado**:
```
Nova sessão → Claude invoca project-context →
1. Carrega CLAUDE-MEMORY.md
2. Verifica porta 3000
3. [Se necessário] Inicia npm run dev automaticamente
4. Notifica usuário
5. Pronto para trabalhar!
```

**Experiência do usuário**:
- ✅ Zero configuração manual necessária
- ✅ Servidor sempre disponível
- ✅ Erros documentados e prevenidos

### 📊 Teste Prático Realizado

**Notícia publicada com sucesso** usando o sistema de skills:
- Script: `publish-bitcoin-trump-cz-pardon.js`
- Título: "Bitcoin Rompe US$ 111 Mil e Mercado Cripto Dispara..."
- Slug único gerado automaticamente
- Total de notícias no banco: 52 artigos
- Sistema funcionando perfeitamente! ✅

### 📝 Arquivos Atualizados

```
.claude/skills/
├── article-creation/SKILL.md  (+40 linhas) - Seção erro crítico
└── project-context/SKILL.md   (+32 linhas) - Auto-start servidor
```

---

## 2025-10-24 (tarde - update 1): 🎯 IMPLEMENTAÇÃO DO SISTEMA DE SKILLS DO CLAUDE CODE

### Motivação

- CLAUDE-MEMORY.md estava com 978 linhas, dificultando consulta rápida
- Necessidade de carregar contexto automaticamente em novas sessões
- Organizar conteúdo técnico em módulos especializados
- Facilitar manutenção e compartilhamento via Git

### 🎯 Skills Criadas (5 módulos)

**Estrutura implementada**: `.claude/skills/` dentro do projeto

1. **`project-context`** (69 linhas) ⚠️ **CRÍTICA**
   - Carrega CLAUDE-MEMORY.md automaticamente em toda nova sessão
   - Descrição: "ALWAYS use this skill at the start of EVERY conversation"
   - Função: Garante que Claude sempre tenha o contexto base do projeto

2. **`article-creation`** (379 linhas)
   - Migrado de CLAUDE-MEMORY.md: seções de criação de artigos e notícias
   - Conteúdo: Templates de scripts, checklists, regras de conteúdo
   - Descrição: "Use when creating, editing, or publishing news articles or educational content"

3. **`design-system`** (145 linhas)
   - Migrado de CLAUDE-MEMORY.md: padrões de design e componentes
   - Conteúdo: CSS Variables, cards, cores, layouts, ícones
   - Descrição: "Use when styling pages, creating components, or working with design patterns"

4. **`database-setup`** (159 linhas)
   - Migrado de CLAUDE-MEMORY.md: banco de dados e arquitetura
   - Conteúdo: Prisma, PostgreSQL, Server Components, Vercel deploy
   - Descrição: "Use when working with database, Prisma, server components, or deployment"

5. **`pages-reference`** (142 linhas)
   - Migrado de CLAUDE-MEMORY.md: detalhes das páginas principais
   - Conteúdo: Educação, Recursos, Notícias, Doações (features e layouts)
   - Descrição: "Use when modifying or creating pages, understanding page-specific features"

### 📝 CLAUDE-MEMORY.md Otimizado

**Antes**: 978 linhas (tudo junto)
**Depois**: 295 linhas (70% mais leve!)

**Conteúdo mantido**:
- ⚠️ Regra Crítica - Interação com o Usuário
- 📚 Estrutura de Documentação (agora incluindo skills)
- 🎯 Filosofia do Projeto
- 🚫 O Que Evitar (com referências às skills)
- 📞 Links Oficiais
- ⚠️ Regras Críticas de Git
- 📝 Histórico de Atualizações

**Conteúdo migrado para skills**: ~683 linhas de conteúdo técnico detalhado

### 🔄 Arquivos de Documentação Atualizados

```
/home/destakar/Trabalho/
├── CLAUDE-MEMORY.md  (295 linhas) - Otimizado ✅
├── LOG.md            (260 linhas) - Intacto
└── sugestões.md      (492 linhas) - Intacto

tokenmilagre-platform/
└── .claude/skills/
    ├── project-context/SKILL.md    (69 linhas)
    ├── article-creation/SKILL.md   (379 linhas)
    ├── design-system/SKILL.md      (145 linhas)
    ├── database-setup/SKILL.md     (159 linhas)
    └── pages-reference/SKILL.md    (142 linhas)
```

### ✨ Benefícios

- ✅ **Contexto automático**: Skills carregadas quando relevantes
- ✅ **CLAUDE-MEMORY.md 70% menor**: Consulta rápida de regras críticas
- ✅ **Organização modular**: Cada skill com responsabilidade única
- ✅ **Versionamento Git**: Skills compartilhadas com a equipe
- ✅ **Manutenção facilitada**: Atualizar skills independentemente
- ✅ **Performance otimizada**: Carrega apenas contexto necessário

### 🎯 Como Funciona

**Nova sessão do Claude**:
1. Claude invoca `project-context` automaticamente
2. Skill carrega CLAUDE-MEMORY.md (regras críticas)
3. Quando necessário, invoca skills especializadas:
   - Criar artigo → `article-creation`
   - Trabalhar com design → `design-system`
   - Trabalhar com banco → `database-setup`
   - Modificar páginas → `pages-reference`

### 📊 Impacto

**Total de linhas organizadas**: 1.189 linhas
- CLAUDE-MEMORY.md: 295 linhas (essencial)
- 5 Skills: 894 linhas (técnico especializado)

**Redução de complexidade**: 70% menos conteúdo para carregar por padrão

---

## 2025-10-24 (manhã): 🎨 REORGANIZAÇÃO DE NAVEGAÇÃO E OTIMIZAÇÃO DE LAYOUTS

### Motivação

- Breadcrumbs duplicados aparecendo em navbar E dentro das páginas
- Botões da página Notícias desalinhados com o título
- Template de artigos educacionais muito largo, dificultando leitura
- Seção Hero da página Educação ocupando largura excessiva

### 🔄 Reorganização de Breadcrumbs

**Problema**: Breadcrumbs apareciam duplicados (navbar + página)

**Solução Implementada**:

1. **Breadcrumbs centralizados no navbar** (`app/layout-root.tsx`):
   - Adicionada prop `inline={true}` ao componente Breadcrumbs
   - Integrado ao header superior junto com título da página e botões
   - Removido título duplicado (estava aparecendo "Início > Notícias | Notícias")
   - Alinhamento vertical ajustado (`items-center`)

2. **Breadcrumbs removidos de 10 páginas**:

   **Páginas de Listagem**:
   - ✅ `app/dashboard/noticias/page.tsx` (removida importação e componente)
   - ✅ `app/educacao/EducacaoClient.tsx` (removida importação e componente)
   - ✅ `app/recursos/page.tsx` (removida importação e componente)

   **Artigos Individuais**:
   - ✅ `app/dashboard/noticias/[slug]/ArtigoClient.tsx` (2 locais: erro 404 + artigo normal)
   - ✅ `app/educacao/[slug]/ArtigoEducacionalClient.tsx` (2 locais: erro 404 + artigo normal)

   **Páginas Estáticas**:
   - ✅ `app/doacoes/page.tsx`
   - ✅ `app/token/page.tsx`
   - ✅ `app/sobre/page.tsx`
   - ✅ `app/manifesto/page.tsx`

3. **Componente Breadcrumbs aprimorado** (`components/Breadcrumbs.tsx`):
   - Adicionada prop `inline?: boolean`
   - Remove `margin-bottom` quando usado no header
   - Classe condicional: `className={inline ? 'animate-fade-in' : 'mb-6 animate-fade-in'}`

**Resultado**:
- ✅ Breadcrumb único em todo o site (apenas no navbar)
- ✅ Zero duplicações
- ✅ Navegação consistente e profissional

### 🎯 Centralização de Elementos na Página Notícias

**Problema**: Botões Discord/Telegram desalinhados do título "Notícias Cripto"

**Arquivo**: `app/dashboard/noticias/page.tsx`

**Mudanças**:

1. **Container principal** (linha 273):
   - Antes: `lg:items-start` (elementos alinhados ao topo)
   - Depois: `lg:items-center` (elementos centralizados verticalmente)

2. **Container interno** (linha 274):
   - Antes: `items-start`
   - Depois: `items-center`

3. **Velocímetro Fear & Greed** (linha 277):
   - Antes: `items-start` com `marginTop: '-20px'`
   - Depois: `items-center` sem margin negativo

4. **Container do título** (linha 471):
   - Antes: `className="mt-8"` (espaçamento que desalinhava)
   - Depois: Sem margin-top

**Resultado**:
```
[Velocímetro] "Notícias Cripto"    [Discord] [Telegram]
                                   ↑ Tudo alinhado verticalmente
```

### 📏 Ajuste de Largura dos Artigos Educacionais

**Problema**: Template de artigos educacionais muito largo (container full-width)

**Arquivo**: `app/educacao/[slug]/ArtigoEducacionalClient.tsx`

**Mudanças**:

1. **Página "Artigo não encontrado"** (linha 152):
   - Antes: `className="container mx-auto px-4 py-8"`
   - Depois: `className="py-8 max-w-4xl"` + `paddingLeft: '55px'`

2. **Página do artigo normal** (linhas 189-191):
   - Container: Antes `className="container mx-auto px-4 py-8"` → Depois `className="py-8"` + `paddingLeft: '55px'`
   - Conteúdo: Antes `className="flex-1 space-y-8"` → Depois `className="flex-1 max-w-4xl space-y-8"`

**Comparação**:

| Aspecto | Antes | Depois | Consistência |
|---------|-------|--------|--------------|
| Container | `container mx-auto` | `max-w-4xl` | ✅ Igual a Notícias |
| Padding Left | `px-4` (1rem) | `55px` | ✅ Igual a Notícias |
| Largura Máxima | Sem limite | 896px (4xl) | ✅ Igual a Notícias |

**Resultado**:
- ✅ Texto mais legível (largura ideal de 896px)
- ✅ Consistência total entre templates de Notícias e Educação
- ✅ Layout profissional e focado

### 📐 Ajuste de Largura da Seção Hero - Educação

**Problema**: Título "Aprenda, Cresça e Compartilhe Conhecimento" muito largo, ocupando toda a tela

**Arquivo**: `app/educacao/EducacaoClient.tsx`

**Mudança** (linha 174):
- Antes: `className="space-y-6"` (sem limite de largura)
- Depois: `className="space-y-6 max-w-3xl"` (limitado a 768px)

**Elementos afetados**:
- Badge "Educação"
- Título principal
- Descrição
- Stats (Recursos, Categorias, Níveis)

**Resultado**:
- ✅ Título mais compacto e ajustado (768px)
- ✅ Quebra de linha harmônica
- ✅ Layout mais profissional e focado
- ✅ Melhor legibilidade

### 📊 Resumo das Mudanças

**Arquivos Modificados**: 12

1. `app/layout-root.tsx` - Breadcrumbs no navbar
2. `components/Breadcrumbs.tsx` - Prop inline
3. `app/dashboard/noticias/page.tsx` - Breadcrumbs removido + alinhamento
4. `app/educacao/EducacaoClient.tsx` - Breadcrumbs removido + largura Hero
5. `app/recursos/page.tsx` - Breadcrumbs removido
6. `app/doacoes/page.tsx` - Breadcrumbs removido
7. `app/token/page.tsx` - Breadcrumbs removido
8. `app/sobre/page.tsx` - Breadcrumbs removido
9. `app/manifesto/page.tsx` - Breadcrumbs removido
10. `app/dashboard/noticias/[slug]/ArtigoClient.tsx` - Breadcrumbs removido
11. `app/educacao/[slug]/ArtigoEducacionalClient.tsx` - Breadcrumbs removido + largura ajustada
12. `/home/destakar/Trabalho/CLAUDE-MEMORY.md` - Nova regra de interação

**Impacto Visual**:
- ✅ Navegação unificada e profissional
- ✅ Layouts consistentes entre seções
- ✅ Melhor legibilidade em todas as páginas
- ✅ Alinhamento visual harmonioso

### 📝 Regras de Desenvolvimento Atualizadas

**Adicionada regra crítica no CLAUDE-MEMORY.md**:

Seção: **"⚠️ REGRA CRÍTICA - Interação com o Usuário"**

**Conteúdo**:
- Fluxo obrigatório: Entender → Analisar → Propor → PERGUNTAR → Aguardar → Executar
- Nunca executar código sem confirmação prévia do usuário
- Sempre mostrar plano de ação antes de implementar
- Exceções claras para comandos explícitos ("Rode o servidor", "Faça commit", etc)

**Motivação**: Evitar implementações prematuras sem alinhamento com o usuário

### 🚀 Deploy

- ✅ Todas as páginas compiladas sem erros
- ✅ Servidor rodando em http://localhost:3000
- ✅ Breadcrumbs funcionando corretamente em todas as rotas
- ✅ Layouts responsivos mantidos

---

## 2025-10-22 (noite): 📚 OTIMIZAÇÃO DA DOCUMENTAÇÃO - SEPARAÇÃO DE LOGS

### Motivação

- CLAUDE-MEMORY.md estava com 1.007 linhas, sendo ~165 linhas de logs detalhados
- Necessidade de otimizar para facilitar consulta rápida de padrões
- Separar "como fazer" (padrões) de "o que foi feito" (histórico)

### Arquivos Criados

1. **`LOG.md`** - Novo arquivo de histórico
   - Contém todo o histórico detalhado de mudanças desde 2025-01-19
   - 260 linhas de logs estruturados
   - Formato cronológico reverso (mais recente primeiro)
   - Caminho: `/home/destakar/Trabalho/LOG.md`

2. **`sugestões.md`** - Análise e recomendações
   - 20 sugestões priorizadas para melhorias futuras
   - Roadmap de 4 meses
   - Stack recomendado para novas features
   - 492 linhas
   - Caminho: `/home/destakar/Trabalho/sugestões.md`

### CLAUDE-MEMORY.md Otimizado

- **Redução**: 1.007 → 915 linhas (depois de adicionar seção de estrutura)
- **Logs removidos**: ~165 linhas de histórico detalhado movidas para LOG.md
- **Nova seção adicionada**: "Estrutura de Documentação do Projeto"
  - Explicação clara dos 3 arquivos de documentação
  - Regras de quando atualizar cada arquivo
  - Como Claude deve usar esta estrutura
  - Caminhos completos dos arquivos

### Benefícios

- ✅ CLAUDE-MEMORY.md mais focado e rápido de consultar
- ✅ Histórico completo preservado em LOG.md
- ✅ Separação clara de responsabilidades
- ✅ Instruções explícitas para Claude em novas sessões
- ✅ Facilita manutenção futura

### Estrutura Final da Documentação

```
/home/destakar/Trabalho/
├── CLAUDE-MEMORY.md    (915 linhas) - Diretrizes e padrões atuais
├── LOG.md              (260 linhas) - Histórico completo de mudanças
├── sugestões.md        (492 linhas) - 20 sugestões para melhorias
└── tokenmilagre-platform/ (projeto)
```

### Regras Documentadas

**CLAUDE-MEMORY.md**: Atualizar quando padrões mudarem (substituir, não acumular)
**LOG.md**: Atualizar quando features forem implementadas (adicionar no topo)
**sugestões.md**: Atualizar quando identificar melhorias ou completar sugestões

---

## 2025-10-22 (tarde): 🔄 SISTEMA DE SLUG ÚNICO AUTOMÁTICO

### Sistema de Geração de Slugs Únicos Implementado

- **Novo helper**: `scripts/helpers/generate-unique-slug.js`
- **3 funções exportadas**:
  - `generateUniqueSlug(baseSlug)` - Detecta duplicatas e adiciona sufixo incremental (-2, -3, etc)
  - `titleToSlug(title)` - Converte título para kebab-case
  - `slugWithDate(title, date?)` - Adiciona data automática (YYYYMMDD)
- Sistema previne erro de constraint de unicidade no banco
- Permite títulos iguais em contextos diferentes

### Template Atualizado

- `scripts/publish-news-template.js` - Script pronto com slug único integrado
- `scripts/publish-bitcoin-market-fear-20251022.js` - Atualizado para usar novo sistema
- Template documentado no CLAUDE-MEMORY.md

### Documentação Completa

- `scripts/README.md` criado - Guia completo de uso dos scripts
- CLAUDE-MEMORY.md atualizado - Seção "Como Criar Notícias via Script" expandida
- Tabela de erros comuns expandida com 2 novos erros:
  - Script criado fora do projeto
  - Data com timezone UTC incorreto

### Regras Críticas Documentadas

- ⚠️ SEMPRE criar scripts em `/tokenmilagre-platform/scripts/`
- ⚠️ Usar `new Date()` sem parâmetros para hora atual
- ⚠️ Verificar `npx prisma generate` antes de executar scripts
- ⚠️ Sistema de slug único garante zero conflitos

### Benefícios

- ✅ Nunca mais erro de slug duplicado
- ✅ Títulos similares em contextos diferentes = OK
- ✅ Sistema totalmente automático
- ✅ Consistência em todas as publicações

### Testes Realizados

- Helper testado com slug existente: `bitcoin-recua-107-mil-medo-extremo-mercado-20251022`
- Sistema gerou automaticamente: `bitcoin-recua-107-mil-medo-extremo-mercado-20251022-2`
- Funcionamento confirmado em produção

---

## 2025-10-21 (noite/2025-10-22 madrugada): 🧹 LIMPEZA COMPLETA DO PROJETO + AJUSTES DE UI

### Ajustes de UI na Homepage

- Título "Índice Fear & Greed - Sentimento do Mercado" movido para dentro da Coluna 2 (acima do velocímetro)
- Carousel de educação ajustado de 1 para 2 slides lado a lado (`w-full` → `w-1/2`, `translateX 100%` → `50%`)
- Número do velocímetro reposicionado de `y="155"` → `y="145"` (logo acima do círculo do ponteiro)
- Título "Últimas Notícias" + Badge "HOJE" movido para exatamente acima dos cards de notícias (após divisor)

### 🧹 Limpeza Completa do Projeto

- **Backup criado**: `tokenmilagre-platform-backup-20251021-230525.tar.gz` (326MB)
- **34 arquivos obsoletos removidos**:
  - 7 documentações (ARTICLES-WORKFLOW.md, CLI-GUIDE.md, FACT_CHECKING.md, etc)
  - 27 scripts de migração/limpeza já executados
  - Diretórios: `cli/`, `data/` (vazio), `docs/`
- **Scripts mantidos**: Apenas 15 utilitários essenciais (check-*, list-*, delete-*, test-*, watch-*)
- **package.json**: Removidos scripts `db:export`, `db:import`, `cli`
- **Resultado**: 7.035 linhas removidas, projeto 90% mais limpo

### 🔒 Limpeza do Git (Arquivos Externos)

- **16 arquivos externos removidos do Git** (mantidos localmente):
  - 9 imagens (`imagens/*.png`, `imagens/*.webp`)
  - 7 documentos (`.directory`, `CHANGELOG-DUPLICATAS.md`, `CORRECTIONS-IMPLEMENTED.md`, etc)
- **.gitignore atualizado** (workspace root) para prevenir commits acidentais:
  - `/Log importante/`, `/gemini/`, `/imagens/`, `/*.tar.gz`
  - Padrões: `/CHANGELOG-*.md`, `/SYSTEM-*.md`, `/guia-*.md`, `/template-*.md`

### 📦 Git Apenas Essenciais

- **CLAUDE-MEMORY.md**, **MANIFESTO.md**, **MIGRACAO-POSTGRES.md** agora apenas locais
- Scripts de exemplo `publish-*.js` ignorados (criar novos conforme necessário)
- `.gitignore` do projeto atualizado:
  ```gitignore
  CLAUDE-MEMORY.md
  MANIFESTO.md
  MIGRACAO-POSTGRES.md
  *.backup.md
  scripts/publish-*.js
  ```
- **Resultado**: Git rastreia apenas código funcional e configurações

### 📚 Documentação Completamente Reescrita

- **README.md atualizado** com estrutura atual do projeto:
  - Stack: Next.js 15.5.4 + PostgreSQL + Prisma
  - Features reais implementadas (Homepage, Educação, Recursos, Notícias, Doações)
  - Estrutura de diretórios precisa
  - Banco de dados: Schema Prisma, comandos úteis
  - Design System: CSS Variables e padrões
  - Scripts: Apenas os 9 existentes
- **Remoções**: 294 linhas obsoletas (Portfolio Tracker, sistema de tiers, workflow Perplexity, APIs antigas)
- **Adições**: 207 linhas atualizadas
- **Resultado**: -87 linhas, mais conciso e preciso

### ⚠️ Nova Seção Crítica Adicionada

- **"REGRAS CRÍTICAS DE GIT"** com regra absoluta:
  - Git deve rastrear APENAS arquivos dentro de `tokenmilagre-platform/`
  - Exemplos do que NUNCA fazer vs SEMPRE fazer
  - .gitignore proteções documentadas
  - Consequências de ignorar a regra
  - **Comando mandatório**: `git status` antes de commit

### Commits da Sessão

- `2c7835d`: Limpeza completa - 44 arquivos, -7.035 linhas
- `8e33613`: Remover arquivos externos - 17 arquivos
- `de5d60c`: Manter apenas essenciais - 10 arquivos, -2.141 linhas
- `cd4d9ae`: Atualizar README.md - 1 arquivo, -87 linhas

---

## 2025-10-21: 🎨 REDESIGN COMPLETO DA UI - MINIMALISMO E GRADIENTES

### Padrões de Design Atualizados

- Bordas reduzidas: `border-2` → `border` (1px)
- Bordas quase invisíveis: `--border-light` (#F5F5F7 light, #34547A dark)
- Sombras mais sutis e harmônicas (redução de intensidade)
- Fundo modo dia alterado: `#FFFFFF` → `#f5f4f6` (off-white confortável)
- Efeito hover padrão: `-translate-y-1` com `duration-500 ease-out`

### Mudanças na Página Educação

- Ícones de níveis (🌱, 🚀, 💎) substituídos por números em círculos (1, 2, 3)
- Círculos numerados usam cor primária da marca

### Mudanças em Todas as Páginas

- Remoção de ícone 🔍 das seções "Busca e Filtros"
- Cards padronizados com bordas sutis + sombras harmônicas
- Remoção de hover amarelo/verde em favor de translação vertical
- TradingView ticker adaptado ao tema usando MutationObserver

### Novos Cards na Home Page

- Card "Aprenda sobre Cripto": Exibe 4 artigos educacionais do banco
- Card "Ferramentas Essenciais": Design criativo com 3 cards gradiente (MetaMask, Binance, Uniswap)
- Botões de categoria com links diretos para recursos
- API `/api/articles` atualizada para filtrar por `type` (news/educational)

### Redesign da Página Recursos

- Cards com gradientes categorizados (Wallets laranja, Exchanges dourado, DeFi rosa, etc.)
- Função `getCategoryGradient()` mapeia cores por categoria
- Cards com texto branco + overlay translúcido
- Hover mais intenso: `-translate-y-2` + `shadow-2xl`
- Badges translúcidos para tags e plataformas
- CTA com seta animada no hover

### Arquivos Modificados

- `/app/globals.css`: Novas variáveis de sombra e borda
- `/app/educacao/EducacaoClient.tsx`: Números ao invés de emojis
- `/app/dashboard/noticias/page.tsx`: Bordas e sombras atualizadas
- `/app/recursos/page.tsx`: Design gradiente completo
- `/app/page.tsx`: Novos cards de Educação e Recursos
- `/app/api/articles/route.ts`: Suporte ao filtro `type`
- `/components/TickerTapeWidget.tsx`: Adaptação ao tema

---

## 2025-10-20: 💝 NOVA PÁGINA DE DOAÇÕES

### Implementação

- Criada página completa de Doações (`/app/doacoes/page.tsx`)
- Hero section com mesmo padrão visual da página Sobre
- 6 seções principais: Uso de Doações, Confiança, Métodos, Segurança, Outras Formas, CTA Final

### Detalhes

- Distribuição transparente: Educação (40%), Desenvolvimento (30%), Apoio (20%), Crescimento (10%)
- 3 métodos de doação: Solana (SOL), $MILAGRE Token, PIX
- Funcionalidade de copiar endereço com feedback visual
- Texto persuasivo enfatizando projeto 100% comunitário sem fins lucrativos
- Schema.org JSON-LD para SEO
- Design responsivo com CSS variables
- Documentação completa adicionada em "Páginas Principais"

---

## 2025-10-19 (noite): 🔥 MIGRAÇÃO COMPLETA PARA POSTGRESQL

### Migração de Banco de Dados

- Migração de SQLite para Neon PostgreSQL concluída com sucesso
- 43 artigos + 2 usuários migrados
- Adicionada seção completa "Banco de Dados e Infraestrutura"
- Adicionada seção "Next.js e Server Components" com boas práticas

### Documentação

- Documentadas regras críticas: usar Prisma diretamente, nunca fetch HTTP em RSC
- Script postinstall obrigatório para gerar Prisma Client
- Atualizada lista "O Que Evitar" com erros de arquitetura
- Documentação de scripts de banco de dados (`db:export`, `db:import`, etc)

### Problemas Resolvidos

- Build no Vercel funcionando
- Páginas de artigos individuais funcionando corretamente

---

## 2025-10-19 (tarde): SISTEMA DE CRIAÇÃO DE NOTÍCIAS VIA SCRIPT

### Adições

- Seção "Como Criar Notícias via Script" adicionada
- Configuração correta do Prisma documentada
- IDs de usuários mapeados
- Template completo de script fornecido
- Comandos úteis listados
- Tabela de erros comuns criada

---

## 2025-10-19 (manhã): DIRETRIZES PARA CRIAÇÃO DE CONTEÚDO

### Documentação de Notícias

- Diretrizes completas para criação de notícias
- Template automático de processamento
- Regras sobre H1, fontes, notas de transparência
- Lista de artigos educacionais existentes
- Checklists separados para artigos e notícias

---

## 2025-01-19: CRIAÇÃO DO DOCUMENTO INICIAL

### Primeira Versão

- Criação do documento inicial com diretrizes para artigos educacionais
- Padrões de design estabelecidos
- Filosofia do projeto documentada

---

**Última atualização do LOG**: 2025-10-22
**Versão**: 1.0
