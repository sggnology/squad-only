# 멀티 스테이지 빌드를 사용하여 최적화된 Docker 이미지 생성

# Stage 1: 빌드 스테이지 (Build Stage)
FROM eclipse-temurin:21-jdk-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /build

# Gradle wrapper와 빌드 파일들 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Gradle wrapper 실행 권한 부여
RUN chmod +x ./gradlew

# 의존성 다운로드 (캐시 최적화를 위해 소스코드 복사 전에 실행)
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
RUN ./gradlew build --no-daemon -x test

# Stage 2: 런타임 스테이지 (Runtime Stage)
FROM eclipse-temurin:21-jre-alpine AS runtime

# spring 사용자/그룹 생성 (보안 강화)
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# 작업 디렉토리 설정
WORKDIR /app

# 로그 및 업로드 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/logs /app/uploads/temp /app/uploads/storage && \
    chown -R appuser:appgroup /app && \
    chmod -R 755 /app

# 빌드 스테이지에서 생성된 JAR 파일 복사
COPY --from=builder /build/build/libs/*.jar app.jar

# 소유권 변경 (spring 사용자가 app.jar 파일을 읽을 수 있도록)
RUN chown appuser:appgroup app.jar

# 포트 노출
EXPOSE 8080

# 비 root 사용자로 전환
USER appuser:appgroup

# JVM 옵션 설정 (메모리 최적화)
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:G1HeapRegionSize=16m -XX:+UseStringDeduplication"

# 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]