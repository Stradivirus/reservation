package com.example.backend.repository;

import com.example.backend.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByEmail(String email);
    Optional<Registration> findByPhone(String phone);
    boolean existsByCouponCode(String couponCode);
    Optional<Registration> findByCouponCode(String couponCode);

    // 날짜 범위로 카운트 (기존 코드 유지)
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // [수정] DB에서 직접 날짜별로 그룹화하여 카운트 조회 (성능 최적화)
    // MySQL의 DATE() 함수를 사용하여 날짜 부분만 추출 후 그룹화
    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count " +
                   "FROM reservation " +
                   "GROUP BY DATE(created_at) " +
                   "ORDER BY date DESC", nativeQuery = true)
    List<Map<String, Object>> countRegistrationsByDate();
}