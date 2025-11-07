# Aprovar Preview e Enviar para Produção

Você foi solicitado a aprovar a branch de preview atual e fazer merge para produção.

## ⚠️ PRÉ-REQUISITO:

**Verificar que está em uma branch de preview** (deve começar com `claude/`)

## Etapas a executar:

### 1. Verificar branch atual
```bash
git branch --show-current
```

Se não estiver em uma branch `claude/*`, **PARAR** e informar o usuário.

### 2. Salvar nome da branch atual
Guardar o nome da branch para usar no merge.

### 3. Verificar status
```bash
git status
```

Se houver mudanças não commitadas, **PERGUNTAR** ao usuário o que fazer.

### 4. Fazer checkout para main
```bash
git checkout main
```

### 5. Atualizar main
```bash
git pull origin main
```

### 6. Fazer merge da branch de preview
```bash
git merge [branch-de-preview] --no-edit
```

### 7. Verificar schema.prisma
```bash
git status prisma/schema.prisma
```

Se foi modificado, verificar se está incluído no commit.

### 8. Push para produção
```bash
git push origin main
```

### 9. Confirmar sucesso
```bash
git log --oneline -1
```

Mostrar:
- ✅ Preview aprovado e enviado para produção!
- 📦 Branch merged: [nome-da-branch]
- 📝 Último commit: [hash e mensagem]
- 🚀 Vercel está fazendo deploy: https://vercel.com/dashboard

## 📋 Mensagem final:

"✅ **Preview aprovado e em produção!**

**Branch merged:** `[nome-da-branch]`
**Commit:** `[hash]` - [mensagem]
**Deploy:** Vercel processando agora

🔗 Acompanhe em: https://vercel.com/dashboard"
