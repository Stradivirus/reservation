package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "preregistrations_preregistration")
@Getter
@Setter
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 255)
    private String email;

    @Column(unique = true, length = 11)
    private String phone;

    @Column(nullable = false)
    private Boolean privacyConsent;

    @Column(name = "coupon_code", unique = true)
    private String couponCode;

    @Column(name = "is_coupon_used", nullable = false)
    private Boolean isCouponUsed = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}