#!/bin/bash
# start.sh

echo "Iniciando a aplicação Flask..."
source .venv/bin/activate
export FLASK_APP=app.py
flask run
