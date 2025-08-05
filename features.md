# features.md
# Passo 3: Sugestões de Features (Gemini)

Com base na API robusta criada e refinada, aqui estão 3 sugestões de novos endpoints para expandir a funcionalidade, mantendo os padrões de qualidade estabelecidos (validação, tratamento de erros, etc.).

## 1. Endpoint para Atualização de Produto (PUT /api/data/<int:product_id>)

**Descrição:** Permite a atualização completa de um produto existente, identificado pelo seu ID. Utiliza o método PUT para substituir o recurso.

**Lógica:**
- Recebe o `product_id` na URL.
- Recebe os novos dados do produto no corpo da requisição (JSON).
- Valida os novos dados usando o `ProductSchema` (o ID no corpo do JSON deve ser o mesmo do URL).
- Simula a busca do produto no "banco de dados" (pode ser um dicionário em memória para este exemplo).
- Se o produto não for encontrado, retorna um erro 404.
- Se encontrado, atualiza os dados e retorna o produto atualizado com status 200.

**Exemplo de Requisição:**
```http
PUT /api/data/1
Content-Type: application/json

{
    "id": 1,
    "name": "Produto Exemplo Atualizado",
    "value": 109.99,
    "tags": ["exemplo", "api", "python", "atualizado"]
}
```

## 2. Endpoint para Atualização Parcial de Produto (PATCH /api/data/<int:product_id>)

**Descrição:** Permite a atualização parcial de um produto. O cliente envia apenas os campos que deseja alterar.

**Lógica:**
- Similar ao PUT, mas mais flexível.
- O `ProductSchema` deve ser configurado para aceitar dados parciais (`partial=True`) durante a validação.
- Simula a busca do produto.
- Se encontrado, itera sobre os dados recebidos e atualiza apenas os campos correspondentes no produto existente.
- Retorna o produto completo e atualizado com status 200.

**Exemplo de Requisição (atualizando apenas o valor e as tags):**
```http
PATCH /api/data/1
Content-Type: application/json

{
    "value": 115.50,
    "tags": ["promoção"]
}
```

## 3. Endpoint para Deletar um Produto (DELETE /api/data/<int:product_id>)

**Descrição:** Remove um produto do sistema.

**Lógica:**
- Recebe o `product_id` na URL.
- Simula a busca do produto.
- Se não encontrado, retorna 404.
- Se encontrado, simula a remoção do produto.
- Retorna uma mensagem de sucesso com status 200 ou 204 (No Content).

**Exemplo de Requisição:**
```http
DELETE /api/data/1
```

**Resposta Sugerida (200):**
```json
{
    "status": "success",
    "message": "Produto com ID 1 foi deletado com sucesso."
}
```
