# 🚀 Workflow de Desenvolvimento - TokenMilagre Platform

## 📋 Resumo do Projeto

**Projeto:** TokenMilagre Platform
**Framework:** Next.js 15.5.4 + React 19 + TypeScript
**Styling:** Tailwind CSS v4
**Deploy:** Vercel (auto-deploy via GitHub)
**Repositório:** https://github.com/dogespartano-cyber/tokenmilagre-platform
**Produção:** https://tokenmilagre.xyz

---

## ⚙️ Workflow Correto

### ✅ SEMPRE trabalhar assim:

```bash
# 1. Iniciar servidor de desenvolvimento
npm run dev

# Servidor roda em:
# - Local: http://localhost:3000
# - Network: http://172.30.0.3:3000
```

### 🔄 Ciclo de desenvolvimento:

```
1. Fazer alterações no código
2. Testar no localhost (hot reload automático)
3. Iterar quantas vezes necessário
4. Quando 100% pronto → commit + push
```

### 🚫 NÃO fazer:

- ❌ Commit a cada pequena mudança
- ❌ Testar direto no Vercel (produção)
- ❌ Push sem testar localmente primeiro
- ❌ Múltiplos commits seguidos (evitar fila do Vercel)

---

## 🎨 Sistema de Temas

### Variáveis CSS (use SEMPRE estas):

```css
/* Backgrounds */
--bg-primary, --bg-secondary, --bg-tertiary, --bg-elevated

/* Textos */
--text-primary, --text-secondary, --text-tertiary, --text-muted
--text-inverse (branco dark / preto light)

/* Borders */
--border-light, --border-medium, --border-strong

/* Brand */
--brand-primary, --brand-hover, --brand-light, --brand-bg, --brand-border

/* Funcionais */
--success, --error, --warning, --info
--success-bg, --error-bg, --warning-bg, --info-bg
--success-border, --error-border, --warning-border, --info-border
```

### ⚠️ REGRA DE OURO:

**NUNCA use cores hardcoded como:**
- ❌ `text-[#FFFFFF]`
- ❌ `bg-[#142841]`
- ❌ `border-[#2A4A6E]`

**SEMPRE use:**
- ✅ `style={{ color: 'var(--text-primary)' }}`
- ✅ `style={{ backgroundColor: 'var(--bg-elevated)' }}`
- ✅ Classes utilitárias: `.text-theme-primary`, `.bg-theme-elevated`

### Modo Escuro vs Modo Claro:

**Dark Mode (ORIGINAL - NÃO ALTERAR):**
- Verde #10B981 (brand original)
- Backgrounds escuros #0A1628 → #142841
- Textos brancos #FFFFFF → #E0E6ED

**Light Mode (para ajustes):**
- Background branco puro #FFFFFF
- Textos ESCUROS #111827 → #374151
- Brand turquesa #0D9488

---

## 📁 Estrutura do Projeto

```
tokenmilagre-platform/
├── app/
│   ├── layout.tsx           # Root layout com ThemeProvider
│   ├── globals.css          # Variáveis CSS dos temas
│   ├── dashboard/
│   │   ├── layout.tsx       # Header + Sidebar + Toggle tema
│   │   ├── page.tsx         # Portfolio (✅ cores OK)
│   │   ├── mercado/
│   │   │   └── page.tsx     # Mercado (✅ cores OK)
│   │   └── noticias/
│   │       └── page.tsx     # Notícias
├── components/
│   ├── ThemeCard.tsx        # Helper para cards temáticos
│   └── CustomCryptoScreener.tsx
├── contexts/
│   └── ThemeContext.tsx     # Provider do tema
└── package.json
```

---

## 🛠️ Comandos Úteis

### Desenvolvimento:
```bash
npm run dev          # Servidor local (Turbopack)
npm run build        # Testar build localmente
npm run lint         # Verificar erros ESLint
```

### Git/Deploy:
```bash
# Quando tudo estiver pronto e testado:
git add .
git commit -m "tipo: descrição curta"
git push origin main

# Vercel vai fazer deploy automático
# Aguardar 2-3 minutos
```

### Verificar servidor em background:
```bash
# Se npm run dev estiver rodando em background
ps aux | grep "next dev"
pkill -f "next dev"  # Para matar se necessário
```

---

## 🐛 Troubleshooting

### Deploy travado no Vercel (Queued):

**Causa:** Plano gratuito = 1 build por vez
**Solução:**
1. Cancelar deploys antigos no dashboard Vercel
2. Aguardar fila processar
3. Evitar múltiplos pushes seguidos

### Cores brancas no modo claro:

**Causa:** Cores hardcoded ao invés de variáveis CSS
**Solução:**
```tsx
// ❌ ERRADO
<p className="text-[#FFFFFF]">Texto</p>

// ✅ CORRETO
<p style={{ color: 'var(--text-primary)' }}>Texto</p>
```

### Build errors:

```bash
# Sempre testar build local antes de push:
npm run build

# Se passar local mas falhar no Vercel:
# - Verificar .env.local vs variáveis do Vercel
# - Checar se arquivos fora do projeto foram commitados
```

---

## 📊 Status Atual (05/10/2025)

### ✅ Completo:
- [x] Sistema de tema claro/escuro
- [x] ThemeProvider com localStorage
- [x] Botão toggle Sol/Lua
- [x] Dashboard principal com cores adaptativas
- [x] Página Mercado com cores adaptativas
- [x] Header e Sidebar com cores adaptativas
- [x] WCAG AAA compliance (18:1 light, 15.8:1 dark)

### 🔄 Em progresso:
- [ ] Testar modo claro em todas as páginas
- [ ] Verificar widgets do TradingView no light mode

### 📝 Próximos passos:
1. Testar localhost após mudanças no tema
2. Verificar páginas restantes (Notícias, Manifesto)
3. Só fazer push quando 100% testado

---

## 🎯 Lembretes Importantes

1. **SEMPRE rodar `npm run dev` antes de começar**
2. **SEMPRE testar no localhost antes de commit**
3. **NUNCA alterar cores do modo escuro** (está perfeito)
4. **SEMPRE usar variáveis CSS** para cores
5. **Commits limpos** - só quando feature completa
6. **Vercel é produção** - não é ambiente de testes

---

## 📞 Links Úteis

- **Localhost:** http://localhost:3000
- **Produção:** https://tokenmilagre.xyz
- **Vercel Dashboard:** https://vercel.com/deployments
- **GitHub Repo:** https://github.com/dogespartano-cyber/tokenmilagre-platform
- **Docs Next.js:** https://nextjs.org/docs
- **Docs Tailwind v4:** https://tailwindcss.com/docs

---

## 📝 Notas da Sessão Anterior

**Última atualização:** 05/10/2025 08:12 AM

**Trabalho realizado:**
- ✅ Implementado sistema de tema claro/escuro
- ✅ Corrigido modo claro (branco puro + textos escuros)
- ✅ Restaurado modo escuro original (verde #10B981)
- ✅ Atualizado `/dashboard/page.tsx` com variáveis CSS
- ✅ Atualizado `/dashboard/mercado/page.tsx` com variáveis CSS
- ✅ Criado `ThemeCard.tsx` helper component

**Problemas encontrados:**
- Deploy travando no Vercel por múltiplos commits
- Arquivos `.md` do diretório pai sendo commitados
- Cores hardcoded em várias páginas

**Soluções aplicadas:**
- Force push para limpar commit problemático
- Workflow com localhost para testar antes de deploy
- Substituição sistemática de cores hardcoded por CSS vars

---

**🎨 Regra de Ouro: Desenvolva local, deploye global!**
