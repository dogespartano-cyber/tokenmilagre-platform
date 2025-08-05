# app.py
# Backend para o site de artigos (API + Frontend Routes)
# Fase 1: Adaptado por Gemini

import os
from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields, ValidationError
from datetime import datetime
import logging
from slugify import slugify

# --- Configuração ---
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_SORT_KEYS'] = False

db = SQLAlchemy(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Modelos de Banco de Dados (SQLAlchemy) ---
class Article(db.Model):
    """Modelo para os artigos."""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, unique=True)
    slug = db.Column(db.String(200), nullable=False, unique=True)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False, default="Gemini")
    publication_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, title, content, author="Gemini"):
        self.title = title
        self.content = content
        self.author = author
        self.slug = slugify(title)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "author": self.author,
            "publication_date": self.publication_date.isoformat()
        }

# --- Schemas de Validação (Marshmallow) ---
class ArticleSchema(Schema):
    """Schema para validação de dados de artigo."""
    title = fields.String(required=True)
    content = fields.String(required=True)
    author = fields.String(missing="Gemini")

article_schema = ArticleSchema()
articles_schema = ArticleSchema(many=True)

# --- Handlers de Erro ---
@app.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify({'error': 'Dados inválidos', 'messages': error.messages}), 400

@app.errorhandler(404)
def handle_not_found(error):
    return render_template('404.html'), 404 # O Claude precisará criar este template

# --- Rotas da API ---
@app.route('/api/articles', methods=['GET'])
def get_articles():
    """Retorna uma lista de todos os artigos."""
    articles = Article.query.order_by(Article.publication_date.desc()).all()
    return jsonify([article.to_dict() for article in articles])

@app.route('/api/articles/<string:slug>', methods=['GET'])
def get_article(slug):
    """Retorna um artigo específico."""
    article = Article.query.filter_by(slug=slug).first_or_404()
    return jsonify(article.to_dict())

@app.route('/api/articles', methods=['POST'])
def add_article():
    """Adiciona um novo artigo."""
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'Nenhum dado de entrada fornecido'}), 400
    
    try:
        data = article_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    if Article.query.filter_by(title=data['title']).first():
        return jsonify({'error': 'Um artigo com este título já existe'}), 409

    new_article = Article(
        title=data['title'],
        content=data['content'],
        author=data['author']
    )
    db.session.add(new_article)
    db.session.commit()
    
    logger.info(f"Novo artigo criado: '{new_article.title}'")
    return jsonify(new_article.to_dict()), 201

# --- Rotas do Frontend ---
@app.route('/')
def home():
    """Renderiza a página inicial com a lista de artigos."""
    logger.info("Acessando a página inicial.")
    articles = Article.query.order_by(Article.publication_date.desc()).all()
    return render_template('index.html', articles=articles)

@app.route('/<string:slug>')
def post_page(slug):
    """Renderiza a página de um artigo específico."""
    logger.info(f"Acessando o artigo: {slug}")
    article = Article.query.filter_by(slug=slug).first_or_404()
    return render_template('post.html', article=article)

# --- Comandos de CLI ---
@app.cli.command('initdb')
def initdb_command():
    """Cria as tabelas do banco de dados."""
    db.create_all()
    logger.info('Banco de dados inicializado.')

if __name__ == '__main__':
    app.run(debug=True)
