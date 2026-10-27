@echo off
echo Starting EcoTrace Backend on http://127.0.0.1:8000 ...
cd backend
python -m uvicorn app.main:app --port 8000 --reload
pause
