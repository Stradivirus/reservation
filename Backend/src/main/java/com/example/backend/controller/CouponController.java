package com.example.backend.controller;

import com.example.backend.dto.CouponResponseDto;
import com.example.backend.dto.UseCouponDto;
import com.example.backend.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coupon")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/generate")
    public ResponseEntity<CouponResponseDto> generateCoupon(@RequestParam String email) {
        try {
            String couponCode = couponService.generateAndAssignCoupon(email);
            return ResponseEntity.ok(new CouponResponseDto("쿠폰 발급 완료", couponCode));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new CouponResponseDto(e.getMessage(), null));
        }
    }

    @PostMapping("/use")
    public ResponseEntity<CouponResponseDto> useCoupon(@RequestBody UseCouponDto dto) {
        try {
            CouponResponseDto result = couponService.useCoupon(dto.getCouponCode());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(new CouponResponseDto(e.getMessage(), dto.getCouponCode()));
        }
    }

    @GetMapping("/status/{couponCode}")
    public ResponseEntity<CouponResponseDto> getCouponStatus(@PathVariable String couponCode) {
        try {
            CouponResponseDto status = couponService.getCouponStatus(couponCode);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new CouponResponseDto(e.getMessage(), couponCode));
        }
    }
}