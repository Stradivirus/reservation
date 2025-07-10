package com.example.backend.controller;

import com.example.backend.dto.EmailCheckDto;
import com.example.backend.dto.PhoneCheckDto;
import com.example.backend.dto.PreRegistrationDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.service.CouponService;
import com.example.backend.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final CouponService couponService;

    public RegistrationController(RegistrationService registrationService, CouponService couponService) {
        this.registrationService = registrationService;
        this.couponService = couponService;
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody EmailCheckDto dto) {
        boolean exists = registrationService.checkEmailExists(dto.getEmail());
        if (exists) {
            return ResponseEntity.badRequest().body("이미 등록된 이메일입니다.");
        }
        return ResponseEntity.ok("사용 가능한 이메일입니다.");
    }

    @PostMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestBody PhoneCheckDto dto) {
        boolean exists = registrationService.checkPhoneExists(dto.getPhone());
        if (exists) {
            return ResponseEntity.badRequest().body("이미 등록된 전화번호입니다.");
        }
        return ResponseEntity.ok("사용 가능한 전화번호입니다.");
    }

    @PostMapping("/preregister")
    public ResponseEntity<?> preregister(@RequestBody PreRegistrationDto dto) {
        if (registrationService.checkEmailExists(dto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "이미 등록된 이메일입니다."));
        }
        if (registrationService.checkPhoneExists(dto.getPhone())) {
            return ResponseEntity.badRequest().body(Map.of("message", "이미 등록된 전화번호입니다."));
        }
        registrationService.preregister(dto.getEmail(), dto.getPhone(), dto.getPrivacyConsent());
        // 쿠폰 발급
        String couponCode = couponService.generateAndAssignCoupon(dto.getEmail());
        return ResponseEntity.ok(new PreRegistrationResponseDto("사전등록 완료", couponCode));
    }
}