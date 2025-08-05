# features-avancadas.md
# Passo 5: Sugestões de Features Avançadas (Gemini)

Com a API containerizada e uma base sólida, o próximo passo é evoluir de um armazenamento em memória para uma solução persistente e adicionar capacidades de busca mais ricas. Isso transformará a API em uma aplicação mais realista.

## 1. Integração com Banco de Dados (SQLite)

**Descrição:** Substituir o dicionário em memória `products_db` por um banco de dados SQLite. SQLite é ideal por ser baseado em arquivo, não exigindo um servidor de banco de dados separado e integrando-se perfeitamente ao nosso ambiente Docker.

**Requisitos:**
- **Biblioteca:** Adicionar `Flask-SQLAlchemy` ao `requirements.txt` para uma integração mais fácil e segura.
- **Modelo de Dados:** Criar um modelo `Product` em SQLAlchemy que espelhe a estrutura do nosso `ProductSchema` do Marshmallow.
- **Inicialização:** Criar uma função, talvez acionada por um comando de CLI do Flask (`flask db init`, `flask db migrate`, `flask db upgrade`), para criar o arquivo do banco de dados (`database.db`) e a tabela de produtos na primeira execução.
- **Adaptação dos Endpoints:** Modificar todas as rotas (GET, POST, PUT, PATCH, DELETE) para que, em vez de manipularem o dicionário em memória, realizem operações de CRUD no banco de dados usando sessões do SQLAlchemy.
- **Persistência no Docker:** O `docker-compose.yml` deve ser ajustado para montar um volume que persista o arquivo `database.db` fora do container, para que os dados não sejam perdidos quando o container for reiniciado.

## 2. Endpoint de Busca Avançada (GET /api/products/search)

**Descrição:** Criar um novo endpoint que permita aos usuários buscar produtos com base em múltiplos critérios usando query parameters na URL.

**Requisitos:**
- **Query Parameters:** O endpoint deve aceitar os seguintes parâmetros de busca (todos opcionais):
    - `name`: Busca por produtos cujo nome contenha o valor fornecido (busca parcial, case-insensitive).
    - `min_value`: Busca por produtos com valor maior ou igual ao fornecido.
    - `max_value`: Busca por produtos com valor menor ou igual ao fornecido.
    - `tags`: Busca por produtos que contenham *todas* as tags fornecidas (separadas por vírgula).
- **Lógica de Filtragem:** A lógica de busca deve ser implementada no SQLAlchemy, construindo a query dinamicamente com base nos parâmetros recebidos.
- **Paginação:** O endpoint deve suportar paginação para lidar com grandes volumes de resultados.
    - `page`: O número da página a ser retornada (padrão: 1).
    - `per_page`: O número de itens por página (padrão: 10).
- **Resposta:** A resposta deve ser um JSON contendo não apenas a lista de produtos, mas também metadados sobre a paginação (página atual, total de páginas, total de itens).

**Exemplo de Requisição:**
```http
GET /api/products/search?name=prod&min_value=50&tags=exemplo,api&page=1&per_page=5
```

**Resposta Sugerida:**
```json
{
  "pagination": {
    "page": 1,
    "per_page": 5,
    "total_pages": 3,
    "total_items": 14
  },
  "products": [
    { "id": 1, "name": "Produto Exemplo", ... },
    { "id": 8, "name": "Super Produto", ... }
  ]
}
```
