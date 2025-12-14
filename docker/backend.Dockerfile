FROM eclipse-temurin:21-jdk

WORKDIR /app

# Gradle Wrapper 및 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 의존성 캐시 (선택)
RUN ./gradlew dependencies --no-daemon || true

# 소스 복사
COPY src src

# 빌드 실행 (jar 생성)
RUN ./gradlew build --no-daemon -x test

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "build/libs/Backend-0.0.1-SNAPSHOT.jar"]