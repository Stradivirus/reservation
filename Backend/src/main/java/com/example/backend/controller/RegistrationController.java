package com.example.backend.controller;

import com.example.backend.dto.EmailCheckDto;
import com.example.backend.dto.PhoneCheckDto;
import com.example.backend.dto.PreRegistrationDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.service.RegistrationService;
import jakarta.validation.Valid; // javax.validation.Valid 대신 jakarta 사용 (SpringBoot 3.x)
import org.springframework.dao.DataIntegrityViolationException;
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

    // @Valid 추가: DTO에 설정한 검증 로직(@NotBlank 등)이 여기서 작동함
    @PostMapping("/preregister")
    public ResponseEntity<?> preregister(@Valid @RequestBody PreRegistrationDto dto) {
        try {
            // 서비스 계층의 트랜잭션 메서드 호출
            PreRegistrationResponseDto response = registrationService.registerWithCoupon(dto);
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            // DB Unique 제약조건 위반 시
            return ResponseEntity.badRequest().body(Map.of("detail", "이미 등록된 이메일 또는 전화번호입니다."));
        } catch (IllegalStateException e) {
            // 쿠폰 생성 실패 등 로직 에러
            return ResponseEntity.badRequest().body(Map.of("detail", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("detail", "등록 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}