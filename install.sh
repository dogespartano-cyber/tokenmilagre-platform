#!/bin/bash
# install.sh

echo "Criando ambiente virtual..."
python3 -m venv .venv

echo "Ativando ambiente e instalando dependências..."
source .venv/bin/activate
pip install -r requirements.txt

echo "Instalação concluída. Para iniciar o banco de dados, execute:"
echo "source .venv/bin/activate && export FLASK_APP=app.py && flask initdb"
