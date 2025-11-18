# Server Manager Skill

**Versão**: 2.1-optimized
**Última atualização**: 2025-11-18
**Propósito**: Gerenciamento do servidor Next.js cross-platform

---

## 📁 Arquivos

- **Linux/Mac**: `server/server-manager.sh`
- **Windows**: `server/server-manager.ps1`
- **Log**: `/tmp/tokenmilagre-server.log` (Linux) | `%TEMP%\tokenmilagre-server.log` (Windows)

---

## 🎯 Comandos (10 opções)

| # | Comando | Descrição |
|---|---------|-----------|
| 1 | `start` | Iniciar servidor dev |
| 2 | `stop` | Parar graciosamente |
| 3 | `restart` | Reiniciar |
| 4 | `status` | Status + health check + build info |
| 5 | `kill` | Force kill (kill -9) |
| 6 | `logs` | Logs tempo real |
| 7 | `clean` | Limpar processos zombie |
| 8 | `cover-logs` | Logs filtrados de capas IA |
| 9 | `start-preview` | Sync + start preview branch |
| 10 | `promote-preview` | Deploy para produção (main) |

---

## 🚀 Uso Rápido

**Bash** (Linux/Mac):
```bash
cd server
./server-manager.sh [comando]   # ou sem args para menu
```

**PowerShell** (Windows):
```powershell
cd server
.\server-manager.ps1 [comando]  # ou sem args para menu
```

**Exemplos**:
```bash
./server-manager.sh start            # Iniciar
./server-manager.sh status           # Ver status + build info
./server-manager.sh start-preview    # Testar preview local
./server-manager.sh promote-preview  # Deploy produção
```

---

## ⚙️ Configuração

**Bash** (`server-manager.sh`):
```bash
PROJECT_DIR="/home/usuario/tokenmilagre-platform"
PORT=3000
LOG_FILE="/tmp/tokenmilagre-server.log"
```

**PowerShell** (`server-manager.ps1`):
```powershell
$Global:ProjectDir = "C:\Users\usuario\tokenmilagre-platform"
$Global:Port = 3000
$Global:LogFile = "$env:TEMP\tokenmilagre-server.log"
```

---

## 🔄 Preview Workflow

### Opção 9: Start Preview

**Fluxo**:
1. Busca branches `claude/*` remotas
2. Identifica mais recente (por data)
3. Checkout automático
4. `npm install`
5. Inicia servidor

**Uso**:
```bash
./server-manager.sh start-preview
```

### Opção 10: Promote to Production

**Fluxo**:
1. Mostra preview mais recente
2. Exibe commits a promover
3. **Pede confirmação** ⚠️
4. Checkout `main` + merge
5. **Pergunta se quer push** ⚠️
6. Push → Vercel auto-deploy

**Uso**:
```bash
./server-manager.sh promote-preview
```

---

## 📊 Build Info (Status)

Exibido ao rodar `status` (opção 4):

```
---------------------------------------------------------
                   BUILD INFO
---------------------------------------------------------
Type: [PROD] Production       # ou [PREV], [DEV]
Branch: main
Commit: 28acef2 - feat: Add server manager
Status: Clean ✓              # ou Dirty (X files) ⚠
Updated: 2025-11-18 00:06:47
vs Main: up to date          # ou "5 ahead", "3 behind"
```

**Tipos**:
- `[PROD]` (verde): Branch `main`
- `[PREV]` (amarelo): Branches `claude/*`
- `[DEV]` (cinza): Outras branches

**Status Git**:
- `Clean ✓`: Sem mudanças
- `Dirty (X files) ⚠`: X arquivos modificados

---

## 🎨 Cover Logs (Opção 8)

Filtra logs de geração de capas IA.

**Keywords filtradas**:
- `generateCoverImage`
- `saveCoverImage`
- `estimateImageSize`
- `INÍCIO - Geração` / `FIM - Geração`

**Colorização**:
- `[generateCoverImage]` → Magenta
- `[saveCoverImage]` → Cyan
- ✅ / `OK` → Verde
- ❌ / `ERR` → Vermelho
- `INÍCIO/FIM` → Amarelo

---

## ⚠️ Problemas Conhecidos (Windows PowerShell)

### 1. Caracteres Unicode
❌ Box drawing (`┌─┐`) não funciona
✅ Usar ASCII simples (`===`)

### 2. Colchetes `[+]`, `[-]`
❌ PowerShell interpreta como operadores
✅ Usar `[OK]`, `[ERR]`, `[!!!]`, `[>>>]`

### 3. Caractere `&`
❌ Reservado para background operator
✅ Usar "and" em strings

### 4. Emojis
❌ UTF-8 pode causar parsing error
✅ Remover emojis dos comentários

### 5. Preview Checkout Falha
⚠️ Branch pode não existir localmente
**Workaround**: Script continua em `main`

### 6. Variáveis de Ambiente Obrigatórias 🔴
Next.js requer no `.env`:
```env
NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"
NEXT_PUBLIC_TOKEN_ADDRESS="11111111111111111111111111111111111111111111"
```

Validação: `lib/env.ts`

---

## 🛠️ Features Técnicas

### Health Check
- **Bash**: CPU > 70% detectado
- **PowerShell**: CPU > 70% + `Responding` check

### Zombie Detection
- **Bash**: Defunct processes
- **PowerShell**: Unresponsive processes

### Process Detection
**Bash** (múltiplos métodos):
```bash
ss -tulpn | grep :3000              # Preferido
netstat -tulpn | grep :3000         # Fallback
lsof -ti :3000                      # Alternativa
```

**PowerShell** (API nativa):
```powershell
Get-NetTCPConnection -LocalPort 3000
Get-Process -Id $connection.OwningProcess
```

---

## 🔍 Debugging Rápido

### Servidor não inicia

1. Verificar `.env`:
```bash
ls -la .env
npm run dev  # Ver erros de validação
```

2. Verificar porta:
```bash
# Linux/Mac
lsof -i :3000

# Windows
Get-NetTCPConnection -LocalPort 3000
```

3. Ver logs:
```bash
# Linux
tail -f /tmp/tokenmilagre-server.log

# Windows
Get-Content $env:TEMP\tokenmilagre-server.log -Wait
```

### Preview não sincroniza

```bash
git fetch origin --prune
git branch -r | grep claude/
git checkout claude/BRANCH_NAME
npm install
```

---

## 📋 Checklist PowerShell Port

Ao adicionar features no PowerShell:

- [ ] Remover box drawing (`┌─┐` → `===`)
- [ ] Trocar `&` por "and"
- [ ] Remover emojis
- [ ] Usar `[OK]`/`[ERR]` em vez de `[+]`/`[-]`
- [ ] Testar: `powershell.exe -ExecutionPolicy Bypass -File script.ps1`

---

## 🎯 Uso com Claude Code

**Comandos úteis**:
```
Leia server-manager e atualize o PowerShell com funcionalidade X
```
```
Compare server-manager Bash e PowerShell e sincronize Y
```

---

## 📊 Comparação Bash vs PowerShell

| Feature | Bash | PowerShell |
|---------|------|------------|
| ASCII Art | Box drawing | ASCII simples |
| Build Info | ✅ | ✅ |
| Cover Logs | ✅ | ✅ |
| Health Check | ✅ CPU | ✅ CPU + Responding |
| Zombie Detection | ✅ Defunct | ✅ Unresponsive |
| Menu 10 opções | ✅ | ✅ |
| Preview Workflow | ✅ | ✅ |
| Real-time Logs | `tail -f` | `Get-Content -Wait` |
| Colorização | ANSI codes | PowerShell colors |

---

## 📚 Referências

**Detalhes completos**: Ver `docs/SERVER-MANAGER-DETAILED.md` (problemas, workarounds, exemplos)
**Scripts**: `server/server-manager.sh` | `server/server-manager.ps1`

---

**Status**: ✅ Ambos funcionais e sincronizados
**Scripts versionados**: Bash v2.1 | PowerShell v2.1
**Última feature**: Build Info Display
