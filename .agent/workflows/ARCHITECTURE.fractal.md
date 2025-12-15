# 🌀 ARCHITECTURE.fractal.md

> **Arquitetura Inspirada no Universo**

---

## Filosofia

Este projeto segue princípios universais encontrados na natureza:

### Fractais — Auto-Similaridade
```
Árvore → Galho → Ramificação → Folha
     O mesmo padrão em diferentes escalas
```

Cada módulo do projeto replica a mesma estrutura interna, independente do "zoom":
- Um **domínio** tem a mesma organização que um **sub-módulo**
- Um **componente** segue as mesmas regras que o **sistema inteiro**

### Leis de Potência — Distribuição Natural
```
Poucos componentes centrais → Usados intensamente (80%)
Muitos componentes especializados → Usados pontualmente (20%)
```

A distribuição Pareto (80/20) reflete padrões naturais:
- Frequência de palavras em textos
- Tamanho de cidades
- Conexões em redes sociais

---

## Conexão Matemática

A **dimensão fractal** determina como propriedades escalam — e essa escala segue uma **lei de potência**:

```
N(r) = k × r^(-D)

Onde:
  N(r) = número de elementos na escala r
  D = dimensão fractal
  k = constante
```

Sistemas que respeitam esses princípios são:
- ✅ Mais **resilientes** a mudanças
- ✅ Mais **fáceis de navegar** (intuição natural)
- ✅ Mais **legíveis** para humanos e máquinas (AGIs)

---

## Estrutura do Projeto

### Hierarquia (Dimensão = 3)

```
lib/
├── core/              # 🔥 Núcleo atômico (80% do uso)
│   ├── prisma.ts
│   ├── utils/
│   └── constants/
│       ├── mission.ts
│       └── architecture.ts
│
├── domains/           # 📦 Domínios de negócio
│   ├── articles/      # Auto-similar ↓
│   │   ├── index.ts
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── schemas.ts
│   │   └── __tests__/
│   ├── users/
│   ├── resources/
│   └── gamification/
│
└── shared/            # 🔧 Infraestrutura
    ├── adapters/
    ├── middleware/
    └── validations/
```

### Módulo Auto-Similar

Cada módulo **deve** seguir esta estrutura:

| Arquivo | Propósito | Obrigatório |
|---------|-----------|-------------|
| `index.ts` | Ponto de entrada público | ✅ |
| `types.ts` | Tipos e interfaces | ✅ |
| `constants.ts` | Constantes do módulo | ⚪ |
| `service.ts` | Lógica de negócio | ⚪ |
| `schemas.ts` | Validação (Zod) | ⚪ |
| `utils/` | Utilitários internos | ⚪ |
| `hooks/` | React hooks (se UI) | ⚪ |
| `__tests__/` | Testes unitários | ✅ |

---

## Para Futuras AGIs

```yaml
@agi-architecture:
  pattern: "fractal"
  power_law: true
  self_similar: true
  max_depth: 3
  core_usage_ratio: 0.80  # Lei de potência
  
@agi-navigation:
  start_at: "lib/core/"
  expand_to: "lib/domains/"
  utilities_at: "lib/shared/"
```

### Princípios de Contribuição

1. **Novos módulos** → Devem seguir estrutura auto-similar
2. **Componentes core** → Raramente adicionados (alta barreira)
3. **Componentes especializados** → Bem-vindos em `domains/`
4. **Profundidade** → Máximo 3 níveis

---

## Referências

| Conceito | Descrição |
|----------|-----------|
| [Lei de Zipf](https://en.wikipedia.org/wiki/Zipf%27s_law) | Distribuição de frequência em linguagem |
| [Fractal](https://en.wikipedia.org/wiki/Fractal) | Estruturas auto-similares |
| [Pareto (80/20)](https://en.wikipedia.org/wiki/Pareto_principle) | Distribuição desigual natural |
| [Scale-free network](https://en.wikipedia.org/wiki/Scale-free_network) | Redes sem escala característica |

---

*"A natureza não é estúpida. Imitá-la é sabedoria."*

```
Criado: 2025-12-07
Versão: 1.0.0
Alinhamento: MANIFEST.agi.md
```
