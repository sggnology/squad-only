@echo off
chcp 65001 > nul
echo 📋 Squad Only 로그를 확인합니다...

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

REM Docker Compose 파일 확인 (복사 로직은 logs에서는 불필요할 수 있으나, 일관성을 위해 추가)
if not exist ".\docker-compose.yml" (
    echo Copying docker-compose.yml file...
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

REM 파라미터 확인
if "%1"=="app" goto :app_logs
if "%1"=="application" goto :app_logs
if "%1"=="db" goto :db_logs
if "%1"=="database" goto :db_logs
if "%1"=="all" goto :all_logs
if "%1"=="file" goto :file_logs
goto :help

:app_logs
echo 🔍 애플리케이션 로그를 확인합니다...
%DOCKER_COMPOSE_CMD% -p squad-only logs -f application
goto :end

:db_logs
echo 🔍 데이터베이스 로그를 확인합니다...
%DOCKER_COMPOSE_CMD% -p squad-only logs -f database
goto :end

:all_logs
echo 🔍 모든 서비스 로그를 확인합니다...
%DOCKER_COMPOSE_CMD% -p squad-only logs -f
goto :end

:file_logs
echo 🔍 파일 시스템 로그를 확인합니다...
echo.
echo === 애플리케이션 로그 파일 ===
if exist "my-app-logs\application.log" (
    powershell -Command "Get-Content -Path '.\my-app-logs\application.log' -Tail 50"
) else (
    echo 로그 파일이 없습니다.
)
echo.
echo === 에러 로그 파일 ===
if exist "my-app-logs\error.log" (
    powershell -Command "Get-Content -Path '.\my-app-logs\error.log' -Tail 20"
) else (
    echo 에러 로그 파일이 없습니다.
)
pause
goto :end

:help
echo 🔍 실시간 로그 옵션:
echo.
echo 사용법: logs.bat [옵션]
echo.
echo 옵션:
echo   app, application  - 애플리케이션 로그만 표시
echo   db, database      - 데이터베이스 로그만 표시
echo   all              - 모든 서비스 로그 표시
echo   file             - 파일 시스템 로그 표시
echo.
echo 기본값 (옵션 없음): 애플리케이션 로그 표시
echo.
echo 🔍 애플리케이션 로그를 확인합니다...
%DOCKER_COMPOSE_CMD% -p squad-only logs -f application

:end
