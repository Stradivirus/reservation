package com.example.backend.repository;

import com.example.backend.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// [변경] JpaSpecificationExecutor<Registration> 추가 (동적 쿼리용)
public interface RegistrationRepository extends JpaRepository<Registration, Long>, JpaSpecificationExecutor<Registration> {
    Optional<Registration> findByEmail(String email);
    Optional<Registration> findByPhone(String phone);
    Optional<Registration> findByCouponCode(String couponCode);
    
    boolean existsByCouponCode(String couponCode);

    // [추가] 오늘 가입자 수 카운트
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // [추가] 일별 가입자 통계 (JPQL)
    // DB 종류(MySQL/Postgres)에 따라 날짜 변환 함수가 다를 수 있어, 가장 범용적인 방식인 range로 처리하거나
    // 네이티브 쿼리를 사용하는 것이 좋으나, 우선 Spring Data JPA의 투명성을 위해 DTO Projection이나 Service단 집계를 권장합니다.
    // 여기서는 간단히 Service에서 날짜별로 Grouping 하도록 전체 데이터를 가져오거나 필요한 날짜만 조회하도록 합니다.
}