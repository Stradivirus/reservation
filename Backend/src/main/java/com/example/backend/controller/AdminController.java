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
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RegistrationService registrationService;

    public AdminController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /**
     * 관리자용 사전예약 목록 조회 API
     */
    @GetMapping("/registrations")
    public ResponseEntity<?> getRegistrations(
            @RequestParam(required = false, defaultValue = "all") String date,
            @RequestParam(required = false, defaultValue = "all") String usage,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<Registration> pageResult = registrationService.getAdminRegistrations(date, usage, pageable);
        long todayCount = registrationService.getTodayRegistrationCount();
        long totalCount = registrationService.getTotalRegistrationCount();
        
        // [추가] 날짜별 등록 건수 조회
        List<Map<String, Object>> dateCounts = registrationService.getRegistrationCountsByDate();

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());       
        response.put("totalPages", pageResult.getTotalPages()); 
        response.put("totalElements", pageResult.getTotalElements()); 
        response.put("currentPage", pageResult.getNumber() + 1);
        response.put("size", pageResult.getSize());
        response.put("isFirst", pageResult.isFirst());
        response.put("isLast", pageResult.isLast());

        Map<String, Long> stats = new HashMap<>();
        stats.put("today", todayCount);
        stats.put("total", totalCount);
        response.put("stats", stats);
        
        // [추가] 날짜별 카운트 추가
        response.put("dateCounts", dateCounts);

        return ResponseEntity.ok(response);
    }
}