---
type: workflow
version: 1.0.0
inherits: _DNA.md
description: Debugging sistemático em 4 fases - encontre a root cause antes de propor fixes
source: Superpowers - obra/superpowers (systematic-debugging)
---

# Debugging Sistemático

> Random fixes desperdiçam tempo e criam novos bugs. Patches rápidos mascaram problemas subjacentes.

**Iron Law:** NUNCA proponha fixes sem investigação de root cause primeiro.

---

## Quando Usar

Use para QUALQUER problema técnico:
- Falhas de teste
- Bugs em produção
- Comportamento inesperado
- Problemas de performance
- Falhas de build
- Problemas de integração

**Use ESPECIALMENTE quando:**
- Sob pressão de tempo
- "Só um fix rápido" parece óbvio
- Já tentou múltiplos fixes
- Fix anterior não funcionou

---

## As Quatro Fases

### Fase 1: Investigação de Root Cause

**ANTES de tentar QUALQUER fix:**

1. **Leia as mensagens de erro cuidadosamente**
   - Não pule erros ou warnings
   - Leia stack traces completamente
   - Anote line numbers, file paths, error codes

2. **Reproduza consistentemente**
   - Consegue reproduzir sempre?
   - Quais são os passos exatos?
   - Se não reproduzível → colete mais dados, não adivinhe

3. **Verifique mudanças recentes**
   - O que mudou que pode causar isso?
   - Git diff, commits recentes
   - Novas dependências, mudanças de config

4. **Trace o fluxo de dados**
   - Onde o valor ruim se origina?
   - O que chamou isso com valor ruim?
   - Continue traçando até encontrar a fonte
   - Corrija na fonte, não no sintoma

---

### Fase 2: Análise de Padrões

1. **Encontre exemplos funcionais**
   - Localize código similar que funciona
   - O que funciona que é similar ao que está quebrado?

2. **Compare contra referências**
   - Se implementando um padrão, leia a referência COMPLETAMENTE
   - Não passe os olhos - leia cada linha

3. **Identifique diferenças**
   - O que é diferente entre o que funciona e o que está quebrado?
   - Liste TODAS as diferenças, por menores que sejam

---

### Fase 3: Hipótese e Teste

1. **Forme uma única hipótese**
   - Declare claramente: "Eu acho que X é a root cause porque Y"
   - Escreva isso
   - Seja específico, não vago

2. **Teste minimamente**
   - Faça a MENOR mudança possível para testar a hipótese
   - Uma variável por vez
   - Não corrija múltiplas coisas de uma vez

3. **Verifique antes de continuar**
   - Funcionou? → Fase 4
   - Não funcionou? → Forme NOVA hipótese
   - NÃO adicione mais fixes por cima

---

### Fase 4: Implementação

1. **Crie teste que falha**
   - Reprodução mais simples possível
   - Use `/tdd` para escrever testes adequados

2. **Implemente fix único**
   - Corrija a root cause identificada
   - UMA mudança por vez
   - Sem "já que estou aqui" melhorias

3. **Verifique o fix**
   - Teste passa agora?
   - Outros testes continuam passando?

4. **Se 3+ fixes falharam: Questione a arquitetura**
   - Padrão indicando problema arquitetural:
     - Cada fix revela novo problema em lugar diferente
     - Fixes requerem "refatoração massiva"
   - **PARE e discuta com o usuário antes de tentar mais fixes**

---

## Red Flags - PARE e Siga o Processo

Se você se pegar pensando:
- "Fix rápido por agora, investigo depois"
- "Só tentar mudar X e ver se funciona"
- "Adicionar múltiplas mudanças, rodar testes"
- "Provavelmente é X, deixa eu corrigir"
- "Mais uma tentativa de fix" (quando já tentou 2+)

**PARE. Volte para Fase 1.**

---

## Racionalização Comum

| Desculpa | Realidade |
|----------|-----------|
| "Problema é simples, não precisa de processo" | Problemas simples têm root causes também |
| "Emergência, sem tempo para processo" | Debugging sistemático é MAIS RÁPIDO que tentativa e erro |
| "Só tentar isso primeiro" | Primeiro fix define o padrão. Faça certo desde o início |
| "Já entendi o problema" | Ver sintomas ≠ entender root cause |

---

```yaml
@workflow-links:
  - /tdd: Para criar teste que falha (Fase 4)
  - /verificacao: Verificar que fix funcionou antes de declarar sucesso
@source: https://github.com/obra/superpowers
@created: 2025-12-22
```
