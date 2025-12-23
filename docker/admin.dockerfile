# 멀티스테이지 빌드
FROM python:3.9-slim as builder

WORKDIR /app

# 필요한 시스템 패키지만 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# requirements만 먼저 복사 (캐시 활용)
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# 실행 스테이지
FROM python:3.9-slim

WORKDIR /app

# 필요한 런타임 라이브러리만 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# builder에서 설치한 패키지 복사
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# 소스 코드 복사
COPY . .

# 정적 파일 수집
RUN python manage.py collectstatic --noinput

# gunicorn으로 실행
CMD ["gunicorn", "--bind", "0.0.0.0:80", "--workers", "2", "preregistration_project.wsgi:application"]