# Testar Preview Localmente (Windows)

Você foi solicitado a testar uma branch de preview localmente antes de fazer merge para produção.

## Etapas a executar:

### 1. Buscar branches remotas
```bash
git fetch origin
```

### 2. Listar branches de preview disponíveis
```bash
git branch -r | grep "claude/"
```

### 3. Fazer checkout da branch de preview
- Se não foi especificada, escolher a mais recente
- Fazer checkout: `git checkout [nome-da-branch]`

### 4. Mostrar resumo das mudanças
```bash
git diff main --stat
git log main..HEAD --oneline
```

### 5. Instruir usuário sobre teste local

**📋 Para testar localmente no Windows:**

```bash
# Opção 1: Rodar servidor de desenvolvimento
npm run dev

# Opção 2: Build de produção
npm run build
npm start
```

**🌐 Abrir no navegador:**
- http://localhost:3000

**⏸️ AGUARDAR feedback do usuário sobre os testes**

### 6. Após aprovação do usuário

Se o usuário aprovar (disser "ok", "aprovado", "pode fazer merge", etc):

```bash
git checkout main
git merge [branch-de-preview] --no-edit
git push origin main
```

Confirmar: "✅ Preview aprovado e enviado para produção!"

## ⚠️ IMPORTANTE:

- **SEMPRE aguardar** o usuário testar antes de fazer merge
- **NÃO executar** `npm run dev` automaticamente (usuário gerencia servidor)
- **PERGUNTAR** se está tudo ok antes de fazer merge para main
- Se houver problemas, perguntar se quer reverter ou fazer ajustes

## 📋 Output esperado:

1. Lista de branches de preview disponíveis
2. Branch atual (após checkout)
3. Resumo de mudanças (arquivos + commits)
4. Instruções claras de como testar
5. Aguardar confirmação do usuário
6. Se aprovado: merge + push + confirmação
