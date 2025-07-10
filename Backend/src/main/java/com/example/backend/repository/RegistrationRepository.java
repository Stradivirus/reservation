package com.example.backend.repository;

import com.example.backend.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByEmail(String email);
    Optional<Registration> findByPhone(String phone);
    Optional<Registration> findByCouponCode(String couponCode);
}