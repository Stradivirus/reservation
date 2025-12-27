export class PreRegistrationDto {
    email: string;
    phone: string;
    privacy_consent: boolean;
  }
  
  export class EmailCheckDto {
    email: string;
  }
  
  export class PhoneCheckDto {
    phone: string;
  }
  
  export class RegistrationResponseDto {
    message: string;
    created_at?: string;
    coupon_code?: string;
  }