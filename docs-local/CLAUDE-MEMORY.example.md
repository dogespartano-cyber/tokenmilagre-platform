# CLAUDE-MEMORY.md

> **⚠️ Este é um arquivo de exemplo**. Copie para `CLAUDE-MEMORY.md` e personalize com suas informações.
> O arquivo `CLAUDE-MEMORY.md` está no `.gitignore` e não será commitado.

---

## 📚 Sobre Este Arquivo

Este arquivo contém as regras críticas, filosofia do projeto e contexto essencial que o Claude deve carregar no início de toda conversa através da skill `project-context`.

**Última atualização**: [DATA] por [SEU NOME]

---

## ⚠️ Regras Críticas de Interação

### 🚨 Regra #1: SEMPRE Perguntar Antes de Executar

**NUNCA execute código ou comandos sem confirmar com o usuário primeiro**, exceto:
- ✅ Leitura de arquivos (Read, Grep, Glob)
- ✅ Análise de código
- ✅ Pesquisas (WebSearch, WebFetch)

**SEMPRE pergunte antes de**:
- ❌ Criar/modificar/deletar arquivos
- ❌ Executar comandos bash
- ❌ Fazer commits Git
- ❌ Instalar dependências
- ❌ Modificar configurações

### 🚨 Regra #2: Git - Apenas tokenmilagre-platform/

**NUNCA commitar arquivos fora do diretório `tokenmilagre-platform/`**

✅ Permitido commitar:
```
tokenmilagre-platform/
  ├── app/
  ├── components/
  ├── lib/
  ├── .claude/
  └── docs-local/ (apenas .example.md)
```

❌ PROIBIDO commitar:
```
/home/[usuario]/Trabalho/
/home/[usuario]/Desktop/
Qualquer arquivo fora do projeto
```

### 🚨 Regra #3: Nunca Rodar Build ou Dev Server

**NUNCA execute estes comandos**:
- ❌ `npm run dev`
- ❌ `npm run build`
- ❌ `npm start`
- ❌ Qualquer comando que inicie servidor

**Motivo**: Servidor é gerenciado pelo `server-manager.sh` no ambiente de produção.

### 🚨 Regra #4: Economia de Tokens

**Seja CONCISO**. O usuário prefere:
- ✅ Respostas curtas e diretas
- ✅ Código sem explicações óbvias
- ✅ Foco em ação, não teoria
- ❌ Parágrafos longos
- ❌ Explicações excessivas

---

## 📚 Estrutura de Documentação

### Arquivos Principais (em docs-local/)

1. **CLAUDE-MEMORY.md** (este arquivo)
   - Regras críticas
   - Filosofia do projeto
   - Contexto essencial

2. **LOG.md**
   - Histórico detalhado de mudanças
   - Decisões técnicas
   - Problemas resolvidos
   - Consulte quando precisar de contexto histórico

3. **sugestões.md**
   - Ideias para futuras features
   - Melhorias pendentes
   - Backlog do projeto
   - Consulte antes de sugerir novas funcionalidades

---

## 🎯 Filosofia e Valores do Projeto

### 💫 Token Milagre - Semente do Bem

**Missão**: Democratizar acesso à educação sobre criptomoedas através de conteúdo gratuito, acessível e confiável.

### ✨ Valores Fundamentais

1. **🎓 Educação em Primeiro Lugar**
   - Artigos didáticos e acessíveis
   - Conteúdo em português claro
   - Foco em iniciantes

2. **🔓 Transparência Total**
   - Código 100% open source
   - Decisões documentadas
   - Comunidade informada

3. **🤝 Comunidade Inclusiva**
   - Todos são bem-vindos
   - Respeito e colaboração
   - Contribuições celebradas

4. **🛡️ Segurança Sempre**
   - Alertas de golpes
   - Boas práticas de segurança
   - Proteção dos usuários

5. **⚡ Simplicidade e Performance**
   - Design minimalista
   - Código limpo
   - Fast loading

### 🎯 Perguntas-Guia para Decisões

Antes de implementar qualquer feature ou mudança, pergunte:

1. ✅ **"Isso ajuda alguém?"** - Se não, não faça
2. ✅ **"Um iniciante entenderia?"** - Simplicidade é poder
3. ✅ **"Isso convida contribuição?"** - Open source vive disso
4. ✅ **"Estamos sendo transparentes?"** - Confiança é tudo
5. ✅ **"Isso fortalece a comunidade?"** - Juntos somos mais

---

## 🚫 O Que Evitar

### ❌ Design Anti-Patterns
- Animações excessivas ou distrativas
- Cores muito vibrantes (exceto accent estratégico)
- Elementos decorativos sem propósito
- Interfaces confusas ou complexas

### ❌ Code Anti-Patterns
- Código duplicado (DRY principle)
- Componentes gigantes (>500 linhas)
- Fetching HTTP quando Prisma direto é possível
- Variáveis `any` no TypeScript

### ❌ Conteúdo Anti-Patterns
- Hype ou promessas exageradas
- Linguagem técnica desnecessária
- Conteúdo sem citações/fontes
- Informações desatualizadas

---

## 📞 Links Oficiais

> **⚠️ PERSONALIZE ESTA SEÇÃO** com seus links reais

- 🌐 **Website**: [SEU_DOMINIO]
- 💬 **Telegram**: [LINK_TELEGRAM]
- 🐦 **Twitter/X**: [LINK_TWITTER]
- 📱 **Instagram**: [LINK_INSTAGRAM]
- 💻 **GitHub**: [LINK_GITHUB]
- 📊 **Vercel**: [LINK_VERCEL_DASHBOARD]

---

## 🤖 Admin AI Assistant - Arquitetura

### 📍 Localização
- **Página Principal**: `/dashboard/criar-artigo`
- **Sidebar Global**: Componente `AdminChatSidebar` (disponível em todo dashboard)

### 🧠 Sistema de Detecção de Intenção

O chat usa **processamento de linguagem natural** para detectar automaticamente a intenção do usuário e sugerir ferramentas (copilots) adequadas.

**Exemplos de Intenções**:
- "criar um artigo sobre bitcoin" → Tool: `article-generator`
- "melhorar este texto: [...]" → Tool: `text-enhancer`
- "pesquisar sobre ethereum" → Tool: `research`

### 🛠️ Copilot Tools Disponíveis

Lista de tools implementadas:
1. **article-generator** - Gera artigos completos com IA
2. **research** - Pesquisa informações com Perplexity AI
3. **text-enhancer** - Melhora texto existente
4. [ADICIONE SUAS TOOLS AQUI]

### 🔄 Workflow Completo
Para arquitetura detalhada, use skill `tokenmilagre-article-workflow`.

---

## 🗂️ Arquitetura do Projeto

### 📁 Estrutura Principal

```
tokenmilagre-platform/
├── app/                    # Next.js 15 App Router
│   ├── (public)/          # Rotas públicas
│   │   ├── page.tsx       # Home
│   │   ├── educacao/      # Seção educacional
│   │   └── noticias/      # Notícias cripto
│   └── dashboard/         # Admin protegido
│       ├── criar-artigo/  # Chat IA + criação
│       └── [outras]/      # Outras páginas admin
├── components/            # Componentes React
│   ├── ui/               # UI primitives (shadcn)
│   └── [features]/       # Componentes por feature
├── lib/                   # Utilities e configurações
│   ├── prisma.ts         # Cliente Prisma
│   ├── perplexity.ts     # API Perplexity
│   └── gemini.ts         # API Gemini
├── prisma/
│   └── schema.prisma     # Database schema
├── .claude/
│   ├── skills/           # Claude Code skills
│   └── settings.json     # Configurações Claude
└── docs-local/           # Documentação local (não versionado)
    ├── CLAUDE-MEMORY.md
    ├── LOG.md
    └── sugestões.md
```

### 🗄️ Database (PostgreSQL + Prisma)

**Models principais**:
- `Article` - Artigos educacionais e notícias
- `ChatMessage` - Mensagens do chat IA
- `FactCheckSource` - Fontes de fact-checking
- [ADICIONE SEUS MODELS AQUI]

---

## 🔧 Stack Tecnológica

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Deploy**: Vercel
- **AI**: Perplexity AI + Google Gemini
- **Auth**: [SUA SOLUÇÃO DE AUTH]

---

## 🚀 Workflow de Desenvolvimento

### Claude Code Web (80% do trabalho)
- ✅ Desenvolvimento de features
- ✅ Refactoring
- ✅ Correção de bugs
- ✅ Deploy automático em PREVIEW (branches `claude/*`)

### Claude Code CLI (20% do trabalho)
- ✅ Validação de build local
- ✅ Ajustes rápidos
- ✅ Commit final e push para produção

### Server Manager
Use `server-manager.sh` para gerenciar o servidor local:
```bash
./server-manager.sh start-preview    # Sincroniza preview + inicia
./server-manager.sh promote-preview  # Promove para produção
./server-manager.sh status           # Status
./server-manager.sh logs             # Logs em tempo real
```

---

## 📝 Histórico de Atualizações

### [DATA] - [TÍTULO DA ATUALIZAÇÃO]
- [Descrição da mudança]
- [Impacto ou decisão técnica]

### Exemplo:
### 2025-11-09 - Criação do Sistema de Skills
- Implementadas 10 skills Token Milagre (article-workflow, citations, etc)
- Sistema proativo de sugestão de novas skills
- Documentação completa em `.claude/skills/`

---

## 💡 Notas Pessoais

> **Use esta seção** para adicionar suas próprias notas, lembrete ou contexto específico que o Claude deve saber sobre seu ambiente de desenvolvimento.

- [SUAS NOTAS AQUI]
- [COMANDOS PERSONALIZADOS]
- [PREFERÊNCIAS ESPECÍFICAS]

---

**Fim do CLAUDE-MEMORY.md**
