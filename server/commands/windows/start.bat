@echo off
chcp 65001 > nul
echo 🚀 Squad Only Docker 환경을 시작합니다...

REM Docker Compose 명령어 확인
set DOCKER_COMPOSE_CMD=
where docker-compose >nul 2>nul
if %errorlevel% equ 0 (
    set DOCKER_COMPOSE_CMD=docker-compose
) else (
    where docker >nul 2>nul
    if %errorlevel% equ 0 (
        docker compose version >nul 2>nul
        if %errorlevel% equ 0 (
            set DOCKER_COMPOSE_CMD=docker compose
        )
    )
)

if not defined DOCKER_COMPOSE_CMD (
    echo ERROR: 'docker-compose' or 'docker compose' command not found.
    echo        Please install Docker Compose or check your PATH environment variable.
    exit /b 1
)
echo INFO: Using: %DOCKER_COMPOSE_CMD%

REM Docker Compose 파일 복사 (필요한 경우)
if not exist "docker-compose.yml" (
    echo 📋 docker-compose.yml 파일을 복사합니다...
    if exist "..\..\docker-compose.yml" (
        copy "..\..\docker-compose.yml" "docker-compose.yml" > nul
        echo ✅ docker-compose.yml 파일이 복사되었습니다.
    ) else (
        echo ❌ docker-compose.yml 파일을 찾을 수 없습니다.
        echo    서버 루트 디렉토리에서 실행하거나 docker-compose.yml이 있는지 확인하세요.
        pause
        exit /b 1
    )
)

REM 포트 설정
set DEFAULT_APP_PORT=8080
set /p APP_PORT="Enter application port (default: %DEFAULT_APP_PORT%): "
if not defined APP_PORT set APP_PORT=%DEFAULT_APP_PORT%

echo docker-compose.yml 파일 포트 %APP_PORT% 로 수정...
REM PowerShell 스크립트 파일을 실행하여 포트 변경
powershell -NoProfile -ExecutionPolicy Bypass -File ".\update_port.ps1" -AppPort %APP_PORT%

if %errorlevel% neq 0 (
    echo ERROR: Failed to change port in docker-compose.yml.
    pause
    exit /b 1
)

REM 필요한 디렉토리 생성
echo 📁 필요한 디렉토리를 생성합니다...
if not exist "postgres-data" mkdir postgres-data
if not exist "my-app-logs" mkdir my-app-logs
if not exist "uploads\temp" mkdir uploads\temp
if not exist "uploads\storage" mkdir uploads\storage

REM Docker Compose로 서비스 시작
echo 🐳 Docker 컨테이너를 시작합니다...
%DOCKER_COMPOSE_CMD% up -d

REM 서비스 시작 대기 (cmd 버그로 특정 영역에서 한글 주석 불가...)
REM echo 서비스 상태를 확인합니다...
timeout /t 3 /nobreak > nul

REM 서비스 상태 확인
echo 📊 서비스 상태를 확인합니다...
%DOCKER_COMPOSE_CMD% ps

echo.
echo ✅ Squad Only가 성공적으로 시작되었습니다!
echo 🌐 애플리케이션: http://localhost:%APP_PORT%
echo 🗄️  데이터베이스: localhost:45432
echo.
echo 로그 확인: logs.bat
echo 서비스 중지: stop.bat
pause
