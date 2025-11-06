@echo off
echo Starting BrainBoost Application...
echo.

echo Starting MongoDB (make sure MongoDB is installed)...
start "MongoDB" cmd /k "mongod"

timeout /t 3

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo All servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause