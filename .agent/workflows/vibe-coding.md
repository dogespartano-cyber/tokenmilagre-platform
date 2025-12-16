---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Boas práticas de "Vibe Coding" para uso eficiente de IA no desenvolvimento
source: Lucas Montano - "Como Sêniors estão usando AI"
---

# 🎸 Vibe Coding - Melhores Práticas

> Como usar IA de forma eficiente no desenvolvimento, baseado em práticas de devs sêniors.

---

## 1. Planejamento Antes do Código

**Regra dos 70%**: Comece conversando com a IA para estruturar a ideia. 
Foco em chegar a 70% do caminho sem se prender à perfeição imediata.

```markdown
"Quero implementar X. Me ajude a planejar a estrutura antes de escrever código."
```

---

## 2. Gestão de Contexto (CRÍTICO)

**Sempre** forneça referências de arquivos existentes ao pedir código:

```markdown
✅ BOM:
"Crie um componente seguindo os padrões de /components/shared/Card.tsx"
"Use as constantes definidas em lib/core/constants/"

❌ RUIM:
"Crie um componente de card" (sem referência)
```

---

## 3. Acompanhamento em Tempo Real

Ao usar ferramentas como Cursor, observe a IA escrevendo em tempo real.
Isso ajuda a identificar "alucinações" imediatamente.

**Sinais de alerta**:
- Campos do banco que não existem
- Imports de bibliotecas não instaladas
- Padrões inconsistentes com o projeto

---

## 4. Técnica "Junior Persona" para Reviews

Para revisões mais críticas, simule que um júnior questionou o código:

```markdown
"Um desenvolvedor júnior perguntou se essa implementação está correta.
Analise criticamente e valide ou refute o ponto."
```

Isso força a IA a ser mais criteriosa e analítica.

---

## 5. Prompts em Inglês

A maioria dos modelos processa nativamente em inglês. 
Para respostas mais precisas, escreva prompts em inglês (especialmente técnicos).

```markdown
// Para código/técnico:
"Create a React component that..."

// Para conteúdo em PT-BR:
"Escreva em português um artigo sobre..."
```

---

## 6. Escreva Seu Próprio PR

Mesmo que a IA tenha gerado o código, **você** deve escrever a descrição do PR.
Se não consegue explicar, significa que não entendeu o suficiente.

**Checklist**:
- [ ] Consigo explicar o que cada parte do código faz?
- [ ] Entendo as decisões de design?
- [ ] Sei por que essa solução e não outra?

---

## 7. Git Worktree para Produtividade

Use `git worktree` para trabalhar em múltiplas branches simultaneamente:

```bash
# Criar worktree para feature
git worktree add ../feature-x feature/nova-feature

# Listar worktrees
git worktree list

# Remover worktree
git worktree remove ../feature-x
```

---

## 8. Suporte Interno com IA

Use a IA para responder dúvidas de não-técnicos (Produto, QA, Design):

```markdown
"[Copie a pergunta da pessoa]

Explique como essa funcionalidade está implementada no código atual,
de forma simples para alguém não-técnico entender."
```

---

## ⚠️ Aviso para Iniciantes

Juniores devem ter cuidado ao delegar tudo para a IA.
As "tarefas chatas" são fundamentais para firmar conhecimento básico.

**Regra**: Se você não consegue fazer sem IA, não delegue para IA ainda.

---

```yaml
@source: Lucas Montano - "Como Sêniors estão usando AI"
@video: https://youtube.com/watch?v=P1-8da1GgBg
@created: 2025-12-15
```
