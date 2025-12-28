package com.example.backend.service;

import com.example.backend.dto.PreRegistrationDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RegistrationService {
    private final RegistrationRepository registrationRepository;
    private final CouponService couponService;

    public RegistrationService(RegistrationRepository registrationRepository, CouponService couponService) {
        this.registrationRepository = registrationRepository;
        this.couponService = couponService;
    }

    public boolean checkEmailExists(String email) {
        return registrationRepository.findByEmail(email).isPresent();
    }

    public boolean checkPhoneExists(String phone) {
        return registrationRepository.findByPhone(phone).isPresent();
    }

    @Transactional
    public PreRegistrationResponseDto registerWithCoupon(PreRegistrationDto dto) {
        Registration registration = new Registration();
        registration.setEmail(dto.getEmail());
        registration.setPhone(dto.getPhone());
        registration.setPrivacyConsent(dto.getPrivacyConsent());
        
        Registration savedRegistration = registrationRepository.save(registration);
        String couponCode = couponService.generateAndAssignCoupon(savedRegistration.getEmail());

        return new PreRegistrationResponseDto("사전등록이 완료되었습니다.", couponCode);
    }

    @Transactional(readOnly = true)
    public Page<Registration> getAdminRegistrations(String dateFilter, String usageFilter, Pageable pageable) {
        Specification<Registration> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dateFilter != null && !dateFilter.equals("all") && !dateFilter.isEmpty()) {
                LocalDate date = LocalDate.parse(dateFilter);
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
                predicates.add(cb.between(root.get("createdAt"), startOfDay, endOfDay));
            }

            if (usageFilter != null && !usageFilter.equals("all") && !usageFilter.isEmpty()) {
                boolean isUsed = "used".equals(usageFilter);
                predicates.add(cb.equal(root.get("isCouponUsed"), isUsed));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return registrationRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public long getTodayRegistrationCount() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
        return registrationRepository.countByCreatedAtBetween(start, end);
    }
    
    @Transactional(readOnly = true)
    public long getTotalRegistrationCount() {
        return registrationRepository.count();
    }
    
    // [수정] 메모리 과부하 문제 해결: Repository의 최적화된 쿼리 호출
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRegistrationCountsByDate() {
        return registrationRepository.countRegistrationsByDate();
    }
}