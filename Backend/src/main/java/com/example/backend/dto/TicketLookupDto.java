package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TicketLookupDto {
    @NotBlank(message = "이메일 또는 전화번호를 입력해주세요.")
    private String query;
}
