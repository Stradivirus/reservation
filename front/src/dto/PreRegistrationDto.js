// 백엔드 DTO와 동일한 구조로 정의
export class PreRegistrationDto {
  constructor(email, phone, privacyConsent) {
    this.email = email;
    this.phone = phone;
    this.privacyConsent = privacyConsent;
  }
}