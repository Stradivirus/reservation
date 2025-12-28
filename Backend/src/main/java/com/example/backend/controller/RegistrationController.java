package com.example.backend.controller;

import com.example.backend.dto.EmailCheckDto;
import com.example.backend.dto.PhoneCheckDto;
import com.example.backend.dto.PreRegistrationDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody EmailCheckDto dto) {
        if (registrationService.checkEmailExists(dto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("detail", "이미 등록된 이메일입니다."));
        }
        return ResponseEntity.ok(Map.of("message", "사용 가능한 이메일입니다."));
    }

    @PostMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestBody PhoneCheckDto dto) {
        if (registrationService.checkPhoneExists(dto.getPhone())) {
            return ResponseEntity.badRequest().body(Map.of("detail", "이미 등록된 전화번호입니다."));
        }
        return ResponseEntity.ok(Map.of("message", "사용 가능한 전화번호입니다."));
    }

    @PostMapping("/preregister")
    public ResponseEntity<?> preregister(@Valid @RequestBody PreRegistrationDto dto) {
        // [수정] try-catch 제거: GlobalExceptionHandler가 처리함
        PreRegistrationResponseDto response = registrationService.registerWithCoupon(dto);
        return ResponseEntity.ok(response);
    }
    
    // [제거] @ExceptionHandler 메서드는 GlobalExceptionHandler로 이동하여 삭제됨
}