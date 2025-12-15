package com.example.backend.service;

import com.example.backend.dto.PreRegistrationDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {
    private final RegistrationRepository registrationRepository;
    private final CouponService couponService;

    public RegistrationService(RegistrationRepository registrationRepository, CouponService couponService) {
        this.registrationRepository = registrationRepository;
        this.couponService = couponService;
    }

    // 단순 조회용 (Controller에서 UI 피드백용으로 사용 가능)
    public boolean checkEmailExists(String email) {
        return registrationRepository.findByEmail(email).isPresent();
    }

    public boolean checkPhoneExists(String phone) {
        return registrationRepository.findByPhone(phone).isPresent();
    }

    /**
     * 사전등록 및 쿠폰 발급을 하나의 트랜잭션으로 처리
     * 데이터 무결성 보장
     */
    @Transactional
    public PreRegistrationResponseDto registerWithCoupon(PreRegistrationDto dto) {
        // 1. 등록 정보 저장
        Registration registration = new Registration();
        registration.setEmail(dto.getEmail());
        registration.setPhone(dto.getPhone());
        registration.setPrivacyConsent(dto.getPrivacyConsent());
        
        // save 시 DB의 unique 제약조건에 의해 중복이면 예외 발생 (DataIntegrityViolationException)
        Registration savedRegistration = registrationRepository.save(registration);

        // 2. 쿠폰 생성 및 할당 (저장된 엔티티 사용)
        String couponCode = couponService.generateAndAssignCoupon(savedRegistration.getEmail());

        return new PreRegistrationResponseDto("사전등록이 완료되었습니다.", couponCode);
    }
}