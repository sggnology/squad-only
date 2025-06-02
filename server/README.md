# Squad Only Server

Spring Boot + Kotlin 기반의 Squad Only 백엔드 서버입니다.

## 빠른 시작

### Docker를 사용한 실행 (권장)

#### Windows
```cmd
start.bat
```

#### Linux/WSL
```bash
./commands/linux/start.sh
```

## 사용 가능한 명령어

### Windows 사용자
- `start.bat` - 서비스 시작
- `stop.bat` - 서비스 중지  
- `logs.bat [app|db|all|file]` - 로그 확인
- `clean.bat` - 데이터 완전 삭제

### Linux/WSL 사용자
- `./commands/linux/start.sh` - 서비스 시작
- `./commands/linux/stop.sh` - 서비스 중지
- `./commands/linux/logs.sh [app|db|all|file]` - 로그 확인  
- `./commands/linux/clean.sh` - 데이터 완전 삭제

## 기본 설정

- **서버 포트**: 8080
- **관리자 계정**: admin/1234

## 디렉토리 구조

- `my-app-logs/` - 애플리케이션 로그 파일
- `uploads/` - 업로드된 파일들
- `postgres-data/` - PostgreSQL 데이터
- `commands/` - OS별 실행 스크립트

자세한 내용은 [메인 README](../README.md)를 참조하세요.