#!/bin/bash

# Squad Only Docker 시작 스크립트
echo "🚀 Squad Only Docker 환경을 시작합니다..."

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
        echo "   서버 루트 디렉토리에서 실행하거나 docker-compose.yml이 있는지 확인하세요."
        exit 1
    fi
fi

# 포트 설정
DEFAULT_APP_PORT="8080"
read -p "🔗 애플리케이션 포트를 입력하세요 (기본값: ${DEFAULT_APP_PORT}): " APP_PORT
APP_PORT=${APP_PORT:-$DEFAULT_APP_PORT}

# docker-compose.yml에서 application 서비스 포트 변경
# 원본 파일을 직접 수정하는 대신, 임시 파일을 사용하거나 복사본을 수정할 수 있습니다.
# 여기서는 복사된 docker-compose.yml을 직접 수정합니다.
echo "🔧 docker-compose.yml의 애플리케이션 포트를 ${APP_PORT}로 설정합니다..."
# sed 명령어는 OS 호환성을 위해 -i 뒤에 백업 파일 확장자를 명시하는 것이 좋습니다. (예: sed -i'.bak')
# 하지만 여기서는 스크립트 내에서 복사된 파일을 다루므로, 직접 수정합니다.
sed -i "s/\"[0-9]*:8080\"/\"${APP_PORT}:8080\"/" docker-compose.yml
if [ $? -ne 0 ]; then
    echo "❌ docker-compose.yml 파일의 포트 변경에 실패했습니다."
    exit 1
fi
echo "✅ 포트가 성공적으로 변경되었습니다."


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
$DOCKER_COMPOSE_CMD --project-name squad-only up -d

# 서비스 상태 확인
echo "⏳ 서비스 시작을 기다립니다..."
sleep 5

echo "📊 서비스 상태를 확인합니다..."
$DOCKER_COMPOSE_CMD --project-name squad-only ps

echo ""
echo "✅ Squad Only가 성공적으로 시작되었습니다!"
echo "🌐 애플리케이션: http://localhost:${APP_PORT}"
echo "🗄️  데이터베이스: localhost:45432"
echo ""
echo "로그 확인: ./logs.sh"
echo "서비스 중지: ./stop.sh"
