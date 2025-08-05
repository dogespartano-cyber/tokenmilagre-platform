#!/usr/bin/env python3
"""
init_db.py
Script para inicialização e migração do banco de dados

Uso:
    python init_db.py                 # Inicializar BD e criar produto exemplo
    python init_db.py --reset         # Resetar BD completamente
    python init_db.py --populate      # Popular BD com dados de teste
    python init_db.py --migrate       # Executar migrações (se usando Flask-Migrate)
"""

import os
import sys
from datetime import datetime

# Adicionar diretório atual ao path para importar a API
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api import app, db, Product

def init_database():
    """Inicializa o banco de dados e cria as tabelas."""
    with app.app_context():
        print("🔄 Criando tabelas do banco de dados...")
        db.create_all()
        print("✅ Tabelas criadas com sucesso!")

def reset_database():
    """Remove e recria o banco de dados completamente."""
    with app.app_context():
        print("⚠️  Removendo todas as tabelas...")
        db.drop_all()
        print("🔄 Recriando tabelas...")
        db.create_all()
        print("✅ Banco de dados resetado com sucesso!")

def populate_database():
    """Popula o banco de dados com dados de exemplo."""
    with app.app_context():
        # Verificar se já existem produtos
        if Product.query.count() > 0:
            print("ℹ️  Banco de dados já contém produtos. Use --reset para limpar primeiro.")
            return
        
        # Dados de exemplo
        sample_products = [
            {
                "id": 1,
                "name": "Produto Exemplo",
                "value": 99.99,
                "tags": "exemplo,api,python"
            },
            {
                "id": 2,
                "name": "Smartphone Premium",
                "value": 1299.90,
                "tags": "tecnologia,smartphone,premium"
            },
            {
                "id": 3,
                "name": "Notebook Gamer",
                "value": 2499.00,
                "tags": "tecnologia,notebook,gamer,high-performance"
            },
            {
                "id": 4,
                "name": "Tênis Running",
                "value": 299.99,
                "tags": "esporte,calçado,running,fitness"
            },
            {
                "id": 5,
                "name": "Livro Python Avançado",
                "value": 89.90,
                "tags": "livro,programação,python,educação"
            },
            {
                "id": 6,
                "name": "Fone Bluetooth",
                "value": 199.99,
                "tags": "tecnologia,audio,bluetooth,wireless"
            },
            {
                "id": 7,
                "name": "Camiseta Algodão",
                "value": 49.90,
                "tags": "roupa,casual,algodão,básico"
            },
            {
                "id": 8,
                "name": "Monitor 4K",
                "value": 899.00,
                "tags": "tecnologia,monitor,4k,profissional"
            },
            {
                "id": 9,
                "name": "Cafeteira Elétrica",
                "value": 159.90,
                "tags": "casa,cozinha,café,elétrico"
            },
            {
                "id": 10,
                "name": "Mochila Executiva",
                "value": 199.00,
                "tags": "acessório,mochila,executivo,trabalho"
            }
        ]
        
        print("🔄 Inserindo produtos de exemplo...")
        
        for product_data in sample_products:
            product = Product(
                id=product_data["id"],
                name=product_data["name"],
                value=product_data["value"],
                tags=product_data["tags"]
            )
            db.session.add(product)
        
        db.session.commit()
        
        print(f"✅ {len(sample_products)} produtos inseridos com sucesso!")
        print("\n📊 Resumo dos produtos:")
        
        for product in Product.query.all():
            print(f"  - ID {product.id}: {product.name} (R$ {product.value:.2f})")

def show_database_stats():
    """Mostra estatísticas do banco de dados."""
    with app.app_context():
        total_products = Product.query.count()
        
        if total_products == 0:
            print("📊 Banco de dados vazio")
            return
        
        min_value = db.session.query(db.func.min(Product.value)).scalar()
        max_value = db.session.query(db.func.max(Product.value)).scalar()
        avg_value = db.session.query(db.func.avg(Product.value)).scalar()
        
        print(f"📊 Estatísticas do Banco de Dados:")
        print(f"  Total de produtos: {total_products}")
        print(f"  Valor mínimo: R$ {min_value:.2f}")
        print(f"  Valor máximo: R$ {max_value:.2f}")
        print(f"  Valor médio: R$ {avg_value:.2f}")
        
        # Mostrar alguns produtos
        print(f"\n📋 Primeiros 5 produtos:")
        for product in Product.query.limit(5).all():
            tags_display = ', '.join(product.tags_list[:3])
            if len(product.tags_list) > 3:
                tags_display += '...'
            print(f"  - {product.name} (R$ {product.value:.2f}) [{tags_display}]")

def test_search_functionality():
    """Testa funcionalidade de busca."""
    with app.app_context():
        print("🧪 Testando funcionalidade de busca...")
        
        # Teste 1: Busca por nome
        products = Product.query.filter(Product.name.ilike('%tecnologia%')).all()
        print(f"  - Produtos com 'tecnologia' no nome: {len(products)}")
        
        # Teste 2: Busca por faixa de valor
        products = Product.query.filter(Product.value.between(100, 500)).all()
        print(f"  - Produtos entre R$ 100-500: {len(products)}")
        
        # Teste 3: Busca por tags
        products = Product.query.filter(Product.tags.contains('python')).all()
        print(f"  - Produtos com tag 'python': {len(products)}")
        
        print("✅ Testes de busca concluídos!")

def main():
    """Função principal do script."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Gerenciador de Banco de Dados da API')
    parser.add_argument('--reset', action='store_true', help='Resetar banco de dados')
    parser.add_argument('--populate', action='store_true', help='Popular com dados de exemplo')
    parser.add_argument('--stats', action='store_true', help='Mostrar estatísticas')
    parser.add_argument('--test', action='store_true', help='Testar funcionalidades')
    
    args = parser.parse_args()
    
    print("🐍 Inicializador do Banco de Dados - API Flask")
    print("=" * 50)
    
    try:
        if args.reset:
            reset_database()
            populate_database()
        elif args.populate:
            init_database()
            populate_database()
        elif args.stats:
            show_database_stats()
        elif args.test:
            test_search_functionality()
        else:
            # Comportamento padrão: apenas inicializar
            init_database()
            
            # Se não há produtos, criar o exemplo básico
            with app.app_context():
                if Product.query.count() == 0:
                    example_product = Product(
                        id=1,
                        name="Produto Exemplo",
                        value=99.99,
                        tags="exemplo,api,python"
                    )
                    db.session.add(example_product)
                    db.session.commit()
                    print("✅ Produto de exemplo criado!")
        
        if not any([args.reset, args.populate, args.stats, args.test]):
            show_database_stats()
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
    
    print("\n🎉 Operação concluída com sucesso!")

if __name__ == '__main__':
    main()