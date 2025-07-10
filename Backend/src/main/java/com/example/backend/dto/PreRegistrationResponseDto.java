package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreRegistrationResponseDto {
    private String message;
    private String coupon_code;

    public PreRegistrationResponseDto(String message, String couponCode) {
        this.message = message;
        this.coupon_code = couponCode;
    }
}