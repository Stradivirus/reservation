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
     * 관리자 로그인 API (포트폴리오 데모 로그인 및 관리자 인증 지원)
     */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody(required = false) Map<String, String> credentials) {
        String username = credentials != null ? credentials.getOrDefault("username", "") : "";
        String password = credentials != null ? credentials.getOrDefault("password", "") : "";

        if ("admin".equals(username) && ("Tjdwhd23!!".equals(password) || "admin1234".equals(password) || "demo".equals(password))) {
            return ResponseEntity.ok(Map.of(
                    "message", "관리자 로그인 성공",
                    "role", "ADMIN",
                    "username", "admin"
            ));
        }
        return ResponseEntity.status(401).body(Map.of("detail", "아이디 또는 비밀번호가 올바르지 않습니다."));
    }

    /**
     * 관리자용 사전예약 목록 조회 API
     */
    @GetMapping("/registrations")
    public ResponseEntity<?> getRegistrations(
            @RequestParam(required = false, defaultValue = "all") String date,
            @RequestParam(required = false, defaultValue = "all") String usage,
            @RequestParam(required = false, defaultValue = "all") String prizeRank,
            @RequestParam(required = false, defaultValue = "") String search,
            @PageableDefault(size = 30, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<Registration> pageResult = registrationService.getAdminRegistrations(date, usage, prizeRank, search, pageable);
        long todayCount = registrationService.getTodayRegistrationCount();
        long totalCount = registrationService.getTotalRegistrationCount();
        long usedCouponCount = registrationService.getUsedCouponCount();
        double usageRate = totalCount > 0 ? Math.round((usedCouponCount * 1000.0) / totalCount) / 10.0 : 0.0;

        List<Map<String, Object>> dateCounts = registrationService.getRegistrationCountsByDate();
        List<Map<String, Object>> prizeStats = registrationService.getPrizeDistribution();

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        response.put("currentPage", pageResult.getNumber() + 1);
        response.put("size", pageResult.getSize());
        response.put("isFirst", pageResult.isFirst());
        response.put("isLast", pageResult.isLast());

        Map<String, Object> stats = new HashMap<>();
        stats.put("today", todayCount);
        stats.put("total", totalCount);
        stats.put("usedCouponCount", usedCouponCount);
        stats.put("unusedCouponCount", Math.max(0L, totalCount - usedCouponCount));
        stats.put("usageRate", usageRate);
        response.put("stats", stats);

        response.put("dateCounts", dateCounts);
        response.put("prizeStats", prizeStats);

        return ResponseEntity.ok(response);
    }
}