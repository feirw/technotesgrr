#!/bin/bash
# Local backend bootstrap: venv, dependencies, data load, then the API server.

python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 database.py
python3 data_loader.py
python3 server.py

# rm leaderboard.db