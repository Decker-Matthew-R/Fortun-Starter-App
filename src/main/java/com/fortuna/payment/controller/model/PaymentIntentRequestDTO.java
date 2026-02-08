package com.fortuna.payment.controller.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentRequestDTO {

    @Min(value = 50, message = "Amount must be at least 50 cents")
    private Long amount;

    @NotBlank(message = "Currency is required")
    private String currency = "usd";

    private String description;
    private String customerEmail;

    private String orderId;
    private String userId;
}
