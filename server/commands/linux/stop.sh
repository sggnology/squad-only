#!/bin/bash

# Squad Only Docker 중지 스크립트
echo "🛑 Squad Only Docker 환경을 중지합니다..."

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
