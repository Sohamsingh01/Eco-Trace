@echo off
echo ==========================================================
echo Starting EcoTrace — Smart Household Carbon Tracker
echo ==========================================================
start "EcoTrace Backend" cmd /c "%~dp0run_backend.bat"
start "EcoTrace Frontend" cmd /c "%~dp0run_frontend.bat"
echo Services are launching:
echo  - Backend API: http://127.0.0.1:8000/docs
echo  - Frontend Web: http://localhost:5173
echo ==========================================================
