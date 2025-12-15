---
type: policy
name: TRANSPARENCY_POLICY
purpose: Firewall ético entre educação e token
inherits: _DNA.md
---

# 🔒 Política de Transparência do Token

> Integridade acima de valorização.

---

## Contexto

O projeto $MILAGRE possui um token associado no blockchain Solana. Esta política existe para **garantir que a missão educacional nunca seja comprometida** por interesses financeiros.

---

## Regras Invioláveis

| Regra | Descrição |
|-------|-----------|
| **Separação de Conteúdo** | Artigos educacionais NUNCA promovem o token $MILAGRE |
| **Disclosure Obrigatório** | Qualquer menção ao token inclui aviso de conflito de interesse |
| **Métricas Públicas** | Carteira do projeto visível em `/transparencia` |
| **Sem Promessas** | Proibido prometer valorização ou retorno financeiro |
| **Educação Primeiro** | Todo conteúdo deve ter valor independente do token |

---

## Teste de Integridade

Antes de publicar qualquer conteúdo, aplique este teste:

| Pergunta | Resposta Esperada |
|----------|-------------------|
| Removendo o token, o conteúdo ainda tem valor? | ✅ SIM |
| Leitor sem token se beneficia igualmente? | ✅ SIM |
| Conflito de interesse está declarado? | ✅ SIM (se aplicável) |
| Há promessa de valorização? | ❌ NÃO |

Se qualquer resposta estiver errada, **o conteúdo não pode ser publicado**.

---

## Zonas de Conteúdo

```yaml
@content-zones:
  educacional:
    - /educacao/*
    - /recursos/* (artigos)
    - /noticias/*
    token-mention: PROIBIDO
    
  institucional:
    - /token
    - /sobre
    - /transparencia
    token-mention: PERMITIDO com disclosure
    
  comunicação:
    - redes sociais
    - newsletter
    token-mention: APENAS com contexto educacional
```

---

## Disclosure Padrão

Quando menção ao token for permitida, usar:

> **⚠️ Aviso**: O projeto $MILAGRE possui um token associado. A equipe detém tokens. Este conteúdo não é aconselhamento financeiro. Faça sua própria pesquisa.

---

## Violações

Qualquer conteúdo que viole esta política deve ser:
1. Removido imediatamente
2. Reportado ao ARCHITECT_ZERO
3. Documentado para prevenção futura

---

## Checklist Pré-Publicação

> **Obrigatório** antes de publicar qualquer conteúdo.

| # | Item | ✓ |
|---|------|---|
| 1 | Revisor designado aprovou o conteúdo | ☐ |
| 2 | Teste de integridade aplicado (4 perguntas) | ☐ |
| 3 | Zona de conteúdo verificada | ☐ |
| 4 | Disclosure adicionado (se aplicável) | ☐ |
| 5 | Zero promessas de valorização | ☐ |
| 6 | Fontes verificadas e linkadas | ☐ |

**Responsável pela revisão**: Membro designado ou CONTENT_ARCHITECT

---

## Disclosure Expandido

Quando menção ao token for permitida, usar:

> **⚠️ Aviso de Transparência**
> - O projeto $MILAGRE possui um token associado
> - Holdings da equipe visíveis em [/transparencia](/transparencia)
> - Este conteúdo **não é aconselhamento financeiro**
> - Faça sua própria pesquisa (DYOR)

---

## Disclaimer Legal

> **Isenção de Responsabilidade**
> 
> O conteúdo deste site é apenas para fins educacionais e informativos. Nenhuma informação aqui contida constitui aconselhamento financeiro, de investimento, jurídico ou tributário. Criptomoedas são ativos de alto risco; você pode perder todo o capital investido. Consulte profissionais qualificados antes de tomar decisões financeiras. O projeto $MILAGRE e seus colaboradores não se responsabilizam por perdas decorrentes do uso destas informações.

---

```yaml
@policy-metadata:
  version: 1.1.0
  created: 2025-12-15
  updated: 2025-12-15
  approved-by: ARCHITECT_ZERO
  audited-by: DUE_DILIGENCE
  inherits: _DNA.md
  changelog:
    - v1.1.0: Added checklist, expanded disclosure, legal disclaimer (DD-001/002/004)
```
