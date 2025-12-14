FROM node:14-alpine

WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 정적 파일 서빙을 위한 serve 설치
RUN npm install -g serve

# 3000 포트에서 정적 파일 서빙
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]