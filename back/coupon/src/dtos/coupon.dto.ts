export class UseCouponDto {
  coupon_code: string;
}

export class CouponResponseDto {
  message: string;
  coupon_code?: string;
}

// 데이터베이스 타입 정의
export interface PreregistrationType {
  id: number;
  email: string;
  phone: string;
  coupon_code: string;
  is_coupon_used: boolean;
  created_at: Date;
}