package com.example.backend.controller;

import com.example.backend.dto.EmailCheckDto;
import com.example.backend.dto.PhoneCheckDto;
import com.example.backend.dto.PreRegistrationDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException; // 임포트 추가
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
        try {
            PreRegistrationResponseDto response = registrationService.registerWithCoupon(dto);
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("detail", "이미 등록된 이메일 또는 전화번호입니다."));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("detail", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("detail", "등록 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // [여기가 추가된 부분입니다]
    // @Valid 검증 실패 시 발생하는 예외(MethodArgumentNotValidException)를 잡아서 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // 에러 목록 중 첫 번째 에러의 메시지(DTO에 적은 message)를 가져옴
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        
        // 프론트엔드 포맷 { "detail": "에러메시지" } 에 맞춰 반환
        return ResponseEntity.badRequest().body(Map.of("detail", errorMessage));
    }
}