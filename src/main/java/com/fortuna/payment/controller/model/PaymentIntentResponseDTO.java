package com.fortuna.payment.controller.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentResponseDTO {
    private String clientSecret;
    private String paymentIntentId;
    private Long amount;
    private String currency;
}
