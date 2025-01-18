export class GenerateCouponDto {
    email: string;
  }
  
  export class UseCouponDto {
    coupon_code: string;
  }
  
  export class CouponResponseDto {
    message: string;
    coupon_code?: string;
  }