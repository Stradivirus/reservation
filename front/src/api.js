// IP/포트 없이 상대경로만 사용 (Nginx가 라우팅)
const REGISTRATION_API_URL = '/api';
const COUPON_API_URL = '/coupon';
const ADMIN_API_URL = '/api/admin';

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
    body: JSON.stringify({ email, phone, privacyConsent }),
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

// 관리자 로그인
export async function adminLogin(username, password) {
  const response = await fetch(`${ADMIN_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response;
}

// [수정] 관리자 목록 조회 - JSON 파싱까지 완료해서 반환
export async function getAdminRegistrations(page = 1, size = 30, dateFilter = 'all', usageFilter = 'all') {
  const params = new URLSearchParams({
    page: page - 1, // 프론트는 1부터, 백엔드는 0부터
    size: size,
    date: dateFilter,
    usage: usageFilter
  });

  const response = await fetch(`${ADMIN_API_URL}/registrations?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('데이터를 불러오는데 실패했습니다.');
  }

  // JSON 파싱해서 반환
  return await response.json();
}