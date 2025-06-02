# Squad Only 🏢

**팀 단위 컨텐츠 관리 시스템**

Squad Only는 회사의 팀(Squad) 단위로 컨텐츠를 등록하고 관리하여 팀의 경험과 추억을 기록하고 보존하는 시스템입니다. 맛집 정보, 워크샵 기록, 팀 활동 등을 체계적으로 관리하여 필요할 때 언제든지 접근할 수 있습니다.

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 요구사항](#-시스템-요구사항)
- [설치 및 실행](#-설치-및-실행)
- [프로젝트 구조](#-프로젝트-구조)
- [사용자 관리](#-사용자-관리)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)
- [문제 해결](#-문제-해결)

## ✨ 주요 기능

- **팀 단위 컨텐츠 관리**: Squad별로 컨텐츠를 분류하고 관리
- **경험 기록 보존**: 맛집, 워크샵, 팀 활동 등의 기록을 체계적으로 저장
- **추억 검색**: 과거 경험을 쉽게 찾아보고 추억을 되새길 수 있음
- **관리자 중심 사용자 관리**: 회원가입이 아닌 관리자가 사용자를 관리하는 방식
- **파일 업로드**: 이미지 및 문서 첨부 기능
- **반응형 웹 인터페이스**: 다양한 디바이스에서 접근 가능

## 🛠 기술 스택

### Frontend
- **React** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Redux Toolkit** - 상태 관리

### Backend
- **Spring Boot 3.4.5** - 웹 프레임워크
- **Kotlin** - 백엔드 언어
- **Java 21 (Temurin)** - 런타임 환경
- **Spring Security** - 인증 및 권한 관리
- **Spring Data JPA** - 데이터 액세스

### Database
- **PostgreSQL 17.4** - 주 데이터베이스

### DevOps
- **Docker** - 컨테이너화
- **Docker Compose** - 멀티 컨테이너 관리
- **GitHub Actions** - CI/CD

## 💻 시스템 요구사항

- **Docker** 20.10 이상
- **Docker Compose** 2.0 이상
- **Git**
- **Node.js** 18+ (개발 시에만 필요)
- **Java 21** (개발 시에만 필요)

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/sggnology/squad-only.git
cd squad-only
```

### 2. 프로덕션 환경 실행

#### Windows 사용자
```cmd
cd server
start.bat
```

#### Linux/macOS/WSL 사용자
```bash
cd server
chmod +x commands/linux/*.sh
./commands/linux/start.sh
```

> **📌 참고사항**: 명령어 스크립트들은 유연한 실행을 위해 `commands/windows/` 또는 `commands/linux/` 디렉토리에서도 실행할 수 있습니다. 
> 이 경우 스크립트가 자동으로 `docker-compose.yml` 파일을 상위 디렉토리에서 복사하여 사용합니다. 
> 따라서 서버 루트 디렉토리뿐만 아니라 명령어 디렉토리에서도 동일하게 동작합니다.

### 3. 서비스 접속

- **웹 애플리케이션**: http://localhost:8080
- **데이터베이스**: localhost:45432

### 4. 기본 관리자 계정

- **ID**: `admin`
- **비밀번호**: `1234`

## 📁 프로젝트 구조

```
squad-only/
├── client/                    # React 프론트엔드
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── store/           # Redux 상태 관리
│   │   └── utils/           # 유틸리티 함수
│   └── package.json
├── server/                   # Spring Boot 백엔드
│   ├── src/
│   │   └── main/kotlin/     # Kotlin 소스 코드
│   ├── commands/            # 실행 스크립트
│   │   ├── linux/          # Linux/WSL용 스크립트
│   │   └── windows/        # Windows용 배치 파일
│   ├── docker-compose.yml  # Docker 구성
│   ├── Dockerfile          # Docker 이미지 빌드
│   └── build.gradle.kts    # Gradle 빌드 설정
└── README.md
```

## 👥 사용자 관리

### 관리자 기능

1. **사용자 생성**
   - 사용자 ID와 이름 입력
   - 기본 비밀번호 `1234` 자동 할당

2. **사용자 상태 관리**
   - 활성화/비활성화
   - 사용자 삭제

### 사용자 등급
- **관리자**: 모든 기능 접근 가능
- **일반 사용자**: 컨텐츠 등록/조회 가능

## 🔧 개발 가이드

### 로컬 개발 환경 설정

#### 1. 프론트엔드 개발

```bash
cd client
npm install
npm run dev
```

#### 2. 백엔드 개발

```bash
cd server
./gradlew bootRun
```

### 주요 명령어

#### Windows
- `start.bat` - 서비스 시작
- `stop.bat` - 서비스 중지
- `logs.bat [옵션]` - 로그 확인
- `clean.bat` - 데이터 완전 삭제

#### Linux/WSL
- `./commands/linux/start.sh` - 서비스 시작
- `./commands/linux/stop.sh` - 서비스 중지
- `./commands/linux/logs.sh [옵션]` - 로그 확인
- `./commands/linux/clean.sh` - 데이터 완전 삭제

> **💡 실행 팁**: 모든 명령어는 서버 루트 디렉토리(`/server`) 또는 해당 OS의 명령어 디렉토리(`/server/commands/windows` 또는 `/server/commands/linux`)에서 실행할 수 있습니다. 
> 명령어 디렉토리에서 실행할 경우 필요한 `docker-compose.yml` 파일이 자동으로 복사됩니다.

### 로그 확인 옵션

```bash
# 애플리케이션 로그만 보기
./logs.sh app

# 데이터베이스 로그만 보기
./logs.sh db

# 모든 서비스 로그 보기
./logs.sh all

# 파일 시스템 로그 보기
./logs.sh file
```

## 🚢 배포

### GitHub Actions을 통한 자동 배포

1. `release` 브랜치에 코드 push
2. GitHub Actions가 자동으로 빌드 및 배포
3. Docker 이미지가 GitHub Container Registry에 업로드

### 수동 배포

```bash
# 이미지 빌드
docker build -t squad-only:latest .

# Docker Compose로 실행
docker-compose up -d
```

## 🔍 문제 해결

### 일반적인 문제

#### 1. 포트 충돌
```bash
# 사용 중인 포트 확인
netstat -ano | findstr :8080
netstat -ano | findstr :45432
```

#### 2. 권한 문제 (Linux/WSL)
```bash
# 디렉토리 권한 설정
sudo chown -R 1500:1500 ./my-app-logs ./uploads
sudo chmod -R 755 ./my-app-logs ./uploads
```

#### 3. Docker 이미지 업데이트
```bash
# 최신 이미지 다운로드
docker-compose pull

# 서비스 재시작
docker-compose up -d
```

#### 4. 데이터베이스 연결 실패
1. PostgreSQL 컨테이너 상태 확인: `docker-compose ps`
2. 네트워크 연결 확인: `docker network ls`
3. 로그 확인: `./logs.sh db`

### 로그 파일 위치

- **애플리케이션 로그**: `./my-app-logs/`
- **PostgreSQL 데이터**: `./postgres-data/`
- **업로드 파일**: `./uploads/`

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 GitHub Issues를 통해 문의해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**Squad Only** - 팀의 소중한 추억을 기록하고 보존합니다 ✨
