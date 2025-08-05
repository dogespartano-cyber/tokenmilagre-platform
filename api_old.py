# api.py
# API Flask com validação, testes e documentação completa
# Passo 1: Gerado pelo Gemini
# Passo 2: Refinado pelo Claude

from flask import Flask, jsonify, request
from marshmallow import Schema, fields, ValidationError
import logging
from typing import Dict, Any, Tuple

# Configuração da aplicação Flask
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Armazenamento em memória para produtos (simulação de banco de dados)
products_db = {
    1: {
        "id": 1,
        "name": "Produto Exemplo",
        "value": 99.99,
        "tags": ["exemplo", "api", "python"]
    }
}

# Contador para IDs únicos
next_product_id = 2

# Schemas de validação usando Marshmallow
class ProductSchema(Schema):
    """Schema para validação de dados de produto."""
    id = fields.Integer(required=True, validate=lambda x: x > 0)
    name = fields.String(required=True, validate=lambda x: len(x.strip()) > 0)
    value = fields.Float(required=True, validate=lambda x: x >= 0)
    tags = fields.List(fields.String(), missing=[])

product_schema = ProductSchema()

# Handlers de erro globais
@app.errorhandler(ValidationError)
def handle_validation_error(error: ValidationError) -> Tuple[Dict[str, Any], int]:
    """Manipula erros de validação do Marshmallow.
    
    Args:
        error: Erro de validação capturado
        
    Returns:
        Tuple contendo resposta JSON e código HTTP 400
    """
    logger.warning(f"Erro de validação: {error.messages}")
    return jsonify({
        'error': 'Dados inválidos',
        'messages': error.messages,
        'status': 'error'
    }), 400

@app.errorhandler(404)
def handle_not_found(error) -> Tuple[Dict[str, Any], int]:
    """Manipula erros 404 - recurso não encontrado.
    
    Args:
        error: Erro HTTP 404
        
    Returns:
        Tuple contendo resposta JSON e código HTTP 404
    """
    return jsonify({
        'error': 'Recurso não encontrado',
        'message': 'O endpoint solicitado não existe',
        'status': 'error'
    }), 404

@app.errorhandler(500)
def handle_internal_error(error) -> Tuple[Dict[str, Any], int]:
    """Manipula erros internos do servidor.
    
    Args:
        error: Erro interno do servidor
        
    Returns:
        Tuple contendo resposta JSON e código HTTP 500
    """
    logger.error(f"Erro interno: {error}")
    return jsonify({
        'error': 'Erro interno do servidor',
        'message': 'Ocorreu um erro inesperado',
        'status': 'error'
    }), 500

@app.route('/')
def home() -> str:
    """Endpoint raiz da API.
    
    Fornece informações básicas sobre a API e endpoints disponíveis.
    
    Returns:
        str: Mensagem de boas-vindas com informações da API
        
    Example:
        GET /
        
        Response:
        "API básica está no ar. Endpoints disponíveis: GET /api/data, POST /api/data"
    """
    logger.info("Acesso ao endpoint raiz")
    return "API básica está no ar. Endpoints disponíveis: GET /api/data, POST /api/data"

@app.route('/api/data', methods=['GET'])
def get_data() -> Tuple[Dict[str, Any], int]:
    """Retorna dados de produto de exemplo.
    
    Endpoint para recuperar dados de produto com validação e logging.
    
    Returns:
        Tuple[Dict[str, Any], int]: Dados do produto e código HTTP 200
        
    Example:
        GET /api/data
        
        Response:
        {
            "data": {
                "id": 1,
                "name": "Produto Exemplo",
                "value": 99.99,
                "tags": ["exemplo", "api", "python"]
            },
            "status": "success"
        }
    """
    try:
        logger.info("Solicitação GET para /api/data")
        
        # Buscar produto com ID 1 no banco de dados em memória
        product_data = products_db.get(1)
        
        if not product_data:
            logger.error("Produto padrão (ID=1) não encontrado no banco de dados")
            return jsonify({
                "error": "Produto não encontrado",
                "status": "error"
            }), 404
        
        # Validar dados antes de retornar (garantia de qualidade)
        validated_data = product_schema.load(product_data)
        
        response = {
            "data": validated_data,
            "status": "success"
        }
        
        logger.info("Dados retornados com sucesso")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Erro ao recuperar dados: {e}")
        return jsonify({
            "error": "Erro ao recuperar dados",
            "status": "error"
        }), 500

@app.route('/api/data', methods=['POST'])
def create_data() -> Tuple[Dict[str, Any], int]:
    """Cria um novo produto com validação de dados.
    
    Endpoint para criar produtos com validação completa de entrada.
    
    Returns:
        Tuple[Dict[str, Any], int]: Produto criado e código HTTP 201, ou erro
        
    Example:
        POST /api/data
        Content-Type: application/json
        
        {
            "id": 2,
            "name": "Novo Produto",
            "value": 150.00,
            "tags": ["novo", "produto"]
        }
        
        Response:
        {
            "data": {
                "id": 2,
                "name": "Novo Produto",
                "value": 150.00,
                "tags": ["novo", "produto"]
            },
            "message": "Produto criado com sucesso",
            "status": "success"
        }
    """
    try:
        logger.info("Solicitação POST para /api/data")
        
        # Verificar se o conteúdo é JSON
        if not request.is_json:
            logger.warning("Tentativa de POST sem JSON")
            return jsonify({
                "error": "Content-Type deve ser application/json",
                "status": "error"
            }), 400
        
        # Obter dados da requisição
        json_data = request.get_json()
        
        if not json_data:
            logger.warning("POST com JSON vazio")
            return jsonify({
                "error": "Dados JSON são obrigatórios",
                "status": "error"
            }), 400
        
        # Validar dados usando schema
        validated_data = product_schema.load(json_data)
        
        # Verificar se produto com este ID já existe
        if validated_data['id'] in products_db:
            logger.warning(f"Tentativa de criar produto com ID existente: {validated_data['id']}")
            return jsonify({
                "error": f"Produto com ID {validated_data['id']} já existe",
                "message": "Use PUT para atualizar ou escolha outro ID",
                "status": "error"
            }), 409
        
        # Salvar produto no banco de dados em memória
        products_db[validated_data['id']] = validated_data.copy()
        logger.info(f"Produto criado: {validated_data['name']} (ID: {validated_data['id']})")
        
        response = {
            "data": validated_data,
            "message": "Produto criado com sucesso",
            "status": "success"
        }
        
        return jsonify(response), 201
        
    except ValidationError as e:
        # Este erro é automaticamente capturado pelo handler global
        raise e
    except Exception as e:
        logger.error(f"Erro ao criar produto: {e}")
        return jsonify({
            "error": "Erro interno ao criar produto",
            "status": "error"
        }), 500


@app.route('/api/data/<int:product_id>', methods=['PUT'])
def update_product(product_id: int) -> Tuple[Dict[str, Any], int]:
    """Atualiza completamente um produto específico (substituição completa).
    
    Endpoint para atualização completa de um produto identificado pelo ID.
    O ID na URL deve corresponder ao ID no corpo da requisição.
    
    Args:
        product_id: ID do produto a ser atualizado
        
    Returns:
        Tuple[Dict[str, Any], int]: Produto atualizado e código HTTP, ou erro
        
    Example:
        PUT /api/data/1
        Content-Type: application/json
        
        {
            "id": 1,
            "name": "Produto Atualizado",
            "value": 150.00,
            "tags": ["atualizado", "novo"]
        }
        
        Response:
        {
            "data": {
                "id": 1,
                "name": "Produto Atualizado",
                "value": 150.00,
                "tags": ["atualizado", "novo"]
            },
            "message": "Produto atualizado com sucesso",
            "status": "success"
        }
    """
    try:
        logger.info(f"Solicitação PUT para /api/data/{product_id}")
        
        # Verificar se o produto existe
        if product_id not in products_db:
            logger.warning(f"Tentativa de atualizar produto inexistente: {product_id}")
            return jsonify({
                "error": f"Produto com ID {product_id} não encontrado",
                "status": "error"
            }), 404
        
        # Verificar se o conteúdo é JSON
        if not request.is_json:
            logger.warning("Tentativa de PUT sem JSON")
            return jsonify({
                "error": "Content-Type deve ser application/json",
                "status": "error"
            }), 400
        
        # Obter dados da requisição
        json_data = request.get_json()
        
        if not json_data:
            logger.warning("PUT com JSON vazio")
            return jsonify({
                "error": "Dados JSON são obrigatórios",
                "status": "error"
            }), 400
        
        # Validar dados usando schema
        validated_data = product_schema.load(json_data)
        
        # Verificar se o ID na URL corresponde ao ID no corpo
        if validated_data['id'] != product_id:
            logger.warning(f"ID inconsistente: URL={product_id}, Corpo={validated_data['id']}")
            return jsonify({
                "error": "ID na URL deve corresponder ao ID no corpo da requisição",
                "status": "error"
            }), 400
        
        # Atualizar produto no banco de dados
        products_db[product_id] = validated_data.copy()
        logger.info(f"Produto atualizado: {validated_data['name']} (ID: {product_id})")
        
        response = {
            "data": validated_data,
            "message": "Produto atualizado com sucesso",
            "status": "success"
        }
        
        return jsonify(response), 200
        
    except ValidationError as e:
        # Este erro é automaticamente capturado pelo handler global
        raise e
    except Exception as e:
        logger.error(f"Erro ao atualizar produto: {e}")
        return jsonify({
            "error": "Erro interno ao atualizar produto",
            "status": "error"
        }), 500


@app.route('/api/data/<int:product_id>', methods=['PATCH'])
def partial_update_product(product_id: int) -> Tuple[Dict[str, Any], int]:
    """Atualiza parcialmente um produto específico.
    
    Endpoint para atualização parcial de um produto. Apenas os campos
    fornecidos serão atualizados, mantendo os demais valores existentes.
    
    Args:
        product_id: ID do produto a ser atualizado parcialmente
        
    Returns:
        Tuple[Dict[str, Any], int]: Produto atualizado e código HTTP, ou erro
        
    Example:
        PATCH /api/data/1
        Content-Type: application/json
        
        {
            "value": 200.00,
            "tags": ["promoção", "desconto"]
        }
        
        Response:
        {
            "data": {
                "id": 1,
                "name": "Produto Exemplo",  // mantido
                "value": 200.00,           // atualizado
                "tags": ["promoção", "desconto"]  // atualizado
            },
            "message": "Produto atualizado parcialmente com sucesso",
            "status": "success"
        }
    """
    try:
        logger.info(f"Solicitação PATCH para /api/data/{product_id}")
        
        # Verificar se o produto existe
        if product_id not in products_db:
            logger.warning(f"Tentativa de atualizar produto inexistente: {product_id}")
            return jsonify({
                "error": f"Produto com ID {product_id} não encontrado",
                "status": "error"
            }), 404
        
        # Verificar se o conteúdo é JSON
        if not request.is_json:
            logger.warning("Tentativa de PATCH sem JSON")
            return jsonify({
                "error": "Content-Type deve ser application/json",
                "status": "error"
            }), 400
        
        # Obter dados da requisição
        json_data = request.get_json()
        
        if not json_data:
            logger.warning("PATCH com JSON vazio")
            return jsonify({
                "error": "Dados JSON são obrigatórios para atualização",
                "status": "error"
            }), 400
        
        # Se ID for fornecido no corpo, deve corresponder ao da URL
        if 'id' in json_data and json_data['id'] != product_id:
            logger.warning(f"ID inconsistente em PATCH: URL={product_id}, Corpo={json_data['id']}")
            return jsonify({
                "error": "ID fornecido deve corresponder ao ID na URL",
                "status": "error"
            }), 400
        
        # Validar dados parciais usando schema
        validated_data = product_schema.load(json_data, partial=True)
        
        # Obter produto existente e aplicar atualizações
        existing_product = products_db[product_id].copy()
        
        # Atualizar apenas os campos fornecidos
        for field, value in validated_data.items():
            existing_product[field] = value
        
        # Salvar produto atualizado
        products_db[product_id] = existing_product
        
        updated_fields = list(validated_data.keys())
        logger.info(f"Produto {product_id} atualizado parcialmente. Campos: {updated_fields}")
        
        response = {
            "data": existing_product,
            "message": "Produto atualizado parcialmente com sucesso",
            "updated_fields": updated_fields,
            "status": "success"
        }
        
        return jsonify(response), 200
        
    except ValidationError as e:
        # Este erro é automaticamente capturado pelo handler global
        raise e
    except Exception as e:
        logger.error(f"Erro ao atualizar produto parcialmente: {e}")
        return jsonify({
            "error": "Erro interno ao atualizar produto",
            "status": "error"
        }), 500


@app.route('/api/data/<int:product_id>', methods=['DELETE'])
def delete_product(product_id: int) -> Tuple[Dict[str, Any], int]:
    """Remove um produto específico do sistema.
    
    Endpoint para remoção permanente de um produto identificado pelo ID.
    
    Args:
        product_id: ID do produto a ser removido
        
    Returns:
        Tuple[Dict[str, Any], int]: Mensagem de confirmação e código HTTP, ou erro
        
    Example:
        DELETE /api/data/1
        
        Response:
        {
            "message": "Produto com ID 1 foi deletado com sucesso",
            "deleted_product": {
                "id": 1,
                "name": "Produto Exemplo",
                "value": 99.99,
                "tags": ["exemplo", "api", "python"]
            },
            "status": "success"
        }
    """
    try:
        logger.info(f"Solicitação DELETE para /api/data/{product_id}")
        
        # Verificar se o produto existe
        if product_id not in products_db:
            logger.warning(f"Tentativa de deletar produto inexistente: {product_id}")
            return jsonify({
                "error": f"Produto com ID {product_id} não encontrado",
                "status": "error"
            }), 404
        
        # Obter dados do produto antes de deletar (para log e resposta)
        deleted_product = products_db[product_id].copy()
        
        # Remover produto do banco de dados
        del products_db[product_id]
        
        logger.info(f"Produto deletado: {deleted_product['name']} (ID: {product_id})")
        
        response = {
            "message": f"Produto com ID {product_id} foi deletado com sucesso",
            "deleted_product": deleted_product,
            "status": "success"
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Erro ao deletar produto: {e}")
        return jsonify({
            "error": "Erro interno ao deletar produto",
            "status": "error"
        }), 500


if __name__ == '__main__':
    # Configuração para execução em desenvolvimento
    # Para executar: python api.py
    # A API estará disponível em http://127.0.0.1:5000
    
    logger.info("Iniciando API Flask em modo de desenvolvimento")
    logger.info("Endpoints disponíveis:")
    logger.info("  GET    / - Informações da API")
    logger.info("  GET    /api/data - Recuperar dados de produto")
    logger.info("  POST   /api/data - Criar novo produto")
    logger.info("  PUT    /api/data/<id> - Atualizar produto completo")
    logger.info("  PATCH  /api/data/<id> - Atualizar produto parcial")
    logger.info("  DELETE /api/data/<id> - Deletar produto")
    
    app.run(
        debug=True,
        host='127.0.0.1',
        port=5000
    )
