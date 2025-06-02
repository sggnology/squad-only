#!/bin/bash

# Squad Only 로그 확인 스크립트
echo "📋 Squad Only 로그를 확인합니다..."

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

# 파라미터 확인
if [ "$1" = "app" ] || [ "$1" = "application" ]; then
    echo "🔍 애플리케이션 로그를 확인합니다..."
    docker-compose logs -f application
elif [ "$1" = "db" ] || [ "$1" = "database" ]; then
    echo "🔍 데이터베이스 로그를 확인합니다..."
    docker-compose logs -f database
elif [ "$1" = "all" ]; then
    echo "🔍 모든 서비스 로그를 확인합니다..."
    docker-compose logs -f
elif [ "$1" = "file" ]; then
    echo "🔍 파일 시스템 로그를 확인합니다..."
    echo ""
    echo "=== 애플리케이션 로그 파일 ==="
    if [ -f "./my-app-logs/application.log" ]; then
        tail -n 50 ./my-app-logs/application.log
    else
        echo "로그 파일이 없습니다."
    fi
    echo ""
    echo "=== 에러 로그 파일 ==="
    if [ -f "./my-app-logs/error.log" ]; then
        tail -n 20 ./my-app-logs/error.log
    else
        echo "에러 로그 파일이 없습니다."
    fi
else
    echo "🔍 실시간 로그 옵션:"
    echo ""
    echo "사용법: ./logs.sh [옵션]"
    echo ""
    echo "옵션:"
    echo "  app, application  - 애플리케이션 로그만 표시"
    echo "  db, database      - 데이터베이스 로그만 표시"
    echo "  all              - 모든 서비스 로그 표시"
    echo "  file             - 파일 시스템 로그 표시"
    echo ""
    echo "기본값 (옵션 없음): 애플리케이션 로그 표시"
    echo ""
    echo "🔍 애플리케이션 로그를 확인합니다..."
    docker-compose logs -f application
fi
