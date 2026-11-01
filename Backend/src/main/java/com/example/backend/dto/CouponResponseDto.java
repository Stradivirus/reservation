package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponResponseDto {
    private String message;
    private String couponCode;
    private Boolean alreadyUsed;
    private Boolean isCouponUsed;
    private Integer prizeRank;
    private String prizeName;
    private LocalDateTime usedAt;
    private String maskedEmail;
    private String maskedPhone;

    public CouponResponseDto(String message, String couponCode) {
        this.message = message;
        this.couponCode = couponCode;
    }
}