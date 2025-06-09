@echo off
chcp 65001 > nul
echo 🧹 Squad Only Docker 환경을 완전히 정리합니다...

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

REM Docker Compose 파일 확인
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

echo.
echo ⚠️  경고: 이 작업은 모든 데이터를 삭제합니다!
echo    - PostgreSQL 데이터베이스
echo    - 업로드된 파일들
echo    - 로그 파일들
echo.

REM 확인 메시지
set /p confirm="정말로 모든 데이터를 삭제하시겠습니까? (yes/no): "
echo.

if /i "%confirm%"=="yes" (
    REM 컨테이너 중지 및 제거
    echo 🛑 컨테이너를 중지하고 제거합니다...
    %DOCKER_COMPOSE_CMD% -p squad-only down -v --remove-orphans

    REM 이미지 제거 (선택사항)
    set /p remove_images="Docker 이미지도 제거하시겠습니까? (y/n): "
    if /i "%remove_images%"=="y" (
        echo 🗑️  Docker 이미지를 제거합니다...
        %DOCKER_COMPOSE_CMD% -p squad-only down --rmi all
    )
    
    REM 데이터 디렉토리 제거
    echo 🗑️  데이터 디렉토리를 제거합니다...
    if exist "postgres-data" rmdir /s /q postgres-data
    if exist "my-app-logs" rmdir /s /q my-app-logs
    if exist "uploads" rmdir /s /q uploads
    
    REM Docker 시스템 정리 (선택사항)
    set /p clean_system="Docker 시스템 캐시도 정리하시겠습니까? (y/n): "
    if /i "%clean_system%"=="y" (
        echo 🧹 Docker 시스템을 정리합니다...
        docker system prune -f
    )
    
    echo.
    echo ✅ 정리가 완료되었습니다!
    echo 🚀 새로 시작하려면: start.bat
) else (
    echo ❌ 정리가 취소되었습니다.
)
pause
