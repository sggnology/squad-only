# Squad Only Client

React + TypeScript 기반의 Squad Only 프론트엔드 클라이언트입니다.

## 개발 환경 설정

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 기술 스택

- **React** - UI 프레임워크
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Redux Toolkit** - 상태 관리

## 주요 디렉토리

- `src/components/` - 재사용 가능한 컴포넌트
- `src/pages/` - 페이지별 컴포넌트
- `src/store/` - Redux 상태 관리
- `src/utils/` - 유틸리티 함수
- `src/contexts/` - React Context

## 빌드 및 배포

클라이언트는 빌드 시 서버의 `src/main/resources/static` 디렉토리에 자동으로 복사되어 Spring Boot 서버를 통해 서빙됩니다.

자세한 내용은 [메인 README](../README.md)를 참조하세요.
