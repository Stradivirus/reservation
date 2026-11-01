package com.example.backend.service;

import com.example.backend.dto.CouponResponseDto;
import com.example.backend.dto.PreRegistrationResponseDto;
import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class CouponService {
    private final RegistrationRepository registrationRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public static final Map<Integer, String> PRIZE_TABLE = Map.of(
            1, "가을 꽃 축제 VIP 라운지 2인 패스",
            2, "한정판 가을 꽃 축제 굿즈 패키지",
            3, "축제 푸드트럭 10,000원 이용권",
            4, "현장 웰컴 드링크 교환권"
    );

    public CouponService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    public static String getPrizeNameByRank(int rank) {
        return PRIZE_TABLE.getOrDefault(rank, "현장 웰컴 드링크 교환권");
    }

    // 내부적으로 사용하는 랜덤 코드 생성기
    private String generateCouponCode() {
        int length = 8;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(secureRandom.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * 확률 기반 경품 추첨:
     * 1등 (5%): 0 ~ 4
     * 2등 (15%): 5 ~ 19
     * 3등 (30%): 20 ~ 49
     * 4등 (50%): 50 ~ 99
     */
    private int drawPrizeRank() {
        int roll = secureRandom.nextInt(100);
        if (roll < 5) {
            return 1;
        } else if (roll < 20) {
            return 2;
        } else if (roll < 50) {
            return 3;
        } else {
            return 4;
        }
    }

    /**
     * 쿠폰 발급 (중복 방지 로직 포함)
     * 이미 발급된 사용자는 기존 코드 반환
     */
    @Transactional
    public String generateAndAssignCoupon(String email) {
        Optional<Registration> optional = registrationRepository.findByEmail(email);

        if (optional.isEmpty()) {
            throw new IllegalArgumentException("등록된 사용자가 없습니다.");
        }

        Registration reg = optional.get();

        // 이미 발급된 쿠폰이 있다면 그대로 반환
        if (reg.getCouponCode() != null) {
            return reg.getCouponCode();
        }

        // 중복 방지 로직: 유니크한 코드를 뽑을 때까지 최대 5번 시도
        String newCode = null;
        int maxRetries = 5;
        for (int i = 0; i < maxRetries; i++) {
            String candidate = generateCouponCode();
            if (!registrationRepository.existsByCouponCode(candidate)) {
                newCode = candidate;
                break;
            }
        }

        if (newCode == null) {
            throw new IllegalStateException("쿠폰 코드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }

        // DB 업데이트
        reg.setCouponCode(newCode);
        reg.setIsCouponUsed(false);
        registrationRepository.save(reg);

        return newCode;
    }

    /**
     * 추첨권 사용 및 실시간 경품 추첨 (Lucky Draw)
     * 이미 사용된 쿠폰인 경우 에러 대신 기존 당첨 내역(영수증 정보)을 반환
     */
    @Transactional
    public CouponResponseDto useCoupon(String couponCode) {
        if (couponCode == null || couponCode.isBlank()) {
            throw new IllegalArgumentException("추첨권 코드를 입력해주세요.");
        }

        String normalizedCode = couponCode.trim().toUpperCase();
        Optional<Registration> optional = registrationRepository.findByCouponCode(normalizedCode);

        if (optional.isEmpty()) {
            throw new IllegalArgumentException("유효하지 않은 추첨권 코드입니다. 코드를 다시 확인해주세요.");
        }

        Registration reg = optional.get();

        // 이미 추첨이 완료된 코드인 경우: 기존 당첨 정보를 담아 반환
        if (Boolean.TRUE.equals(reg.getIsCouponUsed())) {
            int rank = reg.getPrizeRank() != null ? reg.getPrizeRank() : 4;
            String prizeName = reg.getPrizeName() != null ? reg.getPrizeName() : getPrizeNameByRank(rank);
            return CouponResponseDto.builder()
                    .message("이미 추첨이 완료된 코드입니다.")
                    .couponCode(reg.getCouponCode())
                    .alreadyUsed(true)
                    .isCouponUsed(true)
                    .prizeRank(rank)
                    .prizeName(prizeName)
                    .usedAt(reg.getUsedAt())
                    .maskedEmail(PreRegistrationResponseDto.maskEmail(reg.getEmail()))
                    .maskedPhone(PreRegistrationResponseDto.maskPhone(reg.getPhone()))
                    .build();
        }

        // 최초 추첨 수행
        int rank = drawPrizeRank();
        String prizeName = getPrizeNameByRank(rank);
        LocalDateTime now = LocalDateTime.now();

        reg.setIsCouponUsed(true);
        reg.setPrizeRank(rank);
        reg.setPrizeName(prizeName);
        reg.setUsedAt(now);
        registrationRepository.save(reg);

        return CouponResponseDto.builder()
                .message(String.format("축하합니다! %d등 [%s]에 당첨되었습니다!", rank, prizeName))
                .couponCode(reg.getCouponCode())
                .alreadyUsed(false)
                .isCouponUsed(true)
                .prizeRank(rank)
                .prizeName(prizeName)
                .usedAt(now)
                .maskedEmail(PreRegistrationResponseDto.maskEmail(reg.getEmail()))
                .maskedPhone(PreRegistrationResponseDto.maskPhone(reg.getPhone()))
                .build();
    }

    /**
     * 추첨권 상태 단건 조회 (사용 처리하지 않고 현재 상태만 확인)
     */
    @Transactional(readOnly = true)
    public CouponResponseDto getCouponStatus(String couponCode) {
        if (couponCode == null || couponCode.isBlank()) {
            throw new IllegalArgumentException("추첨권 코드를 입력해주세요.");
        }

        String normalizedCode = couponCode.trim().toUpperCase();
        Registration reg = registrationRepository.findByCouponCode(normalizedCode)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 추첨권 코드입니다."));

        boolean used = Boolean.TRUE.equals(reg.getIsCouponUsed());
        return CouponResponseDto.builder()
                .message(used ? "이미 추첨이 완료된 코드입니다." : "사용 가능한 추첨권 코드입니다.")
                .couponCode(reg.getCouponCode())
                .alreadyUsed(used)
                .isCouponUsed(used)
                .prizeRank(reg.getPrizeRank())
                .prizeName(reg.getPrizeName())
                .usedAt(reg.getUsedAt())
                .maskedEmail(PreRegistrationResponseDto.maskEmail(reg.getEmail()))
                .maskedPhone(PreRegistrationResponseDto.maskPhone(reg.getPhone()))
                .build();
    }
}