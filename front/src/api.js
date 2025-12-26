// IP/포트 없이 상대경로만 사용 (Nginx가 라우팅)
const REGISTRATION_API_URL = '/api';
const COUPON_API_URL = '/coupon';
const ADMIN_API_URL = '/api/admin'; // [추가] 관리자용 API 경로

// 이메일 중복 확인
export async function checkEmailDuplicate(email) {
  const response = await fetch(`${REGISTRATION_API_URL}/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response;
}

// 전화번호 중복 확인
export async function checkPhoneDuplicate(phone) {
  const response = await fetch(`${REGISTRATION_API_URL}/check-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return response;
}

// 사전등록
export async function preregister({ email, phone, privacyConsent }) {
  const response = await fetch(`${REGISTRATION_API_URL}/preregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, phone, privacyConsent }), // camelCase로 전송
  });
  return response;
}

// 쿠폰 사용
export async function postCoupon(couponCode) {
  const response = await fetch(`${COUPON_API_URL}/use`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ couponCode }),
  });
  return response;
}

// [추가] 관리자 로그인
export async function adminLogin(username, password) {
  // 백엔드에 /api/admin/login 엔드포인트 구현이 필요합니다.
  const response = await fetch(`${ADMIN_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response;
}

// [추가] 관리자 목록 조회 (페이지네이션 및 필터링)
export async function getAdminRegistrations(page, size, dateFilter, usageFilter) {
  // 쿼리 파라미터 생성 (자동 인코딩 처리)
  const params = new URLSearchParams({
    page: page - 1, // 프론트는 1페이지부터, 스프링(Pageable)은 0페이지부터 시작하므로 -1
    size: size,
    date: dateFilter || 'all',   // 값이 없으면 'all' (백엔드 기본값)
    usage: usageFilter || 'all'  // 값이 없으면 'all'
  });

  const response = await fetch(`${ADMIN_API_URL}/registrations?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
}