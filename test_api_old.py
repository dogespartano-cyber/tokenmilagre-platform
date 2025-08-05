"""
test_api.py
Testes unitários abrangentes para api.py

Executar testes:
    python -m pytest test_api.py -v
    python -m pytest test_api.py::TestAPI::test_get_data -v  # teste específico
"""

import pytest
import json
from api import app, product_schema
from marshmallow import ValidationError


class TestAPI:
    """Classe de testes para API Flask."""
    
    @pytest.fixture
    def client(self):
        """Fixture para cliente de teste Flask.
        
        Returns:
            FlaskClient: Cliente de teste configurado
        """
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    @pytest.fixture
    def valid_product_data(self):
        """Fixture com dados válidos de produto.
        
        Returns:
            dict: Dados de produto válidos para testes
        """
        return {
            "id": 123,
            "name": "Produto Teste",
            "value": 299.99,
            "tags": ["teste", "unittest", "python"]
        }
    
    @pytest.fixture
    def invalid_product_data(self):
        """Fixture com dados inválidos de produto.
        
        Returns:
            list: Lista de casos de dados inválidos
        """
        return [
            # ID inválido (negativo)
            {
                "id": -1,
                "name": "Produto Teste",
                "value": 100.0,
                "tags": ["teste"]
            },
            # Nome vazio
            {
                "id": 1,
                "name": "",
                "value": 100.0,
                "tags": ["teste"]
            },
            # Valor negativo
            {
                "id": 1,
                "name": "Produto Teste",
                "value": -50.0,
                "tags": ["teste"]
            },
            # Campos obrigatórios ausentes
            {
                "name": "Produto Teste",
                "value": 100.0
            }
        ]
    
    def test_home_endpoint(self, client):
        """Testa o endpoint raiz da API.
        
        Args:
            client: Cliente de teste Flask
        """
        response = client.get('/')
        
        assert response.status_code == 200
        assert 'API básica está no ar' in response.data.decode()
        assert 'GET /api/data' in response.data.decode()
        assert 'POST /api/data' in response.data.decode()
    
    def test_get_data_success(self, client):
        """Testa recuperação bem-sucedida de dados.
        
        Args:
            client: Cliente de teste Flask
        """
        response = client.get('/api/data')
        
        assert response.status_code == 200
        assert response.content_type == 'application/json'
        
        data = json.loads(response.data)
        
        # Verificar estrutura da resposta
        assert 'data' in data
        assert 'status' in data
        assert data['status'] == 'success'
        
        # Verificar dados do produto
        product_data = data['data']
        assert product_data['id'] == 1
        assert product_data['name'] == 'Produto Exemplo'
        assert product_data['value'] == 99.99
        assert isinstance(product_data['tags'], list)
        assert 'exemplo' in product_data['tags']
    
    def test_post_data_success(self, client, valid_product_data):
        """Testa criação bem-sucedida de produto.
        
        Args:
            client: Cliente de teste Flask
            valid_product_data: Dados válidos de produto
        """
        response = client.post(
            '/api/data',
            data=json.dumps(valid_product_data),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        assert response.content_type == 'application/json'
        
        data = json.loads(response.data)
        
        # Verificar estrutura da resposta
        assert 'data' in data
        assert 'message' in data
        assert 'status' in data
        assert data['status'] == 'success'
        assert data['message'] == 'Produto criado com sucesso'
        
        # Verificar dados retornados
        returned_product = data['data']
        assert returned_product == valid_product_data
    
    def test_post_data_invalid_json(self, client):
        """Testa POST com JSON inválido.
        
        Args:
            client: Cliente de teste Flask
        """
        response = client.post(
            '/api/data',
            data='dados inválidos',
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
    
    def test_post_data_no_content_type(self, client, valid_product_data):
        """Testa POST sem Content-Type correto.
        
        Args:
            client: Cliente de teste Flask
            valid_product_data: Dados válidos de produto
        """
        response = client.post(
            '/api/data',
            data=json.dumps(valid_product_data),
            content_type='text/plain'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'Content-Type deve ser application/json' in data['error']
    
    def test_post_data_empty_json(self, client):
        """Testa POST com JSON vazio.
        
        Args:
            client: Cliente de teste Flask
        """
        response = client.post(
            '/api/data',
            data=json.dumps({}),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
    
    @pytest.mark.parametrize("invalid_data", [
        {"id": -1, "name": "Teste", "value": 100.0},  # ID negativo
        {"id": 1, "name": "", "value": 100.0},        # Nome vazio
        {"id": 1, "name": "Teste", "value": -50.0},   # Valor negativo
        {"name": "Teste", "value": 100.0}             # ID ausente
    ])
    def test_post_data_validation_errors(self, client, invalid_data):
        """Testa validação com dados inválidos.
        
        Args:
            client: Cliente de teste Flask
            invalid_data: Dados inválidos para teste
        """
        response = client.post(
            '/api/data',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'error' in data
        assert 'messages' in data
    
    def test_404_handler(self, client):
        """Testa manipulador de erro 404.
        
        Args:
            client: Cliente de teste Flask
        """
        response = client.get('/endpoint/inexistente')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'Recurso não encontrado' in data['error']
    
    def test_method_not_allowed(self, client):
        """Testa método HTTP não permitido.
        
        Args:
            client: Cliente de teste Flask
        """
        response = client.put('/api/data')
        
        assert response.status_code == 405


class TestProductSchema:
    """Testes para o schema de validação ProductSchema."""
    
    def test_valid_product_schema(self):
        """Testa validação com dados válidos."""
        valid_data = {
            "id": 1,
            "name": "Produto Teste",
            "value": 99.99,
            "tags": ["teste", "python"]
        }
        
        result = product_schema.load(valid_data)
        assert result == valid_data
    
    def test_product_schema_missing_tags(self):
        """Testa schema com tags ausentes (devem ser lista vazia)."""
        data = {
            "id": 1,
            "name": "Produto Teste",
            "value": 99.99
        }
        
        result = product_schema.load(data)
        assert result['tags'] == []
    
    def test_product_schema_invalid_id(self):
        """Testa validação com ID inválido."""
        invalid_data = {
            "id": 0,  # ID deve ser > 0
            "name": "Produto Teste",
            "value": 99.99
        }
        
        with pytest.raises(ValidationError) as exc_info:
            product_schema.load(invalid_data)
        
        assert 'id' in exc_info.value.messages
    
    def test_product_schema_invalid_name(self):
        """Testa validação com nome inválido."""
        invalid_data = {
            "id": 1,
            "name": "   ",  # Nome apenas com espaços
            "value": 99.99
        }
        
        with pytest.raises(ValidationError) as exc_info:
            product_schema.load(invalid_data)
        
        assert 'name' in exc_info.value.messages
    
    def test_product_schema_invalid_value(self):
        """Testa validação com valor inválido."""
        invalid_data = {
            "id": 1,
            "name": "Produto Teste",
            "value": -10.0  # Valor deve ser >= 0
        }
        
        with pytest.raises(ValidationError) as exc_info:
            product_schema.load(invalid_data)
        
        assert 'value' in exc_info.value.messages


class TestIntegration:
    """Testes de integração da API."""
    
    @pytest.fixture
    def client(self):
        """Fixture para cliente de teste Flask."""
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    def test_full_workflow(self, client):
        """Testa fluxo completo: GET inicial, POST novo produto.
        
        Args:
            client: Cliente de teste Flask
        """
        # 1. Verificar dados iniciais
        response = client.get('/api/data')
        assert response.status_code == 200
        initial_data = json.loads(response.data)
        assert initial_data['data']['id'] == 1
        
        # 2. Criar novo produto
        new_product = {
            "id": 999,
            "name": "Produto Integração",
            "value": 1500.00,
            "tags": ["integração", "teste"]
        }
        
        response = client.post(
            '/api/data',
            data=json.dumps(new_product),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        created_data = json.loads(response.data)
        assert created_data['data']['id'] == 999
        assert created_data['data']['name'] == 'Produto Integração'
    
    def test_error_handling_chain(self, client):
        """Testa cadeia de tratamento de erros.
        
        Args:
            client: Cliente de teste Flask
        """
        # Teste sequencial de diferentes tipos de erro
        
        # 1. Endpoint inexistente (404)
        response = client.get('/api/inexistente')
        assert response.status_code == 404
        
        # 2. Método não permitido (405)
        response = client.delete('/api/data')
        assert response.status_code == 405
        
        # 3. Dados inválidos (400)
        response = client.post(
            '/api/data',
            data=json.dumps({"id": -1, "name": "", "value": -10}),
            content_type='application/json'
        )
        assert response.status_code == 400


class TestNewEndpoints:
    """Testes para os novos endpoints PUT, PATCH e DELETE."""
    
    @pytest.fixture
    def client(self):
        """Fixture para cliente de teste Flask."""
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client
    
    @pytest.fixture
    def setup_test_product(self, client):
        """Fixture que cria um produto para testes."""
        test_product = {
            "id": 999,
            "name": "Produto Teste",
            "value": 150.00,
            "tags": ["teste", "fixture"]
        }
        
        # Criar produto para testes
        client.post(
            '/api/data',
            data=json.dumps(test_product),
            content_type='application/json'
        )
        
        return test_product

    # === Testes PUT ===
    
    def test_put_product_success(self, client, setup_test_product):
        """Testa atualização completa bem-sucedida de produto."""
        updated_data = {
            "id": 999,
            "name": "Produto Atualizado PUT",
            "value": 250.00,
            "tags": ["atualizado", "put", "teste"]
        }
        
        response = client.put(
            '/api/data/999',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['status'] == 'success'
        assert data['message'] == 'Produto atualizado com sucesso'
        assert data['data']['name'] == 'Produto Atualizado PUT'
        assert data['data']['value'] == 250.00
    
    def test_put_product_not_found(self, client):
        """Testa PUT em produto inexistente."""
        updated_data = {
            "id": 99999,
            "name": "Produto Inexistente",
            "value": 100.00,
            "tags": ["teste"]
        }
        
        response = client.put(
            '/api/data/99999',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'não encontrado' in data['error']
    
    def test_put_product_id_mismatch(self, client, setup_test_product):
        """Testa PUT com ID inconsistente entre URL e corpo."""
        updated_data = {
            "id": 888,  # ID diferente da URL
            "name": "Produto Inconsistente",
            "value": 100.00,
            "tags": ["teste"]
        }
        
        response = client.put(
            '/api/data/999',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'corresponder' in data['error']
    
    def test_put_product_invalid_data(self, client, setup_test_product):
        """Testa PUT com dados inválidos."""
        invalid_data = {
            "id": 999,
            "name": "",  # Nome vazio
            "value": -50.0,  # Valor negativo
            "tags": ["teste"]
        }
        
        response = client.put(
            '/api/data/999',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'

    # === Testes PATCH ===
    
    def test_patch_product_success(self, client, setup_test_product):
        """Testa atualização parcial bem-sucedida de produto."""
        partial_data = {
            "value": 300.00,
            "tags": ["promoção", "desconto"]
        }
        
        response = client.patch(
            '/api/data/999',
            data=json.dumps(partial_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['status'] == 'success'
        assert data['message'] == 'Produto atualizado parcialmente com sucesso'
        assert data['data']['id'] == 999
        assert data['data']['name'] == 'Produto Teste'  # Mantido
        assert data['data']['value'] == 300.00  # Atualizado
        assert data['data']['tags'] == ['promoção', 'desconto']  # Atualizado
        assert 'updated_fields' in data
        assert set(data['updated_fields']) == {'value', 'tags'}
    
    def test_patch_product_single_field(self, client, setup_test_product):
        """Testa PATCH atualizando apenas um campo."""
        partial_data = {"name": "Nome Atualizado PATCH"}
        
        response = client.patch(
            '/api/data/999',
            data=json.dumps(partial_data),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['data']['name'] == 'Nome Atualizado PATCH'
        assert data['data']['value'] == 150.00  # Mantido
        assert data['updated_fields'] == ['name']
    
    def test_patch_product_not_found(self, client):
        """Testa PATCH em produto inexistente."""
        partial_data = {"value": 100.00}
        
        response = client.patch(
            '/api/data/99999',
            data=json.dumps(partial_data),
            content_type='application/json'
        )
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
    
    def test_patch_product_with_id_mismatch(self, client, setup_test_product):
        """Testa PATCH com ID inconsistente."""
        partial_data = {
            "id": 888,  # ID diferente da URL
            "value": 200.00
        }
        
        response = client.patch(
            '/api/data/999',
            data=json.dumps(partial_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
    
    def test_patch_product_invalid_partial_data(self, client, setup_test_product):
        """Testa PATCH com dados parciais inválidos."""
        invalid_partial = {"value": -100.0}  # Valor negativo
        
        response = client.patch(
            '/api/data/999',
            data=json.dumps(invalid_partial),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'

    # === Testes DELETE ===
    
    def test_delete_product_success(self, client, setup_test_product):
        """Testa remoção bem-sucedida de produto."""
        response = client.delete('/api/data/999')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['status'] == 'success'
        assert 'deletado com sucesso' in data['message']
        assert 'deleted_product' in data
        assert data['deleted_product']['id'] == 999
        assert data['deleted_product']['name'] == 'Produto Teste'
        
        # Verificar se produto foi realmente removido
        get_response = client.get('/api/data')
        # O produto padrão (ID=1) deve ainda existir, mas o 999 não
        
        # Tentar acessar produto deletado deve retornar 404
        check_response = client.put(
            '/api/data/999',
            data=json.dumps({"id": 999, "name": "teste", "value": 1.0}),
            content_type='application/json'
        )
        assert check_response.status_code == 404
    
    def test_delete_product_not_found(self, client):
        """Testa DELETE em produto inexistente."""
        response = client.delete('/api/data/99999')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'não encontrado' in data['error']
    
    def test_delete_product_twice(self, client, setup_test_product):
        """Testa DELETE no mesmo produto duas vezes."""
        # Primeira deleção - deve funcionar
        response1 = client.delete('/api/data/999')
        assert response1.status_code == 200
        
        # Segunda deleção - deve retornar 404
        response2 = client.delete('/api/data/999')
        assert response2.status_code == 404
        data = json.loads(response2.data)
        assert data['status'] == 'error'

    # === Testes de Integração para Novos Endpoints ===
    
    def test_crud_workflow(self, client):
        """Testa fluxo completo CRUD com novos endpoints."""
        # 1. CREATE - Criar produto
        new_product = {
            "id": 1001,
            "name": "Produto CRUD",
            "value": 100.00,
            "tags": ["crud", "teste"]
        }
        
        create_response = client.post(
            '/api/data',
            data=json.dumps(new_product),
            content_type='application/json'
        )
        assert create_response.status_code == 201
        
        # 2. READ - Não implementamos GET por ID, mas vamos testar que existe
        # Vamos tentar atualizar para verificar que existe
        
        # 3. UPDATE (PUT) - Atualização completa
        updated_product = {
            "id": 1001,
            "name": "Produto CRUD Atualizado",
            "value": 200.00,
            "tags": ["crud", "atualizado", "put"]
        }
        
        put_response = client.put(
            '/api/data/1001',
            data=json.dumps(updated_product),
            content_type='application/json'
        )
        assert put_response.status_code == 200
        put_data = json.loads(put_response.data)
        assert put_data['data']['name'] == 'Produto CRUD Atualizado'
        
        # 4. UPDATE (PATCH) - Atualização parcial
        patch_data = {"value": 250.00}
        
        patch_response = client.patch(
            '/api/data/1001',
            data=json.dumps(patch_data),
            content_type='application/json'
        )
        assert patch_response.status_code == 200
        patch_data_response = json.loads(patch_response.data)
        assert patch_data_response['data']['value'] == 250.00
        assert patch_data_response['data']['name'] == 'Produto CRUD Atualizado'  # Mantido
        
        # 5. DELETE - Remoção
        delete_response = client.delete('/api/data/1001')
        assert delete_response.status_code == 200
        
        # 6. Verificar que foi deletado
        verify_delete = client.delete('/api/data/1001')
        assert verify_delete.status_code == 404

    def test_edge_cases_new_endpoints(self, client):
        """Testa casos extremos nos novos endpoints."""
        # Teste com valores limite
        edge_product = {
            "id": 9999,
            "name": "A" * 100,  # Nome longo
            "value": 0.01,      # Valor mínimo
            "tags": []          # Tags vazias
        }
        
        # Criar produto com dados extremos
        create_response = client.post(
            '/api/data',
            data=json.dumps(edge_product),
            content_type='application/json'
        )
        assert create_response.status_code == 201
        
        # PATCH com mudança mínima
        minimal_patch = {"value": 0.02}
        patch_response = client.patch(
            '/api/data/9999',
            data=json.dumps(minimal_patch),
            content_type='application/json'
        )
        assert patch_response.status_code == 200
        
        # DELETE do produto extremo
        delete_response = client.delete('/api/data/9999')
        assert delete_response.status_code == 200


if __name__ == '__main__':
    # Executar testes diretamente
    pytest.main([__file__, '-v'])