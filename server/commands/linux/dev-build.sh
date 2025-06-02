#!/bin/bash

# Squad Only 로컬 빌드 및 실행 스크립트
echo "🔨 Squad Only를 로컬에서 빌드하고 실행합니다..."

# 필요한 디렉토리 생성
echo "📁 필요한 디렉토리를 생성합니다..."
mkdir -p ./postgres-data
mkdir -p ./my-app-logs
mkdir -p ./uploads/temp
mkdir -p ./uploads/storage

# 권한 설정
echo "🔐 디렉토리 권한을 설정합니다..."
if [ "$(id -u)" = "0" ]; then
    chown -R 1500:1500 ./my-app-logs ./uploads
    chmod -R 755 ./my-app-logs ./uploads
else
    if command -v sudo >/dev/null 2>&1; then
        sudo chown -R 1500:1500 ./my-app-logs ./uploads
        sudo chmod -R 755 ./my-app-logs ./uploads
    else
        echo "⚠️  권한 설정을 건너뜁니다."
    fi
fi

# 애플리케이션 빌드
echo "🔨 애플리케이션을 빌드합니다..."
./gradlew clean build -x test

# 빌드 성공 확인
if [ $? -eq 0 ]; then
    echo "✅ 빌드가 성공했습니다!"
    
    # Docker 이미지 빌드
    echo "🐳 Docker 이미지를 빌드합니다..."
    docker build -t squad-only:dev .
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker 이미지 빌드가 성공했습니다!"
        
        # docker-compose.yml을 개발용으로 임시 수정
        echo "🔧 개발용 설정으로 전환합니다..."
        sed -i.bak 's|ghcr.io/sggnology/squad-only:latest|squad-only:dev|g' docker-compose.yml
        
        # 서비스 시작
        echo "🚀 서비스를 시작합니다..."
        docker-compose up -d
        
        # 원래 설정으로 복원
        mv docker-compose.yml.bak docker-compose.yml
        
        echo ""
        echo "✅ 개발용 Squad Only가 시작되었습니다!"
        echo "🌐 애플리케이션: http://localhost:8080"
        echo "🗄️  데이터베이스: localhost:45432"
        
    else
        echo "❌ Docker 이미지 빌드에 실패했습니다."
        exit 1
    fi
else
    echo "❌ 애플리케이션 빌드에 실패했습니다."
    exit 1
fi
