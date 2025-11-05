# 🖼️ Como Ver Logs de Geração de Capas em Tempo Real

## ✅ Sistema Configurado!

O `server-manager.sh` foi atualizado para:
- ✅ Salvar todos os logs em arquivo (`/tmp/tokenmilagre-server.log`)
- ✅ Mostrar logs em tempo real
- ✅ **Filtrar e colorir logs de geração de capas**

---

## 🚀 Como Usar

### Opção 1: Modo Interativo (Recomendado)

```bash
cd /home/destakar/Trabalho
./server-manager.sh
```

**Passo a passo:**
1. Abrir menu (comando acima)
2. Escolher opção **8. 🖼️ Ver Logs de Capas (Tempo Real)**
3. Deixar janela aberta
4. Em outra aba/janela: criar artigo no navegador
5. **Logs aparecem em tempo real** com cores!

### Opção 2: Direto no Terminal

```bash
cd /home/destakar/Trabalho
./server-manager.sh cover-logs
```

Isso abre diretamente a visualização de logs de capas.

---

## 🎨 Cores dos Logs

| Elemento | Cor | Exemplo |
|----------|-----|---------|
| `[generateCoverImage]` | 🟣 **Magenta Brilhante** | Logs da geração de imagem |
| `[saveCoverImage]` | 🔵 **Ciano Brilhante** | Logs de salvamento |
| `✅` | 🟢 **Verde** | Sucesso |
| `❌` | 🔴 **Vermelho** | Erro |
| `🎨` | 🟣 **Magenta** | Ícone de arte |
| `INÍCIO/FIM` | 🟡 **Amarelo** | Delimitadores |

---

## 📋 Exemplo de Logs que Você Verá

```
========================================
🎨 INÍCIO - Geração de Imagem de Capa
========================================
Título: Bitcoin atinge $100k
Slug: bitcoin-100k-20251101
Categoria: bitcoin
Sentiment: positive
[generateCoverImage] 🚀 Iniciando geração...
[generateCoverImage] 🎨 Cores selecionadas: { from: '#F59E0B', to: '#EF4444' }
[generateCoverImage] 📡 Chamando API Gemini Image...
[generateCoverImage] 📊 Status da resposta: 200 OK
[generateCoverImage] ✅ Imagem extraída com sucesso!
[saveCoverImage] 💾 Iniciando salvamento...
[saveCoverImage] ✅ Arquivo salvo com sucesso!
✅✅✅ SUCESSO COMPLETO! ✅✅✅
🖼️ URL da capa: /images/covers/news/bitcoin-100k-1730476800000.jpg
========================================
🏁 FIM - Geração de Imagem de Capa
========================================
```

---

## 🔧 Outros Comandos Úteis

### Ver Todos os Logs (Não Filtrados)
```bash
./server-manager.sh logs
```

### Reiniciar Servidor
```bash
./server-manager.sh restart
```

### Ver Status
```bash
./server-manager.sh status
```

---

## 🧪 Fluxo de Teste Completo

**Terminal 1 (Logs):**
```bash
cd /home/destakar/Trabalho
./server-manager.sh cover-logs
```

**Terminal 2 (ou navegador):**
1. Abrir `http://localhost:3000/dashboard/criar-artigo`
2. Selecionar "Notícia"
3. Digitar: "Bitcoin atinge $100k"
4. Aguardar Perplexity gerar
5. Clicar em **"Processar com Gemini + Gerar Capa 🎨"**
6. **Ver logs em tempo real no Terminal 1!** 🎉

---

## ❓ Troubleshooting

### Logs não aparecem
```bash
# Verificar se arquivo de log existe
ls -lh /tmp/tokenmilagre-server.log

# Se não existir, reiniciar servidor:
./server-manager.sh restart
```

### Servidor não está rodando
```bash
# Verificar status
./server-manager.sh status

# Iniciar se estiver parado
./server-manager.sh start
```

### Quer ver logs antigos (não em tempo real)
```bash
cat /tmp/tokenmilagre-server.log | grep -E "generateCoverImage|saveCoverImage"
```

---

## 💡 Dicas

1. **Use dois terminais lado a lado** para ver logs enquanto testa
2. **Ctrl+C** para sair da visualização de logs
3. **Logs são coloridos** - se não ver cores, terminal pode não suportar
4. **Arquivo de log é limpo** ao reiniciar servidor

---

Criado em: 2025-11-01
Última atualização: 2025-11-01
