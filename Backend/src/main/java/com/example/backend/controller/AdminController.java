package com.example.backend.controller;

import com.example.backend.entity.Registration;
import com.example.backend.service.RegistrationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin") // Nginx의 /api 라우팅 규칙을 따름
public class AdminController {

    private final RegistrationService registrationService;

    public AdminController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * 관리자용 사전예약 목록 조회 API
     * 기능: 페이징, 날짜 필터, 사용여부 필터, 통계 데이터 제공
     * 요청 예시: GET /api/admin/registrations?page=0&size=30&date=2024-01-01&usage=used
     */
    @GetMapping("/registrations")
    public ResponseEntity<?> getRegistrations(
            @RequestParam(required = false, defaultValue = "all") String date,
            @RequestParam(required = false, defaultValue = "all") String usage,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        // 1. 서비스에서 필터링된 목록 조회 (Page 객체 반환)
        Page<Registration> pageResult = registrationService.getAdminRegistrations(date, usage, pageable);

        // 2. 통계 데이터 조회 (오늘 가입자, 전체 가입자)
        long todayCount = registrationService.getTodayRegistrationCount();
        long totalCount = registrationService.getTotalRegistrationCount();

        // 3. 응답 데이터 구성 (JSON)
        Map<String, Object> response = new HashMap<>();
        
        // 리스트 데이터
        response.put("content", pageResult.getContent());       
        
        // 페이지네이션 정보
        response.put("totalPages", pageResult.getTotalPages()); 
        response.put("totalElements", pageResult.getTotalElements()); 
        response.put("currentPage", pageResult.getNumber() + 1); // 프론트엔드 표기용 (1부터 시작)
        response.put("size", pageResult.getSize());
        response.put("isFirst", pageResult.isFirst());
        response.put("isLast", pageResult.isLast());

        // 통계 정보 (상단 바 표시용)
        Map<String, Long> stats = new HashMap<>();
        stats.put("today", todayCount);
        stats.put("total", totalCount);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }
    
    // 추후 관리자 로그인/인증 API도 여기에 추가 가능
    // @PostMapping("/login") ...
}