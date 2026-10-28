@echo off
echo Starting EcoTrace Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0backend"
py -m uvicorn app.main:app --port 8000 --reload || python -m uvicorn app.main:app --port 8000 --reload
