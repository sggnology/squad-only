@echo off
chcp 65001 > nul
echo 🔨 Squad Only를 로컬에서 빌드하고 실행합니다...

REM 필요한 디렉토리 생성
echo 📁 필요한 디렉토리를 생성합니다...
if not exist "postgres-data" mkdir postgres-data
if not exist "my-app-logs" mkdir my-app-logs
if not exist "uploads\temp" mkdir uploads\temp
if not exist "uploads\storage" mkdir uploads\storage

REM 애플리케이션 빌드
echo 🔨 애플리케이션을 빌드합니다...
gradlew.bat clean build -x test

if %ERRORLEVEL% equ 0 (
    echo ✅ 빌드가 성공했습니다!
    
    REM Docker 이미지 빌드
    echo 🐳 Docker 이미지를 빌드합니다...
    docker build -t squad-only:dev .
    
    if %ERRORLEVEL% equ 0 (
        echo ✅ Docker 이미지 빌드가 성공했습니다!
        
        REM docker-compose.yml을 개발용으로 임시 수정
        echo 🔧 개발용 설정으로 전환합니다...
        powershell -Command "(Get-Content docker-compose.yml) -replace 'ghcr.io/sggnology/squad-only:latest', 'squad-only:dev' | Set-Content docker-compose-dev.yml"
        
        REM 서비스 시작
        echo 🚀 서비스를 시작합니다...
        docker-compose -f docker-compose-dev.yml up -d
        
        REM 임시 파일 정리
        del docker-compose-dev.yml
        
        echo.
        echo ✅ 개발용 Squad Only가 시작되었습니다!
        echo 🌐 애플리케이션: http://localhost:8080
        echo 🗄️  데이터베이스: localhost:45432
        
    ) else (
        echo ❌ Docker 이미지 빌드에 실패했습니다.
        pause
        exit /b 1
    )
) else (
    echo ❌ 애플리케이션 빌드에 실패했습니다.
    pause
    exit /b 1
)
pause
