#!/bin/bash
# WSL Ubuntu 환경에서 Docker 컨테이너 권한 문제 해결 스크립트

echo "디렉토리 권한 설정 중..."

# 현재 사용자 ID 확인
echo "현재 사용자 ID: $(id -u)"
echo "현재 그룹 ID: $(id -g)"

# 디렉토리 생성 및 권한 설정
sudo mkdir -p ./my-app-logs ./uploads/temp ./uploads/storage

# 현재 사용자(보통 1000:1000)로 소유권 변경
sudo chown -R $(id -u):$(id -g) ./my-app-logs ./uploads

# 디렉토리 권한 설정 (읽기/쓰기/실행)
chmod -R 755 ./my-app-logs ./uploads

echo "권한 설정 완료!"
echo "my-app-logs 디렉토리: $(ls -ld ./my-app-logs)"
echo "uploads 디렉토리: $(ls -ld ./uploads)"
