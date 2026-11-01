// coupon.dto.ts
export class UseCouponDto {
  coupon_code: string;
 }
 
 export class CouponResponseDto {
  message: string;
  coupon_code?: string;
 }
 
 export interface PreregistrationType {
  id: number;
  email: string;
  phone: string;
  coupon_code: string;
  is_coupon_used: boolean;
  created_at: Date;
 }