@echo off
chcp 65001 > nul
echo 📋 Squad Only 로그를 확인합니다...

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
docker-compose logs -f application
goto :end

:db_logs
echo 🔍 데이터베이스 로그를 확인합니다...
docker-compose logs -f database
goto :end

:all_logs
echo 🔍 모든 서비스 로그를 확인합니다...
docker-compose logs -f
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
docker-compose logs -f application

:end
