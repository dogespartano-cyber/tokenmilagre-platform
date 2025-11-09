# Server Manager Skill

**Versão**: 2.0
**Última atualização**: 2025-01-08
**Propósito**: Gerenciamento completo do servidor Next.js com suporte cross-platform

---

## 📁 Arquivos

### Scripts
- **Linux/Mac**: `server/server-manager.sh` (Bash)
- **Windows**: `server/server-manager.ps1` (PowerShell)

### Configuração
- **Variáveis de ambiente**: `.env` (raiz do projeto)
- **Log file**:
  - Linux: `/tmp/tokenmilagre-server.log`
  - Windows: `%TEMP%\tokenmilagre-server.log`

---

## 🎯 Funcionalidades

Ambos os scripts (Bash e PowerShell) possuem **10 opções** idênticas:

| Opção | Comando | Descrição |
|-------|---------|-----------|
| **(1)** | `start` | Iniciar servidor de desenvolvimento |
| **(2)** | `stop` | Parar servidor graciosamente |
| **(3)** | `restart` | Reiniciar servidor |
| **(4)** | `status` | Status detalhado + health check |
| **(5)** | `kill` | Forçar encerramento (kill -9) |
| **(6)** | `logs` | Logs em tempo real (tail -f) |
| **(7)** | `clean` | Limpar processos Node.js zombie |
| **(8)** | `cover-logs` | **Logs filtrados de geração de capas IA** |
| **(9)** | `start-preview` | **Sync + Start preview branch** |
| **(10)** | `promote-preview` | **Deploy para produção (main)** |

---

## 🖥️ Versão Bash (Linux/Mac)

### Configuração Padrão
```bash
PROJECT_DIR="/home/destakar/Trabalho/tokenmilagre-platform"
PORT=3000
LOG_FILE="/tmp/tokenmilagre-server.log"
```

### Como Usar

**Modo Interativo**:
```bash
cd /path/to/server
./server-manager.sh
```

**Comandos Diretos**:
```bash
./server-manager.sh start              # Iniciar servidor
./server-manager.sh stop               # Parar servidor
./server-manager.sh restart            # Reiniciar
./server-manager.sh status             # Ver status
./server-manager.sh logs               # Logs tempo real
./server-manager.sh cover-logs         # Logs de capas IA
./server-manager.sh start-preview      # Preview workflow
./server-manager.sh promote-preview    # Deploy produção
./server-manager.sh clean              # Limpar processos
./server-manager.sh kill               # Force kill
```

### Detecção de Processos (Bash)
```bash
# Tenta múltiplos métodos (em ordem de preferência)
ss -tulpn | grep :3000              # Método 1 (preferido)
netstat -tulpn | grep :3000         # Método 2 (fallback)
lsof -ti :3000                      # Método 3 (alternativa)
```

### Health Check (Bash)
```bash
# Detecta processo em loop infinito
cpu=$(ps aux | grep $PID | awk '{print $3}')
if [ $cpu -gt 70 ]; then
    echo "[LOOP DETECTED]"
fi
```

### Zombie Process Detection (Bash)
```bash
# Detecta processos defunct
zombie_count=$(ps aux | grep -E "\[node.*\].*defunct" | wc -l)
```

### Visual (Bash)
```
┌─[ SERVER STATUS ]────────────────────────────────┐
│ Next.js Server: [ONLINE] PID: 12345 | Port: 3000
│    [+] CPU: 45.23s | MEM: 256MB
│    [+] Port: 3000
│    [+] URL: http://localhost:3000
└──────────────────────────────────────────────────┘
```

**Características Únicas do Bash**:
- ✅ ASCII art completo (box drawing characters)
- ✅ View Cover Logs com colorização avançada
- ✅ Health check (CPU > 70%)
- ✅ Zombie process detection
- ✅ Múltiplos métodos de detecção de processos

---

## 🪟 Versão PowerShell (Windows)

### Configuração Padrão
```powershell
$Global:ProjectDir = "C:\Users\Kasnen\Desktop\Claude\tokenmilagre-platform"
$Global:Port = 3000
$Global:LogFile = "$env:TEMP\tokenmilagre-server.log"
```

### Como Usar

**Modo Interativo**:
```powershell
cd C:\path\to\server
.\server-manager.ps1
```

**Comandos Diretos**:
```powershell
.\server-manager.ps1 start              # Iniciar servidor
.\server-manager.ps1 stop               # Parar servidor
.\server-manager.ps1 restart            # Reiniciar
.\server-manager.ps1 status             # Ver status
.\server-manager.ps1 logs               # Logs tempo real
.\server-manager.ps1 cover-logs         # Logs de capas IA
.\server-manager.ps1 start-preview      # Preview workflow
.\server-manager.ps1 promote-preview    # Deploy produção
.\server-manager.ps1 clean              # Limpar processos
.\server-manager.ps1 kill               # Force kill
```

### Detecção de Processos (PowerShell)
```powershell
# Usa API nativa do Windows
$connection = Get-NetTCPConnection -LocalPort $Global:Port -ErrorAction SilentlyContinue
$proc = Get-Process -Id $connection.OwningProcess
```

### Health Check (PowerShell)
```powershell
# Detecta CPU alta e processos não-responsivos
$procInfo = [PSCustomObject]@{
    Id = $proc.Id
    CPU = $proc.CPU
    IsHighCPU = ($cpuPercent -gt 70)
    Responding = $proc.Responding
}
```

### Unresponsive Process Detection (PowerShell)
```powershell
# Detecta processos travados (equivalente a zombie no Linux)
$unresponsiveProcs = Get-Process -Name "node" |
                     Where-Object { -not $_.Responding }
```

### Visual (PowerShell)
```
  =========================================================
                     SERVER STATUS
  =========================================================
  Next.js Server: RUNNING

  [OK]  PID: 12345
  [OK]  CPU: 45.23s | MEM: 256MB
  [OK]  Port: 3000
  [OK]  URL: http://localhost:3000
  =========================================================
```

**Características Únicas do PowerShell**:
- ✅ Apenas ASCII simples (compatibilidade total)
- ✅ Detecção nativa de conexões TCP (Get-NetTCPConnection)
- ✅ Health check (CPU > 70% + Responding)
- ✅ Unresponsive process detection

---

## ⚠️ Problemas Conhecidos - Windows (PowerShell)

### 1. **Parsing Error com Caracteres Unicode** ❌
**Problema**: PowerShell não suporta box drawing characters (┌─┐) diretamente em strings.

**Erro**:
```
ParserError: '}' de fechamento ausente no bloco de instrução
```

**Solução**: Usar apenas ASCII simples (`===` em vez de `┌─┐`).

---

### 2. **Parsing Error com Colchetes em Strings** ❌
**Problema**: PowerShell interpreta `[+]`, `[-]`, `[!]`, `[>]` como operadores.

**Erro**:
```
ParserError: Expressão ausente após operador unário '+'
```

**Tentativas que NÃO funcionaram**:
- ❌ `Write-Host "[+] "` - Erro
- ❌ `Write-Host '[+] '` - Erro (aspas simples também falham)
- ❌ `Write-Host "[-] "` - Erro

**Solução Final**: Usar texto simples sem colchetes.
```powershell
Write-Host "[OK]  " -ForegroundColor Green   # ✅ Funciona
Write-Host "[ERR] " -ForegroundColor Red     # ✅ Funciona
Write-Host "[!!!] " -ForegroundColor Yellow  # ✅ Funciona
Write-Host "[>>>] " -ForegroundColor Green   # ✅ Funciona
```

---

### 3. **Caractere `&` em Strings** ❌
**Problema**: `&` é reservado para operador de execução em background.

**Erro**:
```
O caráter de E comercial (&) não é permitido
```

**Solução**: Usar "and" em vez de "&".
```powershell
# ❌ Não funciona
"Sync & Start Preview"

# ✅ Funciona
"Sync and Start Preview"
```

---

### 4. **Emoji no Comentário de Cabeçalho** ❌
**Problema**: Emojis UTF-8 podem causar problemas de parsing.

**Solução**: Remover emojis dos comentários.
```powershell
# ❌ Não funciona
# 🚀 SERVER MANAGER 🚀

# ✅ Funciona
# SERVER MANAGER
```

---

### 5. **Checkout de Preview Falha** ⚠️
**Problema**: Git não consegue fazer checkout quando a branch preview tem nome longo.

**Saída**:
```
[ERR] Falha ao fazer checkout para claude/review-project-skills-011CUwD4VMTszjRZBNv4rtFs
```

**Causa**: Branch pode não existir localmente ou ter conflitos.

**Workaround Atual**: O script continua e inicia na branch `main`.

---

### 6. **Servidor Inicia em Background mas Job Fica Órfão** ⚠️
**Problema**: Usar `Start-Job` cria um job que continua rodando mesmo após o script encerrar.

**Impacto**: Múltiplas execuções criam múltiplos jobs órfãos.

**Solução Atual**: Funcional mas não ideal. Jobs são limpos ao parar o servidor.

---

### 7. **Variáveis de Ambiente Obrigatórias Faltando** 🔴 CRÍTICO
**Problema**: Next.js valida variáveis de ambiente no startup. Se faltarem, o servidor crasha imediatamente.

**Erro**:
```
❌ Erro de validação de variáveis de ambiente:
  NEXT_PUBLIC_SOLANA_NETWORK: Invalid option
  NEXT_PUBLIC_TOKEN_ADDRESS: Invalid input: expected string, received undefined
```

**Solução**: Adicionar ao `.env` (raiz do projeto):
```env
# Solana Network (mainnet-beta, devnet, testnet)
NEXT_PUBLIC_SOLANA_NETWORK="mainnet-beta"

# Token Milagre Address (Solana mainnet - mínimo 32 caracteres)
NEXT_PUBLIC_TOKEN_ADDRESS="11111111111111111111111111111111111111111111"
```

**Validação**: Ver `lib/env.ts` para regras completas.

---

## 🔄 Preview Workflow (Opções 9 e 10)

Sistema completo de gestão de branches preview do Claude Code.

### **Opção 9: Sync & Start Preview**

**O que faz**:
1. Busca branches `claude/*` no remoto
2. Identifica a **mais recente** (por data de commit)
3. Faz checkout automático
4. Atualiza dependências (`npm install`)
5. Inicia servidor na branch preview

**Bash**:
```bash
./server-manager.sh start preview
```

**PowerShell**:
```powershell
.\server-manager.ps1 start-preview
```

---

### **Opção 10: Promote Preview to Production**

**O que faz**:
1. Mostra branch preview mais recente
2. Mostra commits que serão promovidos
3. **Pede confirmação** ⚠️
4. Faz checkout para `main`
5. Merge da preview em `main`
6. **Pergunta se quer fazer push** ⚠️
7. Se sim: Push para produção (Vercel faz deploy)
8. Opcionalmente: Deleta branch preview local

**Bash**:
```bash
./server-manager.sh promote-preview
```

**PowerShell**:
```powershell
.\server-manager.ps1 promote-preview
```

**Fluxo Completo**:
```
1. Claude Code cria preview branch (claude/*)
   ↓
2. Usuário testa localmente (opção 9)
   ↓
3. Se aprovado, promove para produção (opção 10)
   ↓
4. Vercel detecta push em main e faz deploy automático
```

---

## 🎨 Cover Logs (Opção 8)

Funcionalidade especial que filtra logs relacionados à **geração de capas com IA**.

### Palavras-chave Filtradas
- `generateCoverImage`
- `saveCoverImage`
- `Geração de Imagem` / `Geracao de Imagem`
- `INÍCIO - Geração` / `FIM - Geração`
- `estimateImageSize`

### Colorização (Bash)
```bash
# Colorir baseado no conteúdo
[generateCoverImage]    → Magenta
[saveCoverImage]        → Cyan
✅                      → Verde
❌                      → Vermelho
🎨                      → Magenta
INÍCIO/FIM - Geração    → Amarelo
```

### Colorização (PowerShell)
```powershell
# Colorir baseado no conteúdo
[generateCoverImage]    → Magenta
[saveCoverImage]        → Cyan
OK                      → Verde
ERR/ERROR               → Vermelho
INÍCIO/FIM              → Amarelo
```

**Uso**:
```bash
# Bash
./server-manager.sh cover-logs

# PowerShell
.\server-manager.ps1 cover-logs
```

---

## 📊 Comparação Bash vs PowerShell

| Funcionalidade | Bash (Linux/Mac) | PowerShell (Windows) |
|----------------|------------------|----------------------|
| **ASCII Art Completo** | ✅ Box drawing chars | ✅ ASCII simples |
| **View Cover Logs** | ✅ | ✅ |
| **Health Check (CPU > 70%)** | ✅ | ✅ |
| **Zombie Detection** | ✅ Defunct processes | ✅ Unresponsive processes |
| **Menu 10 opções** | ✅ | ✅ |
| **Preview Workflow** | ✅ | ✅ |
| **Real-time Logs** | ✅ `tail -f` | ✅ `Get-Content -Wait` |
| **Colorização** | ✅ ANSI codes | ✅ PowerShell colors |
| **Compatibilidade** | ✅ Linux/Mac/WSL | ✅ Windows 10/11 |

---

## 🛠️ Manutenção e Atualização

### **Atualizando Caminhos de Projeto**

**Bash** (`server-manager.sh`):
```bash
# Linha 15
PROJECT_DIR="/home/SEU_USUARIO/Trabalho/tokenmilagre-platform"
```

**PowerShell** (`server-manager.ps1`):
```powershell
# Linha 11
$Global:ProjectDir = "C:\Users\SEU_USUARIO\Desktop\Claude\tokenmilagre-platform"
```

### **Atualizando Porta**

Ambos os scripts:
```bash
PORT=3000  # Bash
$Global:Port = 3000  # PowerShell
```

### **Sincronizando Funcionalidades**

Quando adicionar nova funcionalidade:
1. ✅ Adicione no Bash primeiro
2. ✅ Porte para PowerShell (sem Unicode, sem `&`)
3. ✅ Teste em ambos os sistemas
4. ✅ Atualize esta skill

---

## 🔍 Debugging

### **Servidor não inicia**

1. Verificar variáveis de ambiente:
```bash
# Verificar se .env existe
ls -la .env

# Ver erros de validação
npm run dev
```

2. Verificar porta em uso:
```bash
# Linux/Mac
lsof -i :3000

# Windows
Get-NetTCPConnection -LocalPort 3000
```

3. Verificar logs:
```bash
# Linux
tail -f /tmp/tokenmilagre-server.log

# Windows
Get-Content $env:TEMP\tokenmilagre-server.log -Wait -Tail 50
```

### **Preview não sincroniza**

1. Verificar se branch existe:
```bash
git fetch origin --prune
git branch -r | grep claude/
```

2. Verificar conflitos:
```bash
git status
```

3. Fazer checkout manual:
```bash
git checkout claude/BRANCH_NAME
npm install
```

### **PowerShell: erro de parsing**

1. Verificar encoding UTF-8:
```powershell
Get-Content server-manager.ps1 -Encoding UTF8
```

2. Remover caracteres especiais:
   - ❌ Emojis
   - ❌ Box drawing (`┌─┐`)
   - ❌ `&` em strings

3. Testar sintaxe:
```powershell
powershell.exe -ExecutionPolicy Bypass -File server-manager.ps1 -h
```

---

## 📝 Checklist de Compatibilidade PowerShell

Ao portar funcionalidades do Bash para PowerShell:

- [ ] ✅ Remover box drawing characters (`┌─┐` → `===`)
- [ ] ✅ Trocar `&` por "and" em strings
- [ ] ✅ Remover emojis dos comentários
- [ ] ✅ Usar `[OK]`, `[ERR]`, `[!!!]`, `[>>>]` em vez de `[+]`, `[-]`, `[!]`, `[>]`
- [ ] ✅ Testar com `powershell.exe -ExecutionPolicy Bypass -File script.ps1`
- [ ] ✅ Verificar compatibilidade com Windows 10/11
- [ ] ✅ Documentar novos problemas encontrados

---

## 🎯 Uso com Claude Code

### **Comandos para Claude**

Quando precisar atualizar os scripts, use:

```
Leia a skill server-manager e atualize o script PowerShell com a nova funcionalidade X
```

ou

```
Compare os dois scripts (Bash e PowerShell) usando a skill server-manager e sincronize a funcionalidade Y
```

### **Informações que a Skill Contém**

- ✅ Localização dos arquivos
- ✅ Configuração padrão
- ✅ Todas as 10 funcionalidades
- ✅ Diferenças entre Bash e PowerShell
- ✅ Problemas conhecidos do Windows
- ✅ Workarounds e soluções
- ✅ Preview workflow completo
- ✅ Cover logs filtering
- ✅ Health check implementation
- ✅ Checklist de compatibilidade

---

## 📚 Referências

- **Documentação Next.js**: https://nextjs.org/docs
- **PowerShell Docs**: https://learn.microsoft.com/powershell
- **Git Branch Management**: https://git-scm.com/docs/git-branch
- **Vercel Deployments**: https://vercel.com/docs/deployments

---

**Última sincronização**: 2025-01-08
**Scripts versionados**: Bash v2.0 | PowerShell v2.0
**Status**: ✅ Ambos funcionais e sincronizados
