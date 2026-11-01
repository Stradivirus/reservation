package com.example.backend.dto;

import com.example.backend.entity.Registration;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PreRegistrationResponseDto {
    private String message;
    private String coupon_code;
    private String couponCode;
    private String email;
    private String phone;
    private String maskedEmail;
    private String maskedPhone;
    private LocalDateTime createdAt;
    private Boolean isCouponUsed;
    private Integer prizeRank;
    private String prizeName;
    private LocalDateTime usedAt;

    public PreRegistrationResponseDto(String message, String couponCode) {
        this.message = message;
        this.coupon_code = couponCode;
        this.couponCode = couponCode;
    }

    public static PreRegistrationResponseDto fromEntity(String message, Registration reg) {
        PreRegistrationResponseDto dto = new PreRegistrationResponseDto(message, reg.getCouponCode());
        dto.setEmail(reg.getEmail());
        dto.setPhone(reg.getPhone());
        dto.setMaskedEmail(maskEmail(reg.getEmail()));
        dto.setMaskedPhone(maskPhone(reg.getPhone()));
        dto.setCreatedAt(reg.getCreatedAt());
        dto.setIsCouponUsed(Boolean.TRUE.equals(reg.getIsCouponUsed()));
        dto.setPrizeRank(reg.getPrizeRank());
        dto.setPrizeName(reg.getPrizeName());
        dto.setUsedAt(reg.getUsedAt());
        return dto;
    }

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@", 2);
        String local = parts[0];
        String domain = parts[1];
        if (local.length() <= 2) {
            return local.charAt(0) + "*@" + domain;
        }
        return local.substring(0, 2) + "*".repeat(Math.min(local.length() - 2, 4)) + "@" + domain;
    }

    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) {
            return phone;
        }
        if (phone.length() == 11) {
            return phone.substring(0, 3) + "-****-" + phone.substring(7);
        }
        return phone.substring(0, 3) + "-***-" + phone.substring(phone.length() - 4);
    }
}