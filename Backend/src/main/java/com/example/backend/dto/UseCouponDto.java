package com.example.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // [중요] JSON 파싱을 위해 필요
public class UseCouponDto {
    private String couponCode;
}