package com.example.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreRegistrationDto {
    
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    // 간단한 이메일 형식 정규식 (필요시 더 정교하게 변경 가능)
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "전화번호는 필수 입력값입니다.")
    @Pattern(regexp = "^\\d{11}$", message = "전화번호는 11자리 숫자여야 합니다.")
    private String phone;

    @AssertTrue(message = "개인정보 수집 및 이용에 동의해야 합니다.")
    private Boolean privacyConsent;
}