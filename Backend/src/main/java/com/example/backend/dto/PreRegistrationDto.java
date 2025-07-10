package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreRegistrationDto {
    private String email;
    private String phone;
    private Boolean privacyConsent;
}