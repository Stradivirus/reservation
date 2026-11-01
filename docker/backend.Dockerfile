# Stage 1: Build Stage (Java 24)
FROM eclipse-temurin:24-jdk-alpine AS builder

WORKDIR /app

# Gradle Wrapper 및 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon || true

# 소스 복사 및 빌드 실행
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Lightweight Runtime Stage (Java 24 JRE Alpine)
FROM eclipse-temurin:24-jre-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/Backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
