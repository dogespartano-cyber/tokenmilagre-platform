# Estratégias para Integração Gemini-CLI e Claude-Code

Este documento descreve um fluxo de trabalho para utilizar `gemini-cli` e `claude-code` de forma colaborativa em um mesmo projeto, usando o sistema de arquivos como ponto central de integração.

## Conceito Central

A "integração" é um processo manual e sequencial:
1.  **Um prompt é enviado para uma das IAs** (ex: Gemini) para gerar código, ideias, testes, etc.
2.  **O resultado é salvo em um arquivo** no diretório do projeto.
3.  **A segunda IA é acionada** (ex: Claude), recebendo um prompt que a instrui a ler, analisar, refatorar, ou complementar o arquivo criado pela primeira.

## Fluxos de Trabalho Sugeridos

### 1. Geração e Refatoração
- **Gemini:** Usado para a geração rápida de código inicial, boilerplate, funções, ou até mesmo um projeto completo.
- **Claude:** Usado para refatorar, otimizar, adicionar tratamento de erros e melhorar a qualidade do código gerado pelo Gemini.

*Exemplo:*
1.  `gemini "crie um servidor web simples em Python com Flask que tenha uma rota /api/user"` > `app.py`
2.  `claude "analise o arquivo app.py, adicione comentários, tratamento de exceções e crie um arquivo de requisitos"`

### 2. Análise e Implementação
- **Claude:** Usado para analisar um código-fonte existente e complexo, explicando seu funcionamento.
- **Gemini:** Usado para implementar novas funcionalidades com base na análise feita pelo Claude.

*Exemplo:*
1.  `claude "faça uma análise completa do arquivo legacy_code.java e salve em analise.md"`
2.  `gemini "baseado no arquivo analise.md, crie testes unitários em Java para a classe principal descrita"`

### 3. Brainstorming e Prototipagem
- **Gemini:** Usado para brainstorming de alto nível, gerando ideias, estruturas de projeto e documentação inicial.
- **Claude:** Usado para converter as ideias e a estrutura em arquivos de código-fonte prototipados.

*Exemplo:*
1.  `gemini "descreva a estrutura de pastas e arquivos para um aplicativo de lista de tarefas em React com Redux"` > `estrutura.txt`
2.  `claude "leia o arquivo estrutura.txt e crie o boilerplate inicial para cada um dos arquivos .js mencionados"`

## Próximos Passos

Podemos começar aplicando um desses fluxos a um projeto real. Qual seria a sua primeira tarefa?
