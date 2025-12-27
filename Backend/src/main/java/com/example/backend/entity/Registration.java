package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Getter
@Setter
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String phone;

    @Column(name = "privacy_consent")
    private Boolean privacyConsent;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "coupon_code", unique = true, length = 8)
    private String couponCode;

    @Column(name = "is_coupon_used")
    private Boolean isCouponUsed;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isCouponUsed == null) {
            this.isCouponUsed = false;
        }
    }
}