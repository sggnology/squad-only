#!/bin/bash

# Squad Only 완전 정리 스크립트
echo "🧹 Squad Only Docker 환경을 완전히 정리합니다..."

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

echo ""
echo "⚠️  경고: 이 작업은 모든 데이터를 삭제합니다!"
echo "   - PostgreSQL 데이터베이스"
echo "   - 업로드된 파일들"
echo "   - 로그 파일들"
echo ""

# 확인 메시지
read -p "정말로 모든 데이터를 삭제하시겠습니까? (yes/no): " -r
echo ""

if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    # 컨테이너 중지 및 제거
    echo "🛑 컨테이너를 중지하고 제거합니다..."
    docker-compose down -v --remove-orphans
    
    # 이미지 제거 (선택사항)
    read -p "Docker 이미지도 제거하시겠습니까? (y/n): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Docker 이미지를 제거합니다..."
        docker-compose down --rmi all
    fi
    
    # 데이터 디렉토리 제거
    echo "🗑️  데이터 디렉토리를 제거합니다..."
    if [ "$(id -u)" = "0" ]; then
        # root 사용자인 경우
        rm -rf ./postgres-data
        rm -rf ./my-app-logs
        rm -rf ./uploads
    else
        # 일반 사용자인 경우 - sudo 사용
        if command -v sudo >/dev/null 2>&1; then
            echo "관리자 권한이 필요합니다..."
            sudo rm -rf ./postgres-data
            sudo rm -rf ./my-app-logs
            sudo rm -rf ./uploads
        else
            echo "⚠️  sudo를 사용할 수 없습니다. 수동으로 디렉토리를 삭제해주세요:"
            echo "    rm -rf ./postgres-data ./my-app-logs ./uploads"
        fi
    fi
    
    # Docker 시스템 정리 (선택사항)
    read -p "Docker 시스템 캐시도 정리하시겠습니까? (y/n): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🧹 Docker 시스템을 정리합니다..."
        docker system prune -f
    fi
    
    echo ""
    echo "✅ 정리가 완료되었습니다!"
    echo "🚀 새로 시작하려면: ./start.sh"
else
    echo "❌ 정리가 취소되었습니다."
fi
