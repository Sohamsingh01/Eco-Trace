@echo off
echo ==========================================================
echo Starting EcoTrace — Smart Household Carbon Tracker
echo ==========================================================
start "EcoTrace Backend" cmd /c "run_backend.bat"
start "EcoTrace Frontend" cmd /c "run_frontend.bat"
echo Services are launching:
echo  - Backend API: http://127.0.0.1:8000/docs
echo  - Frontend Web: http://127.0.0.1:5173
echo ==========================================================
