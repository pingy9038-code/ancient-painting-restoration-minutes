@echo off
echo ========================================
echo 古建彩画修复色谱纪要系统 - 启动脚本
echo ========================================
echo.

echo [1/2] 启动后端服务...
start "后端服务" cmd /k "cd /d %~dp0 && pip install -r requirements.txt && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端应用...
start "前端应用" cmd /k "cd /d %~dp0 && npm install && npm start"

echo.
echo 服务启动中...
echo 后端 API: http://localhost:8000
echo 前端界面: http://localhost:3000
echo.
pause
