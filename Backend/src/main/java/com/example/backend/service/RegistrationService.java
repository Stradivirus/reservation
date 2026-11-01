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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        registration.setEmail(dto.getEmail().trim());
        registration.setPhone(dto.getPhone().replaceAll("[^0-9]", ""));
        registration.setPrivacyConsent(dto.getPrivacyConsent());

        Registration savedRegistration = registrationRepository.save(registration);
        String couponCode = couponService.generateAndAssignCoupon(savedRegistration.getEmail());
        savedRegistration.setCouponCode(couponCode);

        return PreRegistrationResponseDto.fromEntity("사전등록이 완료되었습니다.", savedRegistration);
    }

    @Transactional(readOnly = true)
    public PreRegistrationResponseDto lookupTicket(String rawQuery) {
        if (rawQuery == null || rawQuery.isBlank()) {
            throw new IllegalArgumentException("이메일 또는 전화번호를 입력해주세요.");
        }

        String query = rawQuery.trim();
        Registration reg = null;

        if (query.contains("@")) {
            reg = registrationRepository.findByEmail(query).orElse(null);
        } else {
            String digitsOnly = query.replaceAll("[^0-9]", "");
            if (!digitsOnly.isEmpty()) {
                reg = registrationRepository.findByPhone(digitsOnly).orElse(null);
            }
            if (reg == null) {
                reg = registrationRepository.findByCouponCode(query.toUpperCase()).orElse(null);
            }
        }

        if (reg == null) {
            throw new IllegalArgumentException("입력하신 정보로 등록된 사전예약 내역을 찾을 수 없습니다.");
        }

        return PreRegistrationResponseDto.fromEntity("사전예약 티켓 조회가 완료되었습니다.", reg);
    }

    @Transactional(readOnly = true)
    public Page<Registration> getAdminRegistrations(
            String dateFilter,
            String usageFilter,
            String prizeRankFilter,
            String searchKeyword,
            Pageable pageable
    ) {
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

            if (prizeRankFilter != null && !prizeRankFilter.equals("all") && !prizeRankFilter.isEmpty()) {
                try {
                    int rank = Integer.parseInt(prizeRankFilter);
                    predicates.add(cb.equal(root.get("prizeRank"), rank));
                } catch (NumberFormatException ignored) {
                }
            }

            if (searchKeyword != null && !searchKeyword.isBlank()) {
                String trimmed = searchKeyword.trim();
                String likePattern = "%" + trimmed.toLowerCase() + "%";
                String phonePattern = "%" + trimmed.replaceAll("[^0-9]", "") + "%";

                List<Predicate> searchPredicates = new ArrayList<>();
                searchPredicates.add(cb.like(cb.lower(root.get("email")), likePattern));
                searchPredicates.add(cb.like(cb.lower(root.get("couponCode")), likePattern));
                if (!trimmed.replaceAll("[^0-9]", "").isEmpty()) {
                    searchPredicates.add(cb.like(root.get("phone"), phonePattern));
                } else {
                    searchPredicates.add(cb.like(root.get("phone"), likePattern));
                }

                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
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

    @Transactional(readOnly = true)
    public long getUsedCouponCount() {
        return registrationRepository.countByIsCouponUsedTrue();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPrizeDistribution() {
        List<Object[]> rows = registrationRepository.countByPrizeRank();
        Map<Integer, Long> rankCountMap = new HashMap<>();
        for (Object[] row : rows) {
            if (row[0] != null) {
                int rank = ((Number) row[0]).intValue();
                long count = ((Number) row[1]).longValue();
                rankCountMap.put(rank, count);
            }
        }

        List<Map<String, Object>> distribution = new ArrayList<>();
        for (int rank = 1; rank <= 4; rank++) {
            Map<String, Object> item = new HashMap<>();
            item.put("rank", rank);
            item.put("prizeName", CouponService.getPrizeNameByRank(rank));
            item.put("count", rankCountMap.getOrDefault(rank, 0L));
            distribution.add(item);
        }
        return distribution;
    }

    // [수정 포인트] DB에서 가져온 배열(Object[])을 Map으로 변환하여 반환
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRegistrationCountsByDate() {
        List<Object[]> results = registrationRepository.countRegistrationsByDate();

        return results.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            // record[0]: date (SQL Date -> String)
            // record[1]: count (Long)
            map.put("date", record[0].toString());
            map.put("count", record[1]);
            return map;
        }).collect(Collectors.toList());
    }
}