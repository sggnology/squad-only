#!/bin/bash

# Squad Only Docker 시작 스크립트
echo "🚀 Squad Only Docker 환경을 시작합니다..."

# 필요한 디렉토리 생성 및 권한 설정
echo "📁 필요한 디렉토리를 생성합니다..."
mkdir -p ./postgres-data
mkdir -p ./my-app-logs
mkdir -p ./uploads/temp
mkdir -p ./uploads/storage

# 권한 설정 (UID/GID 1500으로 설정)
echo "🔐 디렉토리 권한을 설정합니다..."
if [ "$(id -u)" = "0" ]; then
    # root 사용자인 경우
    chown -R 1500:1500 ./my-app-logs
    chown -R 1500:1500 ./uploads
    chmod -R 755 ./my-app-logs
    chmod -R 755 ./uploads
else
    # 일반 사용자인 경우 - sudo 사용
    if command -v sudo >/dev/null 2>&1; then
        echo "관리자 권한이 필요합니다..."
        sudo chown -R 1500:1500 ./my-app-logs
        sudo chown -R 1500:1500 ./uploads
        sudo chmod -R 755 ./my-app-logs
        sudo chmod -R 755 ./uploads
    else
        echo "⚠️  sudo를 사용할 수 없습니다. 권한 설정을 건너뜁니다."
        echo "    Docker 컨테이너 내에서 권한이 자동으로 설정됩니다."
    fi
fi

# Docker Compose로 서비스 시작
echo "🐳 Docker 컨테이너를 시작합니다..."
docker-compose up -d

# 서비스 상태 확인
echo "⏳ 서비스 시작을 기다립니다..."
sleep 5

echo "📊 서비스 상태를 확인합니다..."
docker-compose ps

echo ""
echo "✅ Squad Only가 성공적으로 시작되었습니다!"
echo "🌐 애플리케이션: http://localhost:8080"
echo "🗄️  데이터베이스: localhost:45432"
echo ""
echo "로그 확인: ./logs.sh"
echo "서비스 중지: ./stop.sh"
