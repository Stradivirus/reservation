package com.example.backend.service;

import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class CouponService {
    private final RegistrationRepository registrationRepository;

    public CouponService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    // 쿠폰 코드 생성
    private String generateCouponCode() {
        int length = 8;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // 쿠폰 발급 (이메일로 사용자 조회 후 쿠폰코드 발급)
    public String generateAndAssignCoupon(String email) {
        Optional<Registration> optional = registrationRepository.findByEmail(email);
        if (optional.isPresent()) {
            Registration reg = optional.get();
            if (reg.getCouponCode() != null) {
                return reg.getCouponCode(); // 이미 발급된 경우 기존 코드 반환
            }
            String couponCode = generateCouponCode();
            reg.setCouponCode(couponCode);
            reg.setIsCouponUsed(false);
            registrationRepository.save(reg);
            return couponCode;
        }
        throw new IllegalArgumentException("등록된 사용자가 없습니다.");
    }

    // 쿠폰 사용
    public String useCoupon(String couponCode) {
        Optional<Registration> optional = registrationRepository.findByCouponCode(couponCode);
        if (optional.isPresent()) {
            Registration reg = optional.get();
            if (Boolean.TRUE.equals(reg.getIsCouponUsed())) {
                throw new IllegalStateException("이미 사용된 쿠폰입니다.");
            }
            reg.setIsCouponUsed(true);
            registrationRepository.save(reg);
            return "쿠폰 사용 완료";
        }
        throw new IllegalArgumentException("유효하지 않은 쿠폰 코드입니다.");
    }
}
