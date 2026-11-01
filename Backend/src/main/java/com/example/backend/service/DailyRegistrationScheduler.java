package com.example.backend.service;

import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

@Component
public class DailyRegistrationScheduler {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final String[] EMAIL_PREFIXES = {
            "autumn", "blossom", "cosmos", "flower", "maple", "garden", "festival",
            "picnic", "sunset", "breeze", "leaf", "october", "golden", "nature",
            "minji", "seojun", "jiwoo", "hayoon", "dohyun", "suah", "jimin", "yuna"
    };
    private static final String[] EMAIL_DOMAINS = {
            "gmail.com", "naver.com", "kakao.com", "daum.net", "icloud.com"
    };
    private static final String COUPON_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final RegistrationRepository registrationRepository;
    private final SecureRandom random = new SecureRandom();

    public DailyRegistrationScheduler(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    /**
     * 서버 최초 기동 시 데이터가 10건 미만이면 최근 5일치(하루 10건씩 총 50건) 초기 데모 데이터를 자동 시딩
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedInitialDataIfEmpty() {
        long currentCount = registrationRepository.count();
        if (currentCount >= 10) {
            return;
        }

        LocalDate today = LocalDate.now(KST);
        for (int daysAgo = 4; daysAgo >= 0; daysAgo--) {
            LocalDate targetDate = today.minusDays(daysAgo);
            generateRandomBatchForDate(targetDate, 10);
        }
        System.out.println("[DailyRegistrationScheduler] 초기 5일치(50건) 사전예약 및 추첨 데이터 시딩 완료");
    }

    /**
     * 매일 자정(00:05 KST)에 당일 사전예약 데이터 10건을 랜덤으로 자동 생성
     */
    @Scheduled(cron = "0 5 0 * * *", zone = "Asia/Seoul")
    @Transactional
    public void generateDailyTenRegistrations() {
        LocalDate today = LocalDate.now(KST);
        int created = generateRandomBatchForDate(today, 10);
        System.out.println("[DailyRegistrationScheduler] " + today + " 일일 랜덤 사전예약 " + created + "건 생성 완료");
    }

    @Transactional
    public int generateRandomBatchForDate(LocalDate date, int count) {
        int created = 0;
        for (int i = 0; i < count; i++) {
            String email = generateUniqueEmail();
            String phone = generateUniquePhone();
            String couponCode = generateUniqueCouponCode();

            int hour = 8 + random.nextInt(13); // 08:00 ~ 20:59
            int minute = random.nextInt(60);
            int second = random.nextInt(60);
            LocalDateTime createdAt = LocalDateTime.of(date, LocalTime.of(hour, minute, second));

            Registration reg = new Registration();
            reg.setEmail(email);
            reg.setPhone(phone);
            reg.setPrivacyConsent(true);
            reg.setCreatedAt(createdAt);
            reg.setCouponCode(couponCode);

            // 약 65% 확률로 추첨권 사용 및 등급별 경품 당첨 처리
            boolean used = random.nextInt(100) < 65;
            reg.setIsCouponUsed(used);
            if (used) {
                int rank = drawWeightedPrizeRank();
                reg.setPrizeRank(rank);
                reg.setPrizeName(CouponService.getPrizeNameByRank(rank));
                reg.setUsedAt(createdAt.plusMinutes(5 + random.nextInt(120)));
            }

            registrationRepository.save(reg);
            created++;
        }
        return created;
    }

    private int drawWeightedPrizeRank() {
        int roll = random.nextInt(100);
        if (roll < 5) return 1;
        if (roll < 20) return 2;
        if (roll < 50) return 3;
        return 4;
    }

    private String generateUniqueEmail() {
        for (int attempt = 0; attempt < 20; attempt++) {
            String prefix = EMAIL_PREFIXES[random.nextInt(EMAIL_PREFIXES.length)];
            int num = 100 + random.nextInt(9000);
            String domain = EMAIL_DOMAINS[random.nextInt(EMAIL_DOMAINS.length)];
            String candidate = prefix + num + "@" + domain;
            if (registrationRepository.findByEmail(candidate).isEmpty()) {
                return candidate;
            }
        }
        return "guest" + System.nanoTime() % 1000000 + "@gmail.com";
    }

    private String generateUniquePhone() {
        for (int attempt = 0; attempt < 20; attempt++) {
            int mid = 1000 + random.nextInt(9000);
            int last = 1000 + random.nextInt(9000);
            String candidate = String.format("010%04d%04d", mid, last);
            if (registrationRepository.findByPhone(candidate).isEmpty()) {
                return candidate;
            }
        }
        return String.format("010%08d", Math.abs((int) (System.nanoTime() % 100000000)));
    }

    private String generateUniqueCouponCode() {
        for (int attempt = 0; attempt < 20; attempt++) {
            StringBuilder sb = new StringBuilder(8);
            for (int i = 0; i < 8; i++) {
                sb.append(COUPON_CHARS.charAt(random.nextInt(COUPON_CHARS.length())));
            }
            String candidate = sb.toString();
            if (!registrationRepository.existsByCouponCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("유니크 쿠폰 코드 생성 실패");
    }
}
