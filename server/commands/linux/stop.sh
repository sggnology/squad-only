#!/bin/bash

# Squad Only Docker 중지 스크립트
echo "🛑 Squad Only Docker 환경을 중지합니다..."

# Docker Compose 파일 확인
if [ ! -f "docker-compose.yml" ]; then
    echo "📋 docker-compose.yml 파일을 복사합니다..."
    if [ -f "../../docker-compose.yml" ]; then
        cp "../../docker-compose.yml" "docker-compose.yml"
        echo "✅ docker-compose.yml 파일이 복사되었습니다."
    else
        echo "❌ docker-compose.yml 파일을 찾을 수 없습니다."
        echo "   서버 루트 디렉토리에서 실행하거나 docker-compose.yml이 있는지 확인하세요."
        exit 1
    fi
fi

# 컨테이너 중지 및 제거
echo "🐳 Docker 컨테이너를 중지합니다..."
docker-compose down

# 상태 확인
echo "📊 서비스 상태를 확인합니다..."
docker-compose ps

echo ""
echo "✅ Squad Only가 성공적으로 중지되었습니다!"
echo ""
echo "데이터는 보존됩니다:"
echo "  - PostgreSQL 데이터: ./postgres-data/"
echo "  - 업로드 파일: ./uploads/"
echo "  - 로그 파일: ./my-app-logs/"
echo ""
echo "완전 정리 (데이터 삭제): ./clean.sh"
echo "다시 시작: ./start.sh"
