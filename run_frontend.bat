@echo off
echo Starting EcoTrace Frontend on http://127.0.0.1:5173 ...
cd frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
pause
