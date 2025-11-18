/**
 * FASE 1 - Artigos de Segurança
 *
 * Este arquivo contém artigos educacionais sobre segurança em criptomoedas
 * que podem ser importados para o banco de dados.
 */

export const securityArticles = [
  {
    slug: 'protecao-digital-basica-cripto',
    title: 'Proteção Digital Básica: Primeiros Passos para Segurança em Cripto',
    excerpt: 'Aprenda os fundamentos essenciais de segurança digital para proteger seus ativos de criptomoedas. Um guia completo para iniciantes.',
    content: `# Proteção Digital Básica: Primeiros Passos

## Por Que a Segurança é Crucial?

No mundo das criptomoedas, **você é seu próprio banco**. Isso significa que a segurança dos seus ativos depende 100% de você. Não há gerente de banco, não há suporte 0800. Se você perder suas chaves privadas ou cair em um golpe, seus fundos podem estar perdidos para sempre.

## 1. Senhas Fortes e Únicas

### O Que é Uma Senha Forte?

Uma senha forte deve ter:
- **Mínimo de 16 caracteres**
- **Combinação de letras maiúsculas e minúsculas**
- **Números e caracteres especiais**
- **Sem palavras do dicionário ou informações pessoais**

### Exemplo de Senha Forte:
❌ João1990 (fraca)
✅ K8$mP#2qL!9zR@vX (forte)

### Gerenciadores de Senha

Use ferramentas como:
- **Bitwarden** (open-source, gratuito)
- **1Password**
- **KeePass**

> **NUNCA** reutilize senhas entre exchanges e wallets!

## 2. Autenticação de Dois Fatores (2FA)

### O Que é 2FA?

É uma camada adicional de segurança que exige duas formas de verificação:
1. Algo que você **sabe** (senha)
2. Algo que você **tem** (código do celular)

### Tipos de 2FA:

**📱 Aplicativos Autenticadores (MELHOR)**
- Google Authenticator
- Authy
- Microsoft Authenticator

**❌ SMS (NÃO RECOMENDADO)**
- Vulnerável a SIM Swap attacks

**🔑 Chaves de Hardware (MAIS SEGURO)**
- YubiKey
- Titan Security Key

## 3. Backup de Seed Phrases

### O Que é Seed Phrase?

É uma sequência de 12-24 palavras que funciona como "senha mestra" da sua wallet. Com ela, você pode recuperar seus fundos em qualquer dispositivo.

### Regras de Ouro:

✅ **FAÇA:**
- Escreva em papel (nunca digital)
- Guarde em local seguro (cofre, local oculto)
- Faça múltiplas cópias em locais diferentes
- Use metal resistente a fogo (para grandes valores)

❌ **NUNCA:**
- Tire foto da seed phrase
- Salve em nuvem (Google Drive, Dropbox)
- Envie por email ou mensagem
- Compartilhe com ninguém (NEM SUPORTE!)

### Técnica de Armazenamento Avançada:

**Shamir's Secret Sharing:**
Divida sua seed phrase em múltiplas partes que só funcionam juntas.

Exemplo: 3 partes, sendo que 2 são necessárias para recuperar.

## 4. Cuidado com Phishing

### O Que é Phishing?

Ataques onde golpistas se passam por empresas legítimas para roubar suas credenciais.

### Como Identificar:

🚩 **Sinais de Alerta:**
- URL suspeita (binancce.com ao invés de binance.com)
- Emails pedindo para "verificar sua conta urgentemente"
- Mensagens diretas no Twitter/Discord oferecendo "suporte"
- Sites prometendo "dobrar seus Bitcoin"

✅ **Como se Proteger:**
- Sempre digite a URL manualmente
- Verifique o certificado SSL (cadeado verde)
- Marque sites oficiais nos favoritos
- Desconfie de qualquer urgência artificial

## 5. Atualizações de Software

### Por Que Atualizar?

Vulnerabilidades de segurança são descobertas constantemente. Atualizações corrigem essas falhas.

✅ **Mantenha Atualizado:**
- Sistema operacional (Windows, macOS, Linux)
- Navegador
- Apps de wallet
- Antivírus

### Configuração Recomendada:

\`\`\`
Atualizações automáticas: ATIVADO
Verificação de segurança: SEMANAL
Backup antes de atualizar: SIM
\`\`\`

## 6. Redes Wi-Fi Públicas

### O Perigo:

Wi-Fi público é como gritar suas senhas em uma praça cheia.

❌ **NUNCA faça isso em Wi-Fi público:**
- Acessar exchanges
- Fazer transações
- Digitar seed phrases
- Fazer login em wallets

✅ **Se precisar usar:**
- Use VPN confiável (ProtonVPN, Mullvad)
- Prefira conexão móvel (4G/5G)

## 7. Cold Storage vs Hot Wallets

### Diferença:

**🔥 Hot Wallet (Online)**
- Conectada à internet
- Conveniente para uso diário
- Menos segura

**❄️ Cold Wallet (Offline)**
- Nunca conectada à internet
- Para armazenamento de longo prazo
- Muito mais segura

### Estratégia Recomendada:

- **10%** em hot wallet (uso diário)
- **90%** em cold wallet (poupança)

### Hardware Wallets Populares:

1. **Ledger Nano X/S Plus** (€79-149)
2. **Trezor Model T/One** (€69-219)
3. **KeepKey** (~$50)

## Checklist de Segurança Rápido

Marque cada item:

- [ ] Senha forte e única para cada serviço
- [ ] 2FA ativado (app authenticator, não SMS)
- [ ] Seed phrase escrita e guardada em segurança
- [ ] Sistema operacional atualizado
- [ ] Antivírus ativo
- [ ] Verificação dupla de URLs antes de clicar
- [ ] Backup em múltiplos locais
- [ ] Hardware wallet para grandes valores

## Conclusão

Segurança em cripto não é opcional - é **essencial**. Dedique tempo para implementar essas práticas. Uma hora investida em segurança pode salvar anos de trabalho.

**Lembre-se:** Na blockchain, transações são irreversíveis. Prevenção é tudo!

---

**📚 Próximos Passos:**
- [Fraudes Comuns em Cripto e Como Evitá-las](#)
- [Guia Completo de Hardware Wallets](#)
- [Recuperação de Ativos: O Que Fazer em Caso de Perda](#)`,
    type: 'educational',
    category: 'seguranca',
    level: 'iniciante',
    contentType: 'Tutorial',
    readTime: '12 min',
    warningLevel: 'info',
    securityTips: JSON.stringify([
      {
        icon: '🔐',
        title: 'Use Gerenciador de Senhas',
        description: 'Nunca reutilize senhas. Um gerenciador confiável é essencial.',
      },
      {
        icon: '📱',
        title: '2FA com App Authenticator',
        description: 'SMS não é seguro. Use aplicativos autenticadores.',
      },
      {
        icon: '📝',
        title: 'Backup em Papel',
        description: 'Seed phrases devem ser escritas, nunca armazenadas digitalmente.',
      },
    ]),
    tags: JSON.stringify(['segurança', 'iniciante', 'wallet', '2fa', 'senha']),
    status: 'published',
  },

  {
    slug: 'fraudes-comuns-cripto-2024',
    title: 'Fraudes Comuns em Cripto (2024): Como Identificar e Se Proteger',
    excerpt: 'Conheça os golpes mais comuns no universo cripto e aprenda a se proteger. Atualizado com as táticas mais recentes de 2024.',
    content: `# Fraudes Comuns em Cripto: Guia de Proteção 2024

## 🚨 Por Que Você Precisa Ler Isso

Em 2023, mais de **$4 bilhões** foram roubados em golpes de criptomoedas. A maioria poderia ter sido evitada com conhecimento básico.

**Este guia pode salvar seus ativos.**

---

## 1. Golpes de Phishing

### O Que É?

Criminosos criam sites/emails falsos se passando por serviços legítimos.

### Exemplos Reais:

**Caso 1: Falsa Binance**
- URL: binancce.com (dois "c")
- Visual idêntico ao site original
- Vítima: perdeu $50.000 em 10 minutos

**Caso 2: Email Fake da Coinbase**
> "Sua conta será suspensa! Clique aqui para verificar agora!"

### 🛡️ Como se Proteger:

1. **Digite URLs manualmente** (não clique em links)
2. **Verifique o cadeado SSL** (https://)
3. **Marque sites oficiais** nos favoritos
4. **Desconfie de urgência artificial**

### Ferramenta de Verificação:

- **Netcraft Extension** (Chrome/Firefox)
- **MetaMask Phishing Detector**

---

## 2. Esquemas Ponzi / Pirâmides

### Características:

- Promessas de retorno garantido (10-20% ao mês)
- Recrutamento de novos membros
- "Seja seu próprio chefe"
- Falta de transparência sobre operações

### Exemplos Famosos:

**🚫 OneCoin (2014-2017)**
- Prometia: "A próxima Bitcoin"
- Realidade: Pirâmide de $4 bilhões
- Resultado: Fundadora desaparecida, investidores perderam tudo

**🚫 Bitconnect (2016-2018)**
- Prometia: 1% ao dia (3.678% ao ano!)
- Realidade: Esquema Ponzi clássico
- Resultado: Colapso, milhares de vítimas

### 🛡️ Sinais de Alerta:

- ❌ Retornos "garantidos" irrealistas
- ❌ Falta de endereço de contrato verificado
- ❌ Nenhuma auditoria independente
- ❌ Pressão para recrutar amigos/família
- ❌ Impossibilidade de sacar fundos facilmente

### Regra de Ouro:

> **"Se parece bom demais para ser verdade, provavelmente é."**

---

## 3. Rug Pulls (Puxadas de Tapete)

### O Que É?

Desenvolvedores criam um token/NFT, atraem investidores, e desaparecem com o dinheiro.

### Mecânica:

1. **Lançamento:** Token promissor com whitepaper bonito
2. **Hype:** Marketing agressivo, influencers pagos
3. **Investimento:** Pessoas compram o token
4. **Desaparecimento:** Devs retiram liquidez e somem

### Caso Real:

**Squid Game Token (2021)**
- Baseado na série popular
- Preço: $0.01 → $2.861 em 1 semana
- Rug pull: Criadores retiraram $3.38 milhões
- Resultado: Token caiu para $0.00003 em segundos

### 🛡️ Como Evitar:

1. **Verifique o contrato:**
   - Liquidity locked? (liquidez bloqueada)
   - Audit report? (relatório de auditoria)
   - Team tokens vested? (tokens da equipe com vesting)

2. **Use ferramentas:**
   - **Token Sniffer** (verifica honeypots)
   - **RugDoc** (analisa contratos)
   - **DexTools** (mostra holders e liquidez)

3. **Red flags imediatos:**
   - ❌ Equipe anônima
   - ❌ Sem auditoria
   - ❌ >50% de supply com um endereço
   - ❌ Função "pause" ou "blacklist" no contrato

---

## 4. Golpes de Suporte Falso

### Como Funciona:

1. Você posta no Twitter: "Ajuda com minha wallet!"
2. Recebe DM: "Olá, sou do suporte [exchange]. Qual seu problema?"
3. Pedem para você "validar" sua wallet
4. Mandam link malicioso
5. Você conecta → Drenagem total de fundos

### 🛡️ Regras Básicas:

- ❌ **NENHUMA empresa de cripto** entra em contato por DM
- ❌ Suporte real **NUNCA pede** seed phrase
- ❌ Suporte real **NUNCA pede** para conectar wallet em links

### Exemplo de Mensagem Falsa:

> "Hello sir, I'm from Binance Support Team. We detected suspicious activity. Please click here to verify your account within 24 hours or we will suspend: [link malicioso]"

**BLOQUEIE E REPORTE IMEDIATAMENTE.**

---

## 5. Airdrop Falsos

### Como Funciona:

- "Parabéns! Você ganhou 10 ETH no airdrop!"
- Para "clamar", você precisa pagar uma "taxa de gas"
- Ou: conectar sua wallet em site malicioso

### 🛡️ Como Identificar:

**Airdrop Legítimo:**
- ✅ Anunciado em canais oficiais
- ✅ Não pede dinheiro antecipado
- ✅ Não pede seed phrase
- ✅ Contrato verificado

**Airdrop Falso:**
- ❌ DM não solicitado
- ❌ Pede "taxa de ativação"
- ❌ Site suspeito (domínio recém-criado)
- ❌ Urgência ("apenas 24 horas!")

---

## 6. SIM Swap (Troca de Chip)

### O Que É?

Hacker convence operadora a transferir seu número para novo chip.

### Passo a Passo do Ataque:

1. Hacker coleta suas informações (redes sociais, vazamentos)
2. Liga para operadora se passando por você
3. Convence atendente a trocar o chip
4. Recebe seus códigos 2FA por SMS
5. Acessa suas contas e rouba tudo

### Caso Real:

**Michael Terpin (2018)**
- Perdeu: $24 milhões em criptomoedas
- Método: SIM Swap
- Resultado: Processou operadora e ganhou $75 milhões

### 🛡️ Como se Proteger:

1. **NÃO USE 2FA por SMS** (use apps authenticator)
2. **Configure PIN na operadora**
3. **Não compartilhe número em redes sociais**
4. **Use número secundário** para contas importantes

---

## 7. Malware e Keyloggers

### Tipos Comuns:

**Clipboard Hijacker:**
- Você copia endereço de wallet
- Malware substitui por endereço do hacker
- Você cola e envia fundos para criminoso

**Keylogger:**
- Registra tudo que você digita
- Captura senhas, seed phrases
- Envia para hacker

### 🛡️ Proteção:

1. **Antivírus atualizado:**
   - Malwarebytes
   - Bitdefender
   - Kaspersky

2. **Sempre verifique endereços:**
   - Confira primeiros 6 e últimos 4 caracteres
   - Use ENS domains (nome.eth)

3. **Hardware wallet** (previne 99% dos malwares)

---

## Checklist: Estou Sendo Enganado?

Se você responder "SIM" a qualquer pergunta, **PARE IMEDIATAMENTE:**

- [ ] Estão prometendo retornos garantidos?
- [ ] Pedem minha seed phrase?
- [ ] Recebi DM não solicitado oferecendo "ajuda"?
- [ ] Site tem domínio estranho ou recém-criado?
- [ ] Pedem pagamento antecipado para "liberar" fundos?
- [ ] Há urgência artificial ("apenas hoje!")?
- [ ] Não consigo sacar meus fundos facilmente?
- [ ] Projeto não tem auditoria ou equipe transparente?

---

## O Que Fazer se Você Caiu em Um Golpe

### Ação Imediata (primeiros 10 minutos):

1. **Troque TODAS as senhas**
2. **Revogue permissões de contratos:**
   - Use: revoke.cash ou etherscan.io
3. **Transfira fundos restantes** para nova wallet
4. **Congele cartões** associados

### Denúncias:

- **Polícia Federal** (Delegacia de Crimes Cibernéticos)
- **Plataformas:** Twitter, Discord (reporte contas falsas)
- **Blockchain:** Marque endereço como scam em explorers

### Aceitação:

Infelizmente, na maioria dos casos, **fundos não serão recuperados**. Blockchain é irreversível.

**Foque em prevenir o próximo ataque.**

---

## Recursos para Verificação

### Sites Confiáveis:

- **CoinMarketCap** (verifica tokens)
- **Etherscan** (analisa contratos)
- **Scam Alert** (lista golpes conhecidos)
- **DeFi Safety** (scores de protocolos)

### Comunidades:

- **r/CryptoCurrency** (Reddit)
- **CryptoTwitter** (siga analistas confiáveis)

---

## Conclusão

**A melhor defesa é o conhecimento.**

Compartilhe este guia com amigos e familiares. Muitos golpes poderiam ser evitados com informação básica.

**Lembre-se:** No cripto, não há "ctrl+Z". Prevenção é tudo.

---

**🔗 Continue Aprendendo:**
- [Proteção Digital Básica](#)
- [Como Usar Hardware Wallets](#)
- [Auditoria Comunitária de Contratos](#)`,
    type: 'educational',
    category: 'seguranca',
    level: 'intermediario',
    contentType: 'Artigo',
    readTime: '18 min',
    warningLevel: 'critical',
    securityTips: JSON.stringify([
      {
        icon: '🚨',
        title: 'Nunca Compartilhe Seed Phrase',
        description: 'Nenhum suporte legítimo pedirá suas palavras de recuperação.',
      },
      {
        icon: '🔍',
        title: 'Verifique Contratos',
        description: 'Use TokenSniffer e RugDoc antes de investir em novos tokens.',
      },
      {
        icon: '⚠️',
        title: 'Desconfie de Promessas Irrealistas',
        description: 'Retornos garantidos de 10%+ ao mês são sempre golpes.',
      },
      {
        icon: '🛡️',
        title: 'Use Hardware Wallet',
        description: 'Para valores significativos, cold storage é essencial.',
      },
    ]),
    tags: JSON.stringify(['segurança', 'fraudes', 'scam', 'phishing', 'proteção']),
    status: 'published',
    projectHighlight: false,
  },

  {
    slug: 'auditoria-comunitaria-contratos',
    title: 'Auditoria Comunitária: Como Validar Contratos Inteligentes',
    excerpt: 'Aprenda a fazer sua própria verificação básica de contratos inteligentes e entender relatórios de auditoria profissional.',
    content: `# Auditoria Comunitária: Validando Contratos Inteligentes

## Por Que Isso Importa?

Contratos inteligentes são **imutáveis** - uma vez implantados, não podem ser alterados. Se há uma backdoor ou vulnerabilidade, seus fundos estão em risco.

**A comunidade é a primeira linha de defesa.**

---

## O Que é Auditoria de Contrato?

Análise detalhada do código para identificar:
- 🐛 Bugs e vulnerabilidades
- 🚪 Backdoors (portas dos fundos)
- 🎭 Funções maliciosas ocultas
- ⚠️ Riscos de centralização

---

## Nível 1: Verificação Básica (Qualquer Pessoa Pode Fazer)

### 1. Contrato Verificado?

**Onde verificar:** Etherscan / BSCScan / PolygonScan

✅ **BOM:** Código-fonte disponível e verificado
❌ **RUIM:** Código não verificado ("bytecode" apenas)

### 2. Verificar Holders

**Sinais de alerta:**
- ❌ Top holder tem >50% do supply
- ❌ Top 10 holders têm >90% do supply
- ✅ Distribuição equilibrada

**Ferramenta:** Etherscan > Holders tab

### 3. Liquidez Bloqueada?

**O que procurar:**
- Liquidity locked por quanto tempo?
- Em qual plataforma? (Unicrypt, Team Finance)
- Percentual da liquidez bloqueada?

**Ideal:**
- ✅ 100% locked por 1+ ano
- ❌ Unlocked ou lock < 6 meses

### 4. Honeypot Test

**O que é:** Contrato que permite comprar mas não vender

**Ferramentas:**
- **Honeypot.is**
- **Token Sniffer**

Simplesmente cole o endereço do contrato e veja o resultado.

---

## Nível 2: Leitura de Contrato (Básico)

### Funções Perigosas a Evitar:

\`\`\`solidity
// 🚨 FUNÇÃO DE MINT ILIMITADO
function mint(address _to, uint256 _amount) public onlyOwner {
    _mint(_to, _amount);
}
// Perigo: Owner pode criar tokens infinitos

// 🚨 FUNÇÃO DE PAUSA
function pause() public onlyOwner {
    _pause();
}
// Perigo: Owner pode congelar todas as transações

// 🚨 BLACKLIST
function blacklist(address _user) public onlyOwner {
    blacklisted[_user] = true;
}
// Perigo: Owner pode impedir você de vender

// 🚨 TAXA VARIÁVEL
function setTaxFee(uint256 _taxFee) public onlyOwner {
    taxFee = _taxFee;
}
// Perigo: Owner pode aumentar taxa para 100%
\`\`\`

### Funções Aceitáveis (Se Bem Implementadas):

\`\`\`solidity
// ✅ RENOUNCE OWNERSHIP (Renunciar propriedade)
function renounceOwnership() public onlyOwner {
    owner = address(0);
}
// Bom: Remove controle centralizado

// ✅ BURN (Queimar tokens)
function burn(uint256 amount) public {
    _burn(msg.sender, amount);
}
// Bom: Reduz supply, pode valorizar token

// ✅ TIME LOCK
modifier onlyOwner() {
    require(block.timestamp >= unlockTime);
    _;
}
// Bom: Mudanças só após período de espera
\`\`\`

---

## Nível 3: Usando Ferramentas Automatizadas

### 1. **Token Sniffer**

**O que faz:**
- Analisa padrões de código malicioso
- Compara com banco de dados de scams
- Dá score de risco (0-100)

**Como usar:**
1. Acesse tokensniffer.com
2. Cole endereço do contrato
3. Veja o score:
   - 🟢 0-30: Baixo risco
   - 🟡 31-70: Risco moderado
   - 🔴 71-100: Alto risco

### 2. **RugDoc**

**O que faz:**
- Análise profissional de projetos DeFi
- Classificação de risco
- Highlights de código preocupante

**Classificações:**
- 🟢 Low Risk
- 🟡 Medium Risk
- 🔴 High Risk
- ⚫ Not Eligible (não analisável)

### 3. **DexTools**

**O que faz:**
- Visualização de liquidez
- Histórico de preço
- Análise de holders
- Eventos do contrato

**Red flags no DexTools:**
- ❌ Liquidez caindo rapidamente
- ❌ Spike de vendas grandes
- ❌ Muitas wallets criadas recentemente

---

## Nível 4: Relatórios de Auditoria Profissional

### Empresas de Auditoria Confiáveis:

**Top Tier:**
1. **CertiK** (mais rigorosa)
2. **PeckShield**
3. **SlowMist**
4. **Trail of Bits**
5. **OpenZeppelin**

**Mid Tier:**
1. **Hacken**
2. **QuillAudits**
3. **Solidified**

### Como Ler um Relatório:

**Estrutura típica:**

1. **Executive Summary**
   - Resumo dos achados
   - Score geral

2. **Critical Issues** (Críticas)
   - Vulnerabilidades que podem causar perda de fundos
   - **DEVE ser 0** para você investir

3. **Major Issues** (Graves)
   - Problemas sérios mas não críticos
   - Idealmente 0, máximo 1-2 (se resolvidos)

4. **Medium/Low Issues**
   - Melhorias recomendadas
   - Aceitável ter alguns

5. **Informational**
   - Boas práticas, gas optimization
   - Não afetam segurança

### Red Flags em Relatórios:

- ❌ Critical issues não resolvidos
- ❌ Auditoria de empresa desconhecida
- ❌ Relatório genérico (template)
- ❌ Data da auditoria > 1 ano
- ❌ Código mudou após auditoria

### Exemplo de Bom vs Ruim:

**❌ Projeto Arriscado:**
\`\`\`
Critical Issues: 3 (2 não resolvidos)
Major Issues: 7 (4 não resolvidos)
Auditoria: FakeAudit LLC (empresa desconhecida)
\`\`\`

**✅ Projeto Confiável:**
\`\`\`
Critical Issues: 2 (TODOS resolvidos)
Major Issues: 3 (TODOS resolvidos)
Medium: 5 (4 resolvidos)
Auditoria: CertiK (renomada)
\`\`\`

---

## Checklist de Segurança: Investir ou Não?

Use esta checklist antes de investir em qualquer token novo:

### Contrato:
- [ ] Código verificado no explorer
- [ ] Sem honeypot (testado em honeypot.is)
- [ ] Sem funções de mint ilimitado
- [ ] Ownership renunciada OU timelock
- [ ] Liquidez bloqueada (1+ ano)

### Auditoria:
- [ ] Auditoria por empresa reconhecida
- [ ] Zero critical issues não resolvidos
- [ ] Relatório recente (<6 meses)
- [ ] Código não mudou pós-auditoria

### Tokenomics:
- [ ] Distribuição equilibrada (top holder <10%)
- [ ] Supply total claro e verificável
- [ ] Taxas razoáveis (<10% total)

### Equipe:
- [ ] Equipe doxxed (identidade pública) OU
- [ ] Histórico comprovado no espaço
- [ ] Comunicação ativa e transparente

### Comunidade:
- [ ] Comunidade engajada e real (não bots)
- [ ] Discussões técnicas (não só "moon")
- [ ] Moderação saudável

**Se marcar TODOS:** Risco baixo-moderado
**Se faltar 1-2:** Risco moderado (invista pouco)
**Se faltar 3+:** Risco alto (evite ou só "money to lose")

---

## Ferramentas Essenciais - Resumo

| Ferramenta | Uso | Link |
|------------|-----|------|
| **Etherscan** | Verificar contrato | etherscan.io |
| **Token Sniffer** | Detectar scams | tokensniffer.com |
| **Honeypot.is** | Testar honeypots | honeypot.is |
| **RugDoc** | Análise de risco | rugdoc.io |
| **DexTools** | Liquidez e charts | dextools.io |
| **Revoke.cash** | Revogar permissões | revoke.cash |

---

## Participando da Auditoria Comunitária

### Como Contribuir:

1. **Reporte Suspeitas:**
   - Encontrou algo estranho? Poste em:
     - Reddit r/CryptoScamReport
     - Twitter com #CryptoScam

2. **Valide Projetos:**
   - Faça sua própria análise
   - Compartilhe findings no Discord/Telegram

3. **Eduque Outros:**
   - Ensine amigos a verificar contratos
   - Compartilhe este guia

### Recompensas:

Muitos projetos oferecem **Bug Bounties:**
- Encontre vulnerabilidade → Ganhe recompensa
- Exemplos: $1.000 - $100.000+ dependendo da gravidade

Plataformas:
- **Immunefi** (maior plataforma)
- **HackerOne**
- **Code4rena**

---

## Casos Reais de Auditoria Comunitária

### Caso 1: SafeMoon (2021)

**Community Found:**
- Função de taxa variável (owner pode mudar a qualquer momento)
- Liquidez não bloqueada
- Grandes holdings dos desenvolvedores

**Resultado:**
- Comunidade alertou investidores
- Projeto eventualmente perdeu 90% do valor
- Devs enfrentam processos judiciais (2024)

### Caso 2: Meerkat Finance (2021)

**Community Found:**
- Auditoria fake (empresa não existia)
- Código copiado de outro projeto
- Função de drenagem de fundos

**Resultado:**
- Alerta dado nas primeiras 24h
- Mesmo assim $31M roubados
- Mas evitou que mais pessoas investissem

---

## Conclusão

**Você não precisa ser um desenvolvedor para fazer verificações básicas.**

Com as ferramentas certas e conhecimento fundamental, a comunidade pode:
- ✅ Identificar 80% dos scams
- ✅ Pressionar projetos por mais transparência
- ✅ Proteger novos investidores

**"Don't Trust, Verify"** - Ethos cripto

---

**🔗 Próximos Passos:**
- [Aprenda Solidity Básico](#)
- [Entendendo Contratos ERC-20](#)
- [Bug Bounty: Como Começar](#)`,
    type: 'educational',
    category: 'seguranca',
    level: 'avancado',
    contentType: 'Tutorial',
    readTime: '25 min',
    warningLevel: 'warning',
    securityTips: JSON.stringify([
      {
        icon: '🔍',
        title: 'Sempre Verifique o Código',
        description: 'Contrato verificado no explorer é requisito mínimo.',
      },
      {
        icon: '🛡️',
        title: 'Use Múltiplas Ferramentas',
        description: 'Token Sniffer + RugDoc + Honeypot.is para análise completa.',
      },
      {
        icon: '📊',
        title: 'Confira Distribuição',
        description: 'Top holder com >50% é red flag gigante.',
      },
      {
        icon: '🔒',
        title: 'Liquidez Bloqueada é Essencial',
        description: 'Sem lock de liquidez? Sem investimento.',
      },
    ]),
    tags: JSON.stringify(['segurança', 'auditoria', 'smart-contracts', 'defi', 'verificação']),
    status: 'published',
    projectHighlight: false,
    relatedArticles: JSON.stringify(['fraudes-comuns-cripto-2024', 'protecao-digital-basica-cripto']),
  },
];
