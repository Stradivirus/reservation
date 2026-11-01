import {
  AdminRegistrationsResponse,
  CouponResult,
  LoadBalancerStatus,
  TicketInfo,
} from './types';

const REGISTRATION_API_URL = '/api';
const COUPON_API_URL = '/coupon';
const ADMIN_API_URL = '/api/admin';

export async function checkEmailDuplicate(email: string): Promise<{ ok: boolean; message: string }> {
  const response = await fetch(`${REGISTRATION_API_URL}/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    message: data.message || data.detail || (response.ok ? '사용 가능한 이메일입니다.' : '이미 등록된 이메일입니다.'),
  };
}

export async function checkPhoneDuplicate(phone: string): Promise<{ ok: boolean; message: string }> {
  const response = await fetch(`${REGISTRATION_API_URL}/check-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    message: data.message || data.detail || (response.ok ? '사용 가능한 전화번호입니다.' : '이미 등록된 전화번호입니다.'),
  };
}

export async function preregister(payload: {
  email: string;
  phone: string;
  privacyConsent: boolean;
}): Promise<TicketInfo> {
  const response = await fetch(`${REGISTRATION_API_URL}/preregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || '사전예약 처리 중 오류가 발생했습니다.');
  }
  return data as TicketInfo;
}

export async function lookupTicket(query: string): Promise<TicketInfo> {
  const response = await fetch(`${REGISTRATION_API_URL}/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || '예약 내역을 찾을 수 없습니다.');
  }
  return data as TicketInfo;
}

export async function useCouponApi(couponCode: string): Promise<CouponResult> {
  const response = await fetch(`${COUPON_API_URL}/use`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ couponCode }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.detail || '유효하지 않은 추첨권 코드입니다.');
  }
  return data as CouponResult;
}

export async function getCouponStatusApi(couponCode: string): Promise<CouponResult> {
  const response = await fetch(`${COUPON_API_URL}/status/${encodeURIComponent(couponCode)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.detail || '유효하지 않은 추첨권 코드입니다.');
  }
  return data as CouponResult;
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || '아이디 또는 비밀번호가 올바르지 않습니다.');
  }
}

export async function getAdminRegistrations(params: {
  page?: number;
  size?: number;
  date?: string;
  usage?: string;
  prizeRank?: string;
  search?: string;
}): Promise<AdminRegistrationsResponse> {
  const searchParams = new URLSearchParams({
    page: String((params.page ?? 1) - 1),
    size: String(params.size ?? 20),
    date: params.date ?? 'all',
    usage: params.usage ?? 'all',
    prizeRank: params.prizeRank ?? 'all',
    search: params.search ?? '',
  });

  const response = await fetch(`${ADMIN_API_URL}/registrations?${searchParams.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('관리자 데이터를 불러오는데 실패했습니다.');
  }

  return (await response.json()) as AdminRegistrationsResponse;
}

export async function fetchLoadBalancerStatus(): Promise<LoadBalancerStatus> {
  const start = performance.now();
  let frontendNode = 'frontend:3000 (Round-Robin)';
  let backendNode = 'backend:8080';
  let javaVersion = '24';

  try {
    const [headRes, apiRes] = await Promise.all([
      fetch(`/?_lb=${Date.now()}`, { method: 'HEAD', cache: 'no-store' }),
      fetch(`${REGISTRATION_API_URL}/node-info?_lb=${Date.now()}`, { cache: 'no-store' }),
    ]);

    const servedBy = headRes.headers.get('X-Served-By') || headRes.headers.get('x-served-by');
    if (servedBy) {
      frontendNode = `frontend (${servedBy})`;
    }

    const backendServedBy =
      apiRes.headers.get('X-Backend-Served-By') || apiRes.headers.get('x-backend-served-by');

    if (apiRes.ok) {
      const info = await apiRes.json();
      if (info.backendNode) {
        backendNode = backendServedBy
          ? `${info.backendNode} (${backendServedBy})`
          : info.backendNode;
      }
      if (info.javaVersion) {
        javaVersion = info.javaVersion;
      }
    }
  } catch {
    // Fallback if offline
  }

  const latencyMs = Math.max(1, Math.round(performance.now() - start));
  const now = new Date();
  const checkedAt = now.toTimeString().split(' ')[0];

  return {
    frontendNode,
    backendNode,
    javaVersion,
    latencyMs,
    checkedAt,
  };
}
