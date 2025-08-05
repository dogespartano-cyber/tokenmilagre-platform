"""
test_api.py
Testes unitários abrangentes para api.py com SQLAlchemy

Executar testes:
    python -m pytest test_api.py -v
    python -m pytest test_api.py::TestAPI::test_get_data -v  # teste específico
"""

import pytest
import json
import os
import tempfile
from api import app, db, Product
from datetime import datetime

# Configuração de teste global
@pytest.fixture(scope='session')
def test_app():
    """Fixture de aplicação para testes."""
    # Criar banco de dados temporário para testes
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + app.config['DATABASE']
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()
    
    os.close(db_fd)
    os.unlink(app.config['DATABASE'])

@pytest.fixture
def client(test_app):
    """Fixture para cliente de teste Flask."""
    return test_app.test_client()

@pytest.fixture
def sample_product():
    """Fixture com produto de exemplo."""
    return {
        "id": 999,
        "name": "Produto Teste",
        "value": 299.99,
        "tags": ["teste", "unittest", "python"]
    }

class TestAPI:
    """Classe de testes para API Flask com SQLAlchemy."""
    
    def test_home_endpoint(self, client):
        """Testa o endpoint raiz da API."""
        response = client.get('/')
        
        assert response.status_code == 200
        response_text = response.data.decode()
        assert 'API avançada com SQLAlchemy' in response_text
        assert 'GET /api/data' in response_text
        assert 'POST /api/data' in response_text
        assert 'GET /api/products/search' in response_text
    
    def test_get_data_empty_database(self, client):
        """Testa GET quando banco está vazio."""
        response = client.get('/api/data')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'não encontrado' in data['error']
    
    def test_post_data_success(self, client, sample_product):
        """Testa criação bem-sucedida de produto."""
        response = client.post(
            '/api/data',
            data=json.dumps(sample_product),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        
        assert data['status'] == 'success'
        assert data['message'] == 'Produto criado com sucesso'
        assert data['data']['id'] == sample_product['id']
        assert data['data']['name'] == sample_product['name']
        assert data['data']['value'] == sample_product['value']
        assert data['data']['tags'] == sample_product['tags']
        assert 'created_at' in data['data']
        assert 'updated_at' in data['data']
    
    def test_get_data_success(self, client, sample_product):
        """Testa recuperação bem-sucedida após criação."""
        # Primeiro criar produto com ID 1
        product_data = sample_product.copy()
        product_data['id'] = 1
        
        client.post(
            '/api/data',
            data=json.dumps(product_data),
            content_type='application/json'
        )
        
        # Agora testar GET
        response = client.get('/api/data')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['status'] == 'success'
        assert data['data']['id'] == 1
        assert data['data']['name'] == product_data['name']
    
    def test_post_data_duplicate_id(self, client, sample_product):
        """Testa criação com ID duplicado."""
        # Criar primeiro produto
        client.post(
            '/api/data',
            data=json.dumps(sample_product),
            content_type='application/json'
        )
        
        # Tentar criar produto com mesmo ID
        response = client.post(
            '/api/data',
            data=json.dumps(sample_product),
            content_type='application/json'
        )
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'já existe' in data['error']
    
    def test_post_data_invalid_json(self, client):
        """Testa POST sem JSON válido."""
        response = client.post(
            '/api/data',
            data='dados inválidos',
            content_type='application/json'
        )
        
        assert response.status_code == 400
    
    def test_post_data_validation_errors(self, client):
        """Testa validação com dados inválidos."""
        invalid_data = {
            "id": -1,  # ID inválido
            "name": "",  # Nome vazio
            "value": -50.0,  # Valor negativo
            "tags": ["teste"]
        }
        
        response = client.post(
            '/api/data',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'

class TestSearchEndpoint:
    """Testes para o endpoint de busca avançada."""
    
    @pytest.fixture(autouse=True)
    def setup_products(self, client):
        """Setup com produtos para testes de busca."""
        products = [
            {"id": 1, "name": "Smartphone Premium", "value": 1299.90, "tags": ["tecnologia", "smartphone", "premium"]},
            {"id": 2, "name": "Notebook Gamer", "value": 2499.00, "tags": ["tecnologia", "notebook", "gamer"]},
            {"id": 3, "name": "Tênis Running", "value": 299.99, "tags": ["esporte", "calçado", "running"]},
            {"id": 4, "name": "Livro Python", "value": 89.90, "tags": ["livro", "programação", "python"]},
            {"id": 5, "name": "Fone Bluetooth", "value": 199.99, "tags": ["tecnologia", "audio", "bluetooth"]},
        ]
        
        for product in products:
            client.post(
                '/api/data',
                data=json.dumps(product),
                content_type='application/json'
            )
    
    def test_search_no_filters(self, client):
        """Testa busca sem filtros (todos os produtos)."""
        response = client.get('/api/products/search')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['status'] == 'success'
        assert 'pagination' in data
        assert 'products' in data
        assert data['pagination']['total_items'] == 5
        assert len(data['products']) == 5
    
    def test_search_by_name(self, client):
        """Testa busca por nome."""
        response = client.get('/api/products/search?name=notebook')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert len(data['products']) == 1
        assert 'notebook' in data['products'][0]['name'].lower()
        assert data['filters_applied']['name'] == 'notebook'
    
    def test_search_by_value_range(self, client):
        """Testa busca por faixa de valor."""
        response = client.get('/api/products/search?min_value=200&max_value=1500')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        for product in data['products']:
            assert 200 <= product['value'] <= 1500
        
        assert data['filters_applied']['min_value'] == 200
        assert data['filters_applied']['max_value'] == 1500
    
    def test_search_by_tags(self, client):
        """Testa busca por tags."""
        response = client.get('/api/products/search?tags=tecnologia')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        for product in data['products']:
            assert 'tecnologia' in product['tags']
        
        assert data['filters_applied']['tags'] == ['tecnologia']
    
    def test_search_pagination(self, client):
        """Testa paginação."""
        response = client.get('/api/products/search?per_page=2&page=1')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['pagination']['per_page'] == 2
        assert data['pagination']['page'] == 1
        assert len(data['products']) == 2
        assert data['pagination']['total_items'] == 5
        assert data['pagination']['total_pages'] == 3
    
    def test_search_combined_filters(self, client):
        """Testa busca com múltiplos filtros."""
        response = client.get('/api/products/search?name=fone&tags=tecnologia&max_value=300')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert len(data['products']) == 1
        product = data['products'][0]
        assert 'fone' in product['name'].lower()
        assert 'tecnologia' in product['tags']
        assert product['value'] <= 300
    
    def test_search_invalid_parameters(self, client):
        """Testa busca com parâmetros inválidos."""
        response = client.get('/api/products/search?page=0&per_page=200')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'

class TestCRUDOperations:
    """Testes para operações CRUD completas."""
    
    def test_full_crud_workflow(self, client):
        """Testa fluxo completo CRUD."""
        # CREATE
        product_data = {
            "id": 100,
            "name": "Produto CRUD",
            "value": 500.00,
            "tags": ["crud", "teste"]
        }
        
        create_response = client.post(
            '/api/data',
            data=json.dumps(product_data),
            content_type='application/json'
        )
        assert create_response.status_code == 201
        
        # UPDATE (PUT)
        updated_data = product_data.copy()
        updated_data['name'] = "Produto CRUD Atualizado"
        updated_data['value'] = 600.00
        
        put_response = client.put(
            '/api/data/100',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        assert put_response.status_code == 200
        
        put_data = json.loads(put_response.data)
        assert put_data['data']['name'] == "Produto CRUD Atualizado"
        assert put_data['data']['value'] == 600.00
        
        # UPDATE (PATCH)
        patch_data = {"value": 700.00}
        
        patch_response = client.patch(
            '/api/data/100',
            data=json.dumps(patch_data),
            content_type='application/json'
        )
        assert patch_response.status_code == 200
        
        patch_result = json.loads(patch_response.data)
        assert patch_result['data']['value'] == 700.00
        assert patch_result['data']['name'] == "Produto CRUD Atualizado"  # Mantido
        assert 'value' in patch_result['updated_fields']
        
        # DELETE
        delete_response = client.delete('/api/data/100')
        assert delete_response.status_code == 200
        
        delete_data = json.loads(delete_response.data)
        assert 'deletado com sucesso' in delete_data['message']
        
        # Verificar que foi deletado
        verify_response = client.put(
            '/api/data/100',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        assert verify_response.status_code == 404
    
    def test_put_product_not_found(self, client):
        """Testa PUT em produto inexistente."""
        product_data = {
            "id": 999,
            "name": "Produto Inexistente",
            "value": 100.00,
            "tags": ["teste"]
        }
        
        response = client.put(
            '/api/data/999',
            data=json.dumps(product_data),
            content_type='application/json'
        )
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
    
    def test_patch_product_not_found(self, client):
        """Testa PATCH em produto inexistente."""
        response = client.patch(
            '/api/data/999',
            data=json.dumps({"value": 100.00}),
            content_type='application/json'
        )
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
    
    def test_delete_product_not_found(self, client):
        """Testa DELETE em produto inexistente."""
        response = client.delete('/api/data/999')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'

class TestDatabasePersistence:
    """Testes específicos para persistência do banco de dados."""
    
    def test_product_timestamps(self, client, sample_product):
        """Testa se timestamps são criados corretamente."""
        response = client.post(
            '/api/data',
            data=json.dumps(sample_product),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        
        assert 'created_at' in data['data']
        assert 'updated_at' in data['data']
        assert data['data']['created_at'] is not None
        assert data['data']['updated_at'] is not None
    
    def test_product_update_timestamp(self, client, sample_product):
        """Testa se updated_at é atualizado no PATCH."""
        # Criar produto
        client.post(
            '/api/data',
            data=json.dumps(sample_product),
            content_type='application/json'
        )
        
        # Fazer PATCH
        patch_response = client.patch(
            f'/api/data/{sample_product["id"]}',
            data=json.dumps({"value": 999.99}),
            content_type='application/json'
        )
        
        assert patch_response.status_code == 200
        data = json.loads(patch_response.data)
        
        # updated_at deve ser diferente de created_at
        assert data['data']['updated_at'] != data['data']['created_at']
    
    def test_tags_conversion(self, client):
        """Testa conversão de tags entre lista e string."""
        product_data = {
            "id": 200,
            "name": "Produto Tags",
            "value": 100.00,
            "tags": ["tag1", "tag2", "tag3"]
        }
        
        response = client.post(
            '/api/data',
            data=json.dumps(product_data),
            content_type='application/json'
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        
        # Tags devem ser retornadas como lista
        assert isinstance(data['data']['tags'], list)
        assert data['data']['tags'] == ["tag1", "tag2", "tag3"]

class TestErrorHandling:
    """Testes para tratamento de erros."""
    
    def test_404_handler(self, client):
        """Testa handler de erro 404."""
        response = client.get('/endpoint/inexistente')
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'não encontrado' in data['error']
    
    def test_method_not_allowed(self, client):
        """Testa método HTTP não permitido."""
        response = client.options('/api/data/1')
        
        # Flask retorna 405 para métodos não implementados
        assert response.status_code == 405
    
    def test_validation_error_handling(self, client):
        """Testa tratamento de erros de validação."""
        invalid_data = {
            "id": "not_a_number",
            "name": "",
            "value": "not_a_number"
        }
        
        response = client.post(
            '/api/data',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['status'] == 'error'
        assert 'messages' in data

if __name__ == '__main__':
    # Executar testes diretamente
    pytest.main([__file__, '-v'])