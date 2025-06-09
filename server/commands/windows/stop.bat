@echo off
chcp 65001 > nul
echo 🛑 Squad Only Docker 환경을 중지합니다...

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

REM Docker Compose 파일 확인 (복사 로직은 stop에서는 불필요할 수 있으나, 일관성을 위해 추가)
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

REM 컨테이너 중지 및 제거
echo 🐳 Docker 컨테이너를 중지합니다...
%DOCKER_COMPOSE_CMD% down

REM 상태 확인
echo 📊 서비스 상태를 확인합니다...
docker-compose ps

echo.
echo ✅ Squad Only가 성공적으로 중지되었습니다!
echo.
echo 데이터는 보존됩니다:
echo   - PostgreSQL 데이터: .\postgres-data\
echo   - 업로드 파일: .\uploads\
echo   - 로그 파일: .\my-app-logs\
echo.
echo 완전 정리 (데이터 삭제): clean.bat
echo 다시 시작: start.bat
pause
