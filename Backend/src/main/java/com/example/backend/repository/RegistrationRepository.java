package com.example.backend.repository;

import com.example.backend.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // 이 import가 필요합니다
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long>, JpaSpecificationExecutor<Registration> { 
    // ↑ 여기에 JpaSpecificationExecutor<Registration> 추가됨

    Optional<Registration> findByEmail(String email);
    Optional<Registration> findByPhone(String phone);
    boolean existsByCouponCode(String couponCode);
    Optional<Registration> findByCouponCode(String couponCode);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // [수정] Map 대신 Object[] 배열로 반환 (컴파일 안전성 확보)
    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count " +
                   "FROM reservation " +
                   "GROUP BY DATE(created_at) " +
                   "ORDER BY date DESC", nativeQuery = true)
    List<Object[]> countRegistrationsByDate();
}