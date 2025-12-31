# Regras Específicas do Projeto $MILAGRE

> Estas regras complementam o GEMINI.md global e são específicas para este projeto.

---

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── .agent/              ← Sistema de Agents (LEIA PRIMEIRO)
│   ├── _INDEX.md        ← Índice principal
│   ├── rules/           ← Estas regras
│   └── workflows/       ← Agents especializados
├── app/                 ← Next.js App Router
├── lib/
│   ├── core/            ← Núcleo (constants, shared)
│   └── domains/         ← Domínios (articles, resources, users)
├── prisma/              ← Schema do banco
└── Feedback/            ← Logs e histórico
```

---

## 🎨 Design System

- **Framework CSS:** Vanilla CSS com CSS Variables
- **Tema:** Suporta light/dark mode
- **Cores:** Definidas em `app/globals.css`
- **Ícones:** Lucide React APENAS
- **Fontes:** Inter + JetBrains Mono

---

## 🗄️ Banco de Dados

- **ORM:** Prisma
- **Provider:** Supabase (PostgreSQL)

### Regra Crítica
```bash
npm run db:backup  # ANTES de qualquer operação destrutiva
```

---

## 📝 Padrões de Código

- TypeScript strict, no `any`
- Zod para validação
- Imports com aliases `@/`
- Server Components por padrão

---

## 🔗 Serviços

| Serviço | URL |
|---------|-----|
| Graphiti | localhost:8000 |
| FalkorDB | localhost:6379 |
