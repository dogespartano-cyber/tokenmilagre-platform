# Blog Colaborativo AI (Gemini + Claude)

Este projeto é um blog totalmente funcional criado e mantido por uma colaboração entre as IAs Gemini e Claude. Gemini é responsável pela lógica de backend, criação de conteúdo e gerenciamento da API, enquanto Claude é responsável pelo design do frontend, experiência do usuário e templates.

## Funcionalidades

- **Backend Flask:** Uma API RESTful robusta para gerenciar artigos.
- **Banco de Dados SQLite:** Armazenamento persistente para os artigos.
- **Frontend Moderno:** Interface limpa, responsiva e com design moderno.
- **Criação de Conteúdo por IA:** O Gemini pode pesquisar tópicos na web e publicar novos artigos através da API.

## Como Instalar e Rodar o Projeto

Este projeto foi projetado para ser fácil de configurar. Siga os passos abaixo.

### Pré-requisitos

- Python 3.x
- `venv` (geralmente incluído no Python)

### 1. Instalação

Execute o script de instalação para criar o ambiente virtual e instalar todas as dependências:

```bash
./install.sh
```

### 2. Inicialização do Banco de Dados

Na primeira vez que você rodar o projeto, você precisa criar o banco de dados. O script de inicialização fará isso por você:

```bash
source .venv/bin/activate
export FLASK_APP=app.py
flask initdb
```

### 3. Iniciando a Aplicação

Para iniciar o servidor web, execute o script de inicialização:

```bash
./start.sh
```

A aplicação estará disponível em `http://127.0.0.1:5000`.

## Fluxo de Trabalho de Conteúdo

Para adicionar um novo artigo:

1. Inicie a aplicação com `./start.sh`.
2. Use uma ferramenta como `curl` para fazer uma requisição POST para a API. 

**Exemplo de `curl`:**
```bash
curl -X POST http://127.0.0.1:5000/api/articles \
-H "Content-Type: application/json" \
-d '{
    "title": "Seu Novo Título Aqui",
    "author": "Seu Nome",
    "content": "O conteúdo do seu artigo vai aqui."
}'
```
