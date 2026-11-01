# 🍂 Reservation (가을 꽃 축제 사전예약 시스템) 리메이크 계획서

본 문서는 기존 `reservation` 프로젝트의 핵심 컨셉(**가을 꽃 축제 사전예약 + 추첨권 발급/사용 + Nginx 로드밸런싱 + Spring Boot 백엔드**)을 유지하면서, 최신 기술 스택과 고도화된 UX로 리메이크하기 위한 설계 문서입니다.

---

## 1. 보존할 핵심 자산 vs 정리할 레거시

### ✅ 보존 및 재활용할 자산
1. **직접 촬영한 가을 꽃 축제 원본 사진 5장 (`front/public/images/*.jpg`)**
   - `1759659528457.jpg`, `1731807191481.jpg`, `1731806820349.jpg`, `1731807231234.jpg`, `1731806825200.jpg`
   - 프론트엔드 재구축 시 반드시 백업 후 새 프로젝트의 `public/images/`로 그대로 이전하여 메인 갤러리/슬라이더에 활용
2. **Spring Boot 백엔드 코어 (`Backend/`)**
   - 현재 Spring Boot 3.5.3 + MySQL 연동 구조가 잡혀 있으므로 기본 골격 유지 및 확장
3. **Nginx 로드밸런서 아키텍처 (`docker/nginx/nginx.conf`)**
   - `X-Served-By` 응답 헤더를 활용한 프론트엔드 부하 분산 컨셉 유지

### 🗑️ 레거시 코드 포트폴리오 브랜치 박제 및 정리 전략
1. **Git 브랜치 분리 보관 (포트폴리오 아키텍처 변천사 증빙용)**
   - 메인 브랜치(`main`)에서 `_archieve/`를 단순 삭제하기 전에, GitHub 원격 저장소에 버전별 브랜치로 먼저 박제하여 **"Django 모놀리식(v1) → Spring Boot 초기 전환(v2) → 고도화 리메이크(v3)"** 성장 서사를 증명합니다:
     - **`legacy/v1-django` 브랜치**: `_archieve/` 디렉토리 내부의 초기 Django 코드만 추출하여 별도 브랜치로 푸시
     - **`legacy/v2-springboot` 브랜치**: 리메이크 작업 착수 직전의 현재 코드 상태를 그대로 브랜치로 푸시
   - 이후 `main` 브랜치에서는 `_archieve/` 폴더를 삭제하고 `README.md` 상단에 버전별 브랜치 링크를 제공하여 깔끔한 코드베이스와 히스토리를 동시에 확보합니다.
2. **`front/` 프론트엔드 전면 재구축**:
   - 구버전 Create React App (`react-scripts`, `node:14-alpine`, 일반 JS/CSS) 폐기
   - **`Vite + React 18 + TypeScript + Tailwind CSS`** 기반으로 전면 재작성

---

## 2. 주요 리메이크 및 개선 방향 (4대 핵심 포인트)

### ① Nginx 로드밸런서 시각화 위젯 (포트폴리오 어필 포인트 강화)
* **현황**: `nginx.conf`에서 `add_header X-Served-By $upstream_addr;`를 내려주고 있으나 화면에서는 보이지 않음
* **개선**:
  - 프론트엔드 상단 헤더(또는 하단 플로팅 배지)에 **`🟢 Load Balanced Node: frontend-1 (Round-Robin)`** 상태 표시 위젯 추가
  - 포트폴리오 방문자(면접관)가 새로고침하거나 API를 호출할 때 로드밸런싱이 동작하는 것을 시각적으로 즉시 확인 가능하도록 구성

### ② 사전예약 완료 시 "모바일 QR 티켓(입장권)" 발급 UX
* **현황**: 사전예약 완료 후 단순 텍스트로 8자리 코드만 표시됨
* **개선**:
  - 실제 페스티벌 모바일 패스 형태의 **인터랙티브 티켓 카드 UI (절취선 디자인 + QR 코드 자동 생성 + 예약자 마스킹 정보 + 8자리 추첨 코드)** 제공
  - 코드 원클릭 복사 및 **[지금 바로 추첨권 사용하기]** 연동 버튼 제공
  - 이미 예약한 사용자도 이메일/전화번호로 본인 QR 티켓 및 추첨권 코드를 다시 조회할 수 있는 기능 추가

### ③ 추첨권 사용(`/use-coupon`) → "실시간 경품 추첨(Lucky Draw)" 고도화
* **현황**: 추첨권 코드 입력 시 단순히 `"사용 완료"` 메시지만 표시되고 끝남
* **개선**:
  - 추첨권 사용 시 스크래치 카드 또는 룰렛/뽑기 애니메이션 연출과 함께 **확률 기반 등급별 경품 추첨** 수행:
    - 🏆 **1등 (5%)**: 가을 꽃 축제 VIP 라운지 2인 패스
    - 🎁 **2등 (15%)**: 한정판 가을 꽃 축제 굿즈 패키지
    - 🍔 **3등 (30%)**: 축제 푸드트럭 10,000원 이용권
    - ☕ **4등 (50%)**: 현장 웰컴 드링크 교환권
  - 이미 사용된 코드를 입력하면 **"이미 추첨이 완료된 코드입니다 (당첨 경품: 2등 굿즈 패키지 / 추첨 일시: YYYY-MM-DD HH:mm)"** 형태로 당첨 영수증 카드 표시

### ④ 관리자 대시보드(`/admin`) 시각화 및 검색 기능 강화
* **현황**: 단순 테이블과 날짜/사용여부 필터만 존재
* **개선**:
  - **[원클릭 관리자 데모 로그인]** 버튼 유지 (포트폴리오 방문자 편의성)
  - **상단 KPI 요약 카드 4종**: 총 사전예약자 수 / 오늘 신규 예약자 / 추첨권 사용률(%) / 등급별 경품 당첨 현황
  - **시각화 차트 추가**: 일별 사전예약 추이 차트(Bar/Line) 및 경품 등급별 당첨 분포 도넛 차트
  - **필터 및 검색 고도화**: 날짜별 필터 + 쿠폰 사용여부 필터 + **경품 등급별 필터** + **이메일/전화번호/쿠폰코드 통합 검색창**

---

## 3. 기술 스택 및 인프라 개선 계획

### ⚙️ Backend (`Backend/`) & Database
* **Database (기존 MySQL HeatWave 그대로 유지)**:
  - 현재 운영 중인 **Oracle MySQL HeatWave (`jdbc:mysql://10.0.0.29:3306/reservation`)** 스키마를 새로 만들 필요 없이 그대로 사용
  - `spring.jpa.hibernate.ddl-auto=update` 설정을 통해 기존 사전예약 데이터를 보존하면서 신규 경품 컬럼만 자동 추가(`ALTER TABLE`)
* **Java 버전 업그레이드**: `Java 21` → 최신 **`Java 24` 또는 `Java 25 (LTS)`** 업그레이드
* **Entity 확장 (`Registration.java`)**:
  - 기존 컬럼 유지 (`id`, `email`, `phone`, `privacyConsent`, `createdAt`, `couponCode`, `isCouponUsed`)
  - 신규 컬럼 추가:
    - `prizeRank` (`Integer`, nullable): 당첨 등수 (1~4)
    - `prizeName` (`String`, nullable): 당첨 경품명
    - `usedAt` (`LocalDateTime`, nullable): 추첨권 사용 일시
* **Docker 이미지 경량화 (`docker/backend.Dockerfile`)**:
  - 빌드 스테이지(`jdk`)와 실행 스테이지(`jre-alpine`)를 분리한 멀티스테이지 빌드를 적용하여 컨테이너 메모리 점유율 절감

### 💻 Frontend (`front/`)
* **스택**: `React 18`, `TypeScript`, `Vite`, `Tailwind CSS`, `Lucide React` (아이콘), `qrcode.react` (QR 코드 생성)
* **Docker 이미지 경량화 (`docker/frontend.Dockerfile`)**:
  - 구버전 `node:14-alpine` + `serve` 방식을 `node:20-alpine` 빌드 후 경량 정적 서빙 구조로 개선

---

## 4. 향후 작업 진행 순서 (새 세션에서 실행 시)
1. **Step 1 (레거시 브랜치 박제)**: `_archieve/`를 `legacy/v1-django` 브랜치로, 현재 상태를 `legacy/v2-springboot` 브랜치로 GitHub에 푸시 후 메인 작업 공간에서 `_archieve/` 제거
2. **Step 2 (백엔드 고도화)**: `Backend/` Java 최신 버전 업그레이드 + `Registration` 엔티티(`prizeRank`, `prizeName`, `usedAt`)/확률형 경품 추첨 API/관리자 통계·검색 API 확장 (기존 `10.0.0.29:3306/reservation` DB 연동 유지)
3. **Step 3 (프론트엔드 초기화)**: `front/public/images/*.jpg` 사진 5장 백업 후 `front/`를 `Vite + React + TS + Tailwind`로 재생성 및 사진 복원
4. **Step 4 (UI/UX 구현)**:
   - 메인 페이지(가을 꽃 축제 히어로 + 포토 슬라이더 + 사전예약 폼 + QR 티켓 발급 + 로드밸런서 노드 실시간 배지)
   - 추첨권 럭키드로우 페이지(`/use-coupon`) 및 관리자 대시보드(`/admin`)
5. **Step 5 (배포 및 문서화)**: Docker 멀티스테이지 빌드 구성, `DevOps` Jenkins 파이프라인 연동 및 `README.md` 버전별 아키텍처 변천사 링크 작성
