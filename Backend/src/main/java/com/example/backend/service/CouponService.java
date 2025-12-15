package com.example.backend.service;

import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class CouponService {
    private final RegistrationRepository registrationRepository;

    public CouponService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    // 내부적으로 사용하는 랜덤 코드 생성기
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

    /**
     * 쿠폰 발급 (중복 방지 로직 포함)
     * 이미 발급된 사용자는 기존 코드 반환
     */
    @Transactional
    public String generateAndAssignCoupon(String email) {
        Optional<Registration> optional = registrationRepository.findByEmail(email);
        
        if (optional.isEmpty()) {
            throw new IllegalArgumentException("등록된 사용자가 없습니다.");
        }

        Registration reg = optional.get();
        
        // 이미 발급된 쿠폰이 있다면 그대로 반환
        if (reg.getCouponCode() != null) {
            return reg.getCouponCode(); 
        }

        // 중복 방지 로직: 유니크한 코드를 뽑을 때까지 최대 5번 시도
        String newCode = null;
        int maxRetries = 5;
        for (int i = 0; i < maxRetries; i++) {
            String candidate = generateCouponCode();
            if (!registrationRepository.existsByCouponCode(candidate)) {
                newCode = candidate;
                break;
            }
        }

        if (newCode == null) {
            throw new IllegalStateException("쿠폰 코드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }

        // DB 업데이트
        reg.setCouponCode(newCode);
        reg.setIsCouponUsed(false);
        registrationRepository.save(reg);
        
        return newCode;
    }

    // 쿠폰 사용
    @Transactional
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