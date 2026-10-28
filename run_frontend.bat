@echo off
echo Starting EcoTrace Frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
npm.cmd run dev -- --host 0.0.0.0 --port 5173
