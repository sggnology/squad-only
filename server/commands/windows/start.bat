@echo off
chcp 65001 > nul
echo 🚀 Squad Only Docker 환경을 시작합니다...

REM 필요한 디렉토리 생성
echo 📁 필요한 디렉토리를 생성합니다...
if not exist "postgres-data" mkdir postgres-data
if not exist "my-app-logs" mkdir my-app-logs
if not exist "uploads\temp" mkdir uploads\temp
if not exist "uploads\storage" mkdir uploads\storage

REM Docker Compose로 서비스 시작
echo 🐳 Docker 컨테이너를 시작합니다...
docker-compose up -d

REM 서비스 시작 대기
echo ⏳ 서비스 시작을 기다립니다...
timeout /t 5 /nobreak > nul

REM 서비스 상태 확인
echo 📊 서비스 상태를 확인합니다...
docker-compose ps

echo.
echo ✅ Squad Only가 성공적으로 시작되었습니다!
echo 🌐 애플리케이션: http://localhost:8080
echo 🗄️  데이터베이스: localhost:45432
echo.
echo 로그 확인: logs.bat
echo 서비스 중지: stop.bat
pause
