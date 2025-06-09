#!/bin/bash

# Squad Only Docker 재시작 스크립트
echo "🔄 Squad Only Docker 환경을 재시작합니다..."

# Docker Compose 명령어 확인
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ 'docker-compose' 또는 'docker compose' 명령을 찾을 수 없습니다."
    echo "   Docker Compose를 설치하거나 PATH 환경 변수를 확인하세요."
    exit 1
fi
echo "ℹ️  Using: $DOCKER_COMPOSE_CMD"

# Docker Compose 파일 복사 (필요한 경우)
if [ ! -f "docker-compose.yml" ]; then
    echo "📋 docker-compose.yml 파일을 복사합니다..."
    if [ -f "../../docker-compose.yml" ]; then
        cp "../../docker-compose.yml" "docker-compose.yml"
        echo "✅ docker-compose.yml 파일이 복사되었습니다."
    else
        echo "❌ docker-compose.yml 파일을 찾을 수 없습니다."
        echo "   스크립트를 서버 루트 디렉토리의 commands/linux 에서 실행하거나, 서버 루트에 docker-compose.yml 파일이 있는지 확인하세요."
        exit 1
    fi
fi

# Docker 이미지 새로 받기
echo "📥 최신 Docker 이미지를 가져옵니다..."
$DOCKER_COMPOSE_CMD -p squad-only pull

# Docker Compose로 서비스 재시작 (기존 컨테이너 강제 재생성)
echo "🐳 Docker 컨테이너를 재시작합니다..."
$DOCKER_COMPOSE_CMD -p squad-only up -d --force-recreate

# 서비스 상태 확인
echo "⏳ 서비스 시작을 기다립니다..."
sleep 3

echo "📊 서비스 상태를 확인합니다..."
$DOCKER_COMPOSE_CMD -p squad-only ps

echo ""
echo "✅ Squad Only가 성공적으로 재시작되었습니다!"
echo ""
echo "로그 확인: ./logs.sh"
echo "서비스 중지: ./stop.sh"

