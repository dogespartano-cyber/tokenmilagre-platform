# 🚀 Melhorias do Editor com IA - Roadmap Completo

**Projeto**: Token Milagre Platform
**Componente**: `/dashboard/editor` (Edição de artigos com Gemini)
**Data**: 2025-11-04
**Status**: Fase 1 Completa ✅

---

## ✅ Fase 1: Fundação (IMPLEMENTADO)

### 1. Sanitização JSON Robusta ✅
**Arquivo**: `lib/json-sanitizer.ts`

**Implementado**:
- Função `sanitizeJSON()` - Remove caracteres de controle
- Função `extractJSON()` - Extrai JSON de markdown/texto
- Função `parseJSONSafely()` - Parse com fallback
- Função `parseJSONRobust()` - Parse robusto com logs de debug

**Impacto**: Elimina erros de parsing JSON que causavam falhas na edição

**Uso**:
```typescript
import { parseJSONRobust } from '@/lib/json-sanitizer';
const article = parseJSONRobust(geminiResponse, 'refine-article');
```

---

### 2. Validação Visual após Edição ✅
**Arquivo**: `app/api/refine-article/route.ts`, `app/dashboard/editor/page.tsx`

**Implementado**:
- API retorna `validation` junto com artigo refinado
- Score 0-100 de qualidade
- Lista de erros e avisos
- Mensagem visual no chat com:
  - Badge de qualidade (🌟/✨/👍/⚠️)
  - Erros críticos listados
  - Avisos de melhorias

**Exemplo de resposta**:
```
✅ Alterações aplicadas!

✨ Qualidade: 85/100 (Válido)

⚠️ Avisos (2):
  • Notícia tem apenas 4 seções H2 (ideal: 5-6)
  • Tags poderiam ser mais específicas

Confira o preview atualizado à esquerda.
```

**Impacto**: Usuário vê imediatamente se as edições mantiveram a qualidade

---

### 3. API de Sugestões Inteligentes ✅
**Arquivo**: `app/api/suggest-improvements/route.ts`

**Implementado**:
- Endpoint POST `/api/suggest-improvements`
- Gemini analisa 6 aspectos:
  1. Título
  2. Resumo
  3. Estrutura
  4. Qualidade do texto
  5. SEO e keywords
  6. Engajamento
- Retorna sugestões específicas e acionáveis

**Formato de resposta**:
```markdown
🎯 **Título**: Adicionar dado específico para maior impacto
💡 **Como aplicar**: "Bitcoin Atinge Máxima" → "Bitcoin Atinge US$ 100k pela Primeira Vez"

🎯 **SEO**: Tags muito genéricas
💡 **Como aplicar**: Trocar "crypto" por "bitcoin-etf", "sec-aprovacao"
```

**Status**: API criada, falta integrar no frontend ⚠️

---

## 🔨 Fase 2: Experiência do Usuário (PLANEJADO)

### 4. Botão de Sugestões Inteligentes
**Arquivo**: `app/dashboard/editor/page.tsx`

**O que fazer**:
1. Adicionar botão "🤖 Analisar e Sugerir Melhorias" no chat
2. Chamar `/api/suggest-improvements`
3. Mostrar sugestões em mensagem do assistente
4. Permitir aplicar sugestões clicando

**Localização sugerida**: Acima do input de chat, ao lado de templates rápidos

**Código exemplo**:
```tsx
const handleSuggestImprovements = async () => {
  setMessages(prev => [...prev, {
    role: 'user',
    content: '🤖 Analisar e sugerir melhorias'
  }]);

  setChatLoading(true);
  try {
    const response = await fetch('/api/suggest-improvements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: editedItem, articleType: type })
    });

    const data = await response.json();

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.suggestions
    }]);
  } catch (error: any) {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `❌ Erro: ${error.message}`
    }]);
  } finally {
    setChatLoading(false);
  }
};
```

**Impacto**: ALTO - Usuário recebe sugestões proativas sem precisar pensar

**Prioridade**: 🔴 ALTA

---

### 5. Templates de Prompts Rápidos
**Arquivo**: `app/dashboard/editor/page.tsx`

**O que fazer**:
1. Criar array de templates comuns
2. Adicionar botões rápidos acima do input
3. Clicar = preenche input automaticamente

**Templates sugeridos**:
```typescript
const promptTemplates = [
  { icon: '✨', label: 'Melhorar SEO', prompt: 'Otimize o título e tags para SEO sem alterar o conteúdo' },
  { icon: '📝', label: 'Simplificar', prompt: 'Simplifique a linguagem para iniciantes mantendo as informações' },
  { icon: '📚', label: 'Expandir', prompt: 'Adicione mais exemplos práticos e detalhes técnicos' },
  { icon: '🎯', label: 'Título Impactante', prompt: 'Reescreva o título para ser mais chamativo e incluir dados específicos' },
  { icon: '🔍', label: 'Corrigir Português', prompt: 'Corrija erros de gramática, ortografia e pontuação' },
  { icon: '💎', label: 'Adicionar CTAs', prompt: 'Adicione calls-to-action apropriados ao longo do texto' },
];
```

**Interface**:
```tsx
<div className="flex flex-wrap gap-2 mb-3 px-4">
  {promptTemplates.map((template, idx) => (
    <button
      key={idx}
      onClick={() => setInput(template.prompt)}
      className="px-3 py-1 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-medium)'
      }}
    >
      {template.icon} {template.label}
    </button>
  ))}
</div>
```

**Impacto**: ALTO - Acelera edição, evita pensar em prompts

**Prioridade**: 🔴 ALTA

---

### 6. Seletor de Modelo Gemini (Flash vs Pro)
**Arquivo**: `app/dashboard/editor/page.tsx`, `app/api/refine-article/route.ts`

**O que fazer**:
1. Adicionar estado `selectedModel` no frontend
2. Toggle switch no header: Flash (rápido/barato) ⚡ | Pro (preciso/caro) 💎
3. Enviar `model` no body da API
4. API usa modelo selecionado

**Custo estimado**:
- Flash: ~$0.001 por edição
- Pro: ~$0.005 por edição (5x mais caro, mas muito mais preciso)

**Interface**:
```tsx
// No header do editor
<div className="flex items-center gap-2">
  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Modelo:</span>
  <button
    onClick={() => setSelectedModel(selectedModel === 'flash' ? 'pro' : 'flash')}
    className="px-3 py-1 rounded-lg text-sm font-semibold transition-all"
    style={{
      backgroundColor: selectedModel === 'pro' ? '#8B5CF6' : 'var(--bg-secondary)',
      color: selectedModel === 'pro' ? 'white' : 'var(--text-primary)'
    }}
  >
    {selectedModel === 'flash' ? '⚡ Flash' : '💎 Pro'}
  </button>
</div>
```

**API**:
```typescript
const modelName = model === 'pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
const aiModel = genAI.getGenerativeModel({ model: modelName });
```

**Impacto**: MÉDIO - Flexibilidade de escolher precisão vs custo

**Prioridade**: 🟡 MÉDIA

---

### 7. Diff Visual (Antes/Depois)
**Arquivo**: `components/admin/DiffViewer.tsx` (novo)

**O que fazer**:
1. Criar componente que mostra alterações
2. Usar biblioteca `react-diff-viewer` ou similar
3. Botão "Ver Alterações" no chat
4. Modal mostra diff colorido

**Exemplo de uso**:
```tsx
import DiffViewer from '@/components/admin/DiffViewer';

<DiffViewer
  oldValue={JSON.stringify(item, null, 2)}
  newValue={JSON.stringify(editedItem, null, 2)}
  splitView={true}
/>
```

**Impacto**: MÉDIO - Útil para entender exatamente o que mudou

**Prioridade**: 🟡 MÉDIA

---

### 8. Histórico de Alterações com Desfazer
**Arquivo**: `app/dashboard/editor/page.tsx`

**O que fazer**:
1. Adicionar estado `history: any[]` (max 10 versões)
2. Salvar versão anterior antes de cada edição
3. Botão "⏪ Desfazer" (desabilita se history.length === 0)
4. localStorage para persistir entre refreshes

**Implementação**:
```typescript
const [history, setHistory] = useState<any[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);

// Antes de editar
const saveToHistory = () => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(editedItem)));
  if (newHistory.length > 10) newHistory.shift();
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};

// Desfazer
const handleUndo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setEditedItem(history[historyIndex - 1]);
  }
};

// Refazer
const handleRedo = () => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(historyIndex + 1);
    setEditedItem(history[historyIndex + 1]);
  }
};
```

**Interface**:
```tsx
<div className="flex items-center gap-2">
  <button
    onClick={handleUndo}
    disabled={historyIndex <= 0}
    className="p-2 rounded-lg disabled:opacity-30"
    title="Desfazer (Ctrl+Z)"
  >
    ⏪ Desfazer
  </button>
  <button
    onClick={handleRedo}
    disabled={historyIndex >= history.length - 1}
    className="p-2 rounded-lg disabled:opacity-30"
    title="Refazer (Ctrl+Shift+Z)"
  >
    ⏩ Refazer
  </button>
  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
    {history.length} versões
  </span>
</div>
```

**Impacto**: ALTO - Segurança para experimentar sem medo

**Prioridade**: 🟡 MÉDIA (mas muito útil!)

---

### 9. Preview Completo com Citations
**Arquivo**: `app/dashboard/editor/page.tsx`

**O que fazer**:
1. Importar `ArticlePreview` do criar-artigo
2. Usar componente completo em vez do preview simplificado
3. Mostrar citations, fontes, imagens de capa

**Substituir**:
```tsx
// Preview simplificado atual
<div className="container mx-auto px-4 py-8">
  <article>
    <h1>{editedItem.title}</h1>
    <p>{editedItem.excerpt}</p>
    <ReactMarkdown>{editedItem.content?.substring(0, 1000)}</ReactMarkdown>
  </article>
</div>
```

**Por**:
```tsx
import ArticlePreview from '@/components/admin/ArticlePreview';

<ArticlePreview
  article={editedItem}
  articleType={type}
/>
```

**Impacto**: MÉDIO - Preview mais realista

**Prioridade**: 🟢 BAIXA (preview atual já funciona)

---

## 🎨 Fase 3: Recursos Avançados (FUTURO)

### 10. Edição por Seção (Click to Edit)
**Arquivo**: Novo componente `SectionEditor.tsx`

**Conceito**:
- Clicar em uma seção H2 no preview
- Abre mini-editor apenas para aquela seção
- Envia só aquela seção para Gemini (mais barato)
- Atualiza apenas aquela parte do artigo

**Benefícios**:
- Mais preciso (foco em uma seção)
- Mais barato (menos tokens)
- Mais rápido (menos processamento)

**Complexidade**: ALTA

**Impacto**: MÉDIO

**Prioridade**: 🟢 BAIXA (feature avançada)

---

### 11. Remover Componente Duplicado
**Arquivo**: `app/dashboard/artigos/_components/EditSidebar.tsx`

**O que fazer**:
```bash
rm app/dashboard/artigos/_components/EditSidebar.tsx
```

**Motivo**: Não é usado. Foi substituído pelo editor full-screen.

**Impacto**: BAIXO - Apenas limpeza de código

**Prioridade**: 🟢 BAIXA

---

## 📊 Resumo de Prioridades

### 🔴 ALTA (Implementar AGORA)
1. ✅ Sanitização JSON robusta (FEITO)
2. ✅ Validação visual após edição (FEITO)
3. ✅ API de sugestões inteligentes (FEITO)
4. ⚠️ **Botão de sugestões no editor** (FALTA)
5. ⚠️ **Templates de prompts rápidos** (FALTA)

### 🟡 MÉDIA (Implementar ESTA SEMANA)
6. Seletor de modelo Gemini (Flash/Pro)
7. Diff visual (antes/depois)
8. Histórico com desfazer/refazer

### 🟢 BAIXA (Implementar NO FUTURO)
9. Preview completo com citations
10. Edição por seção
11. Remover componente duplicado

---

## 📝 Checklist de Implementação

### Fase 1 (Completa) ✅
- [x] Criar `lib/json-sanitizer.ts`
- [x] Integrar sanitização em `/api/refine-article`
- [x] Adicionar validação no response da API
- [x] Mostrar validação visual no chat
- [x] Criar `/api/suggest-improvements`

### Fase 2 (Crítico)
- [ ] Adicionar botão "🤖 Sugerir Melhorias" no editor
- [ ] Criar array de templates de prompts
- [ ] Adicionar botões de templates rápidos
- [ ] Integrar chamada de API de sugestões
- [ ] Testar fluxo completo

### Fase 3 (Opcional)
- [ ] Implementar seletor de modelo
- [ ] Criar componente DiffViewer
- [ ] Implementar histórico com localStorage
- [ ] Substituir preview por ArticlePreview
- [ ] Adicionar edição por seção
- [ ] Remover EditSidebar.tsx

---

## 💰 Estimativa de Custos (Gemini)

### Por Edição
- **Flash**: ~$0.001 (1000 edições = $1)
- **Pro**: ~$0.005 (200 edições = $1)
- **Sugestões**: ~$0.002 (500 análises = $1)

### Uso Mensal Estimado
- 100 edições/mês com Flash: $0.10
- 20 sugestões/mês: $0.04
- **Total**: ~$0.15/mês

Se usar Pro: ~$0.50/mês

**Conclusão**: Custo MUITO baixo, pode usar Pro sem preocupação

---

## 🚀 Próximos Passos Recomendados

1. **Implementar botão de sugestões** (30 min)
2. **Adicionar templates de prompts** (20 min)
3. **Testar fluxo completo** (15 min)
4. **Commit e documentar** (10 min)

**Total**: ~1h15min para completar as funcionalidades críticas

---

**Documento criado por**: Claude Code
**Última atualização**: 2025-11-04
