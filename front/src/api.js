// IP/포트 없이 상대경로만 사용 (Nginx가 라우팅)
const REGISTRATION_API_URL = '/api';
const COUPON_API_URL = '/coupon';

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
    body: JSON.stringify({ email, phone, privacyConsent }), // camelCase로!
  });
  return response;
}

// 쿠폰 사용
export async function postCoupon(couponCode) {
  const response = await fetch(`${COUPON_API_URL}/use`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ couponCode }), // 이렇게 되면 400 에러
  });
  return response;
}