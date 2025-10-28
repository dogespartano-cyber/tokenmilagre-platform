# 📊 Guia de Atualização - Dados de ETFs

## 🎯 Objetivo

Este guia explica como atualizar os dados dos ETFs de Bitcoin e Ethereum na página de Gráficos.

## 📍 Localização do Arquivo

```
components/ETFMetricsSection.tsx
```

Dados começam na linha ~30 (procure por `const ETF_DATA`)

## ⏰ Frequência Recomendada

- **Ideal:** Toda segunda-feira de manhã
- **Mínimo:** Quinzenalmente
- **Crítico:** Após grandes movimentos de mercado

## 🔄 Como Atualizar (3 Métodos)

### Método 1: Comando Simples

Em uma nova sessão do Claude, peça:

```
Atualize os dados dos ETFs em components/ETFMetricsSection.tsx com dados de hoje
```

O Claude irá:
1. Tentar acessar Farside Investors
2. Se bloqueado, pedirá os dados manualmente
3. Atualizar o arquivo com novos valores

### Método 2: Fornecer Dados Manualmente

Se você já tem os dados, forneça assim:

```
Atualize components/ETFMetricsSection.tsx com estes dados:

Bitcoin ETF:
- AUM Total: $XX.XB
- Inflows 7d: $X.XB
- BlackRock IBIT: XX%, $XX.XB
- Fidelity FBTC: XX%, $XX.XB
- Grayscale GBTC: XX%, $XX.XB

Ethereum ETF:
- AUM Total: $X.XB
- Inflows 7d: $X.XB
- BlackRock ETHA: XX%, $X.XB
- Fidelity FETH: XX%, $X.XB
- Grayscale ETHE: XX%, $X.XB
```

### Método 3: Copiar/Colar das Fontes

1. Abra as fontes:
   - Bitcoin: https://farside.co.uk/btc/
   - Ethereum: https://farside.co.uk/eth/
   - CoinGlass BTC: https://www.coinglass.com/bitcoin-etf
   - CoinGlass ETH: https://www.coinglass.com/eth-etf

2. Cole os dados relevantes e peça:
```
Com base nestes dados do Farside/CoinGlass [colar dados],
atualize components/ETFMetricsSection.tsx
```

## 📊 Dados a Atualizar

### Para Bitcoin e Ethereum:

1. **`lastUpdate`** - Data de hoje (formato: 'YYYY-MM-DD')
2. **`totalAUM`** - Total Assets Under Management
3. **`inflows7d`** - Soma dos últimos 7 dias de flows
4. **`inflows30d`** - Soma dos últimos 30 dias de flows
5. **`topETFs`** - Array com top 3 ETFs:
   - `name`: Nome do ETF
   - `share`: Participação % de mercado
   - `aum`: Assets under management individual

## 📈 Fontes de Dados Confiáveis

### Primária (Grátis):
- **Farside Investors**: https://farside.co.uk/
  - BTC: https://farside.co.uk/btc/
  - ETH: https://farside.co.uk/eth/

### Secundária (Dashboards):
- **CoinGlass**:
  - BTC: https://www.coinglass.com/bitcoin-etf
  - ETH: https://www.coinglass.com/eth-etf
- **SoSoValue**:
  - BTC: https://m.sosovalue.com/assets/etf/us-btc-spot
  - ETH: https://m.sosovalue.com/assets/etf/us-eth-spot

## ⚠️ Importante

- **Não** remover a estrutura existente
- **Manter** formato dos valores (ex: "$60.8B" com B para billions)
- **Atualizar** a data em `lastUpdate`
- **Verificar** que valores fazem sentido (AUM > inflows, etc)

## 🎯 Exemplo Completo de Atualização

```javascript
const ETF_DATA = {
  bitcoin: {
    name: 'Bitcoin ETFs (EUA)',
    symbol: 'BTC',
    lastUpdate: '2025-11-04',  // ← ATUALIZAR
    totalAUM: '$65.2B',         // ← ATUALIZAR
    inflows7d: '$4.8B',         // ← ATUALIZAR
    inflows30d: '$13.1B',       // ← ATUALIZAR
    topETFs: [
      { name: 'BlackRock IBIT', share: '49%', aum: '$31.9B' }, // ← ATUALIZAR
      { name: 'Fidelity FBTC', share: '22%', aum: '$14.3B' },  // ← ATUALIZAR
      { name: 'Grayscale GBTC', share: '14%', aum: '$9.1B' }   // ← ATUALIZAR
    ],
    trend: 'positive', // ← ATUALIZAR se necessário ('positive' ou 'negative')
    description: '...' // Geralmente não muda
  },
  // ... mesmo para ethereum
}
```

## ✅ Checklist Pós-Atualização

Após atualizar, verificar:
- [ ] Data atualizada em `lastUpdate`
- [ ] Valores de AUM fazem sentido (geralmente crescentes)
- [ ] Soma dos top 3 ETFs não ultrapassa 100%
- [ ] Trend reflete o sentimento do mercado
- [ ] Arquivo sem erros de sintaxe
- [ ] Testar página `/graficos` funcionando

## 📞 Dúvidas?

Consulte o arquivo:
```
components/ETFMetricsSection.tsx
```

Os dados estão claramente marcados com comentários `// ← ATUALIZAR` nas linhas relevantes.

---

**Última atualização deste guia:** 2025-10-28
