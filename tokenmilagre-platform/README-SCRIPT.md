# 🚀 Script Automático - TokenMilagre Articles

Script único para gerenciar **TUDO** relacionado a criação de artigos.

---

## ⚡ Uso Rápido

```bash
# Primeira vez (setup)
./create-article.sh setup

# Iniciar TUDO (servidor + watcher)
./create-article.sh start

# Ver o que está acontecendo
./create-article.sh logs

# Parar TUDO
./create-article.sh stop
```

---

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `./create-article.sh start` | Inicia servidor Next.js + watcher |
| `./create-article.sh stop` | Para todos os serviços |
| `./create-article.sh restart` | Reinicia tudo |
| `./create-article.sh status` | Mostra status e estatísticas |
| `./create-article.sh logs` | Logs em tempo real do watcher |
| `./create-article.sh setup` | Configuração inicial (primeira vez) |

---

## 🎯 Workflow Completo

### 1. Setup Inicial (apenas uma vez)

```bash
cd ~/Trabalho/tokenmilagre-platform
./create-article.sh setup
```

Isso vai:
- ✅ Verificar dependências (Node, NPM, Gemini)
- ✅ Criar pastas necessárias (`~/articles/`)
- ✅ Verificar banco de dados
- ✅ Criar template de artigo

### 2. Iniciar Sistema

```bash
./create-article.sh start
```

Isso vai:
- ✅ Iniciar servidor Next.js em background
- ✅ Iniciar watcher em background
- ✅ Mostrar URLs e status

**Output esperado:**
```
✅ Sistema iniciado com sucesso!

📊 Status dos serviços:
   ● Servidor Next.js: http://localhost:3000
   ● Watcher: Monitorando /home/destakar/articles

📝 Para criar um artigo:
   1. Crie arquivo .md em: /home/destakar/articles
   2. Adicione metadados (veja _TEMPLATE.md)
   3. Salve → Automático!
```

### 3. Criar Artigo

```bash
# Com Gemini
gemini "Resuma notícia sobre Bitcoin hoje" > ~/articles/bitcoin-hoje.md

# Editar e adicionar metadados
nano ~/articles/bitcoin-hoje.md

# Salvar (Ctrl+O, Ctrl+X) → Automático! ✨
```

### 4. Monitorar

```bash
# Ver logs em tempo real
./create-article.sh logs

# Ver status
./create-article.sh status
```

### 5. Parar Tudo

```bash
./create-article.sh stop
```

---

## 🔧 O que o Script Faz

### `start` - Iniciar Sistema

1. Verifica dependências (Node, NPM, Gemini CLI)
2. Verifica configuração (`.env`)
3. Cria estrutura de pastas
4. Verifica banco de dados
5. Inicia servidor Next.js (background)
6. Inicia watcher (background)
7. Salva PIDs em `.article-system.pid`
8. Mostra status

### `stop` - Parar Sistema

1. Lê PIDs do arquivo `.article-system.pid`
2. Para servidor Next.js
3. Para watcher
4. Remove arquivo de PIDs

### `status` - Ver Status

1. Verifica se serviços estão rodando
2. Mostra PIDs e URLs
3. Mostra estatísticas:
   - Artigos pendentes
   - Artigos processados
   - Artigos em revisão

### `logs` - Ver Logs

Mostra logs do watcher em tempo real (Ctrl+C para sair)

### `setup` - Configuração Inicial

1. Verifica todas as dependências
2. Cria `.env` se não existir
3. Cria pastas `~/articles/`, `.processed/`, `.review/`
4. Verifica/cria banco de dados
5. Cria template de artigo

---

## 📁 Estrutura de Pastas

Depois do setup:

```
~/articles/
├── _TEMPLATE.md          # Template para novos artigos
├── .processed/           # Artigos publicados
├── .review/              # Artigos reprovados no fact-check
└── seu-artigo.md         # Seus artigos aqui
```

---

## 🐛 Troubleshooting

### "Sistema já está em execução!"

```bash
# Para e reinicia
./create-article.sh restart
```

### "Falha ao iniciar servidor"

```bash
# Ver logs de erro
cat /tmp/tokenmilagre-server.log

# Tentar manualmente
npm run dev
```

### "Watcher não detecta arquivos"

```bash
# Ver logs
./create-article.sh logs

# Verificar pasta
ls ~/articles/
```

### Logs não aparecem

```bash
# Logs estão em:
tail -f /tmp/tokenmilagre-server.log   # Servidor
tail -f /tmp/tokenmilagre-watcher.log  # Watcher
```

---

## 💡 Dicas

### Criar Alias

Adicione no `~/.bashrc`:

```bash
alias articles-start='~/Trabalho/tokenmilagre-platform/create-article.sh start'
alias articles-stop='~/Trabalho/tokenmilagre-platform/create-article.sh stop'
alias articles-logs='~/Trabalho/tokenmilagre-platform/create-article.sh logs'
alias articles-status='~/Trabalho/tokenmilagre-platform/create-article.sh status'
```

Depois:
```bash
source ~/.bashrc
articles-start  # Inicia tudo!
```

### Verificar se está rodando

```bash
./create-article.sh status
```

### Matar processos manualmente (se necessário)

```bash
# Se o script não conseguir parar
pkill -f "next dev"
pkill -f "watch-articles"
```

---

## ⚙️ Configuração

### APIs de Busca (Opcional - Fact-checking)

Edite `.env`:

```bash
ENABLE_FACT_CHECK=true
GOOGLE_SEARCH_API_KEY=sua-chave
GOOGLE_SEARCH_ENGINE_ID=seu-id
BRAVE_SEARCH_API_KEY=sua-chave
```

**Sem configurar:** Sistema funciona normalmente, mas **SEM** fact-checking.

---

## 🎯 Exemplo Completo

```bash
# 1. Setup (primeira vez)
cd ~/Trabalho/tokenmilagre-platform
./create-article.sh setup

# 2. Iniciar sistema
./create-article.sh start

# 3. Criar artigo
gemini "Notícia sobre Ethereum hoje" > ~/articles/ethereum-hoje.md

# 4. Adicionar metadados
nano ~/articles/ethereum-hoje.md
# (adicionar frontmatter YAML)
# Ctrl+O, Ctrl+X para salvar

# 5. Ver logs
./create-article.sh logs
# (Ctrl+C para sair)

# 6. Verificar status
./create-article.sh status

# 7. Acessar dashboard
# Abrir http://localhost:3000/dashboard/noticias

# 8. Parar quando terminar
./create-article.sh stop
```

---

## 🆘 Suporte

**Problemas?**

1. `./create-article.sh status` - Ver o que está rodando
2. `./create-article.sh logs` - Ver erros em tempo real
3. `cat /tmp/tokenmilagre-*.log` - Ver logs completos
4. `./create-article.sh restart` - Reiniciar tudo

---

## 📊 Vantagens do Script

✅ **Um comando para tudo** - Não precisa lembrar de múltiplos terminais
✅ **Background automático** - Processos rodando em segundo plano
✅ **Gerenciamento de PIDs** - Para/reinicia corretamente
✅ **Verificações automáticas** - Checa dependências antes de iniciar
✅ **Logs centralizados** - Fácil debugar problemas
✅ **Status claro** - Vê exatamente o que está rodando
✅ **Cleanup automático** - Para tudo corretamente

---

**Pronto!** 🎉

Agora você tem um script único para gerenciar todo o sistema de artigos.
