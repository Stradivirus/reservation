package com.example.backend.service;

import com.example.backend.entity.Registration;
import com.example.backend.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegistrationService {
    private final RegistrationRepository registrationRepository;

    public RegistrationService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    public boolean checkEmailExists(String email) {
        return registrationRepository.findByEmail(email).isPresent();
    }

    public boolean checkPhoneExists(String phone) {
        return registrationRepository.findByPhone(phone).isPresent();
    }

    public Registration preregister(String email, String phone, Boolean privacyConsent) {
        Registration registration = new Registration();
        registration.setEmail(email);
        registration.setPhone(phone);
        registration.setPrivacyConsent(privacyConsent);
        return registrationRepository.save(registration);
    }

    // 추가적인 등록/조회 로직도 여기에 작성할 수 있습니다.
}