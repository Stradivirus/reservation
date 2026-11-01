export interface TicketInfo {
  message: string;
  coupon_code: string;
  couponCode: string;
  email?: string;
  phone?: string;
  maskedEmail?: string;
  maskedPhone?: string;
  createdAt?: string;
  isCouponUsed?: boolean;
  prizeRank?: number | null;
  prizeName?: string | null;
  usedAt?: string | null;
}

export interface CouponResult {
  message: string;
  couponCode: string;
  alreadyUsed?: boolean;
  isCouponUsed?: boolean;
  prizeRank?: number | null;
  prizeName?: string | null;
  usedAt?: string | null;
  maskedEmail?: string | null;
  maskedPhone?: string | null;
}

export interface RegistrationItem {
  id: number;
  email: string;
  phone: string;
  privacyConsent: boolean;
  createdAt: string;
  couponCode: string;
  isCouponUsed: boolean;
  prizeRank?: number | null;
  prizeName?: string | null;
  usedAt?: string | null;
}

export interface AdminStats {
  total: number;
  today: number;
  usedCouponCount: number;
  unusedCouponCount: number;
  usageRate: number;
}

export interface DateCountItem {
  date: string;
  count: number;
}

export interface PrizeStatItem {
  rank: number;
  prizeName: string;
  count: number;
}

export interface AdminRegistrationsResponse {
  content: RegistrationItem[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  isFirst: boolean;
  isLast: boolean;
  stats: AdminStats;
  dateCounts: DateCountItem[];
  prizeStats: PrizeStatItem[];
}

export interface LoadBalancerStatus {
  frontendNode: string;
  backendNode: string;
  javaVersion: string;
  latencyMs: number;
  checkedAt: string;
}
